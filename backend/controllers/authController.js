const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const { sendEmail, buildEmailTemplate } = require("../services/emailService");
const { logAuthEvent } = require("../services/auditLogger");
const { generateRandomToken, hashToken } = require("../utils/tokenUtils");

const FRONTEND_URL =
  process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173";
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_TOKEN_DAYS = Number(process.env.JWT_REFRESH_EXPIRES_DAYS || 7);
const PASSWORD_RESET_TOKEN_MINUTES = Number(
  process.env.PASSWORD_RESET_TOKEN_MINUTES || 15
);
const EMAIL_VERIFICATION_HOURS = Number(
  process.env.EMAIL_VERIFICATION_EXPIRES_HOURS || 24
);
const MAX_LOGIN_ATTEMPTS = Number(process.env.MAX_LOGIN_ATTEMPTS || 5);
const LOGIN_LOCK_DURATION_MIN = Number(
  process.env.LOGIN_LOCK_DURATION_MIN || 5
);

const emailTranslations = {
  FR: {
    verifyEmail: {
      subject: "Confirmez votre adresse email",
      greeting: (name) => `Bonjour ${name},`,
      message: "Merci de vous être inscrit sur Wealth Planning. Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et accéder à votre espace sécurisé.",
      buttonLabel: "Confirmer mon email",
      secondaryText: (hours) => `Ce lien expirera dans ${hours} heures.`,
    },
    resetPassword: {
      subject: "Réinitialisation de mot de passe",
      greeting: (name) => `Bonjour ${name},`,
      message: "Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe en toute sécurité.",
      buttonLabel: "Réinitialiser mon mot de passe",
      secondaryText: (minutes) => `Ce lien expirera dans ${minutes} minutes.`,
      footerText: "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.",
    },
  },
  EN: {
    verifyEmail: {
      subject: "Confirm your email address",
      greeting: (name) => `Hello ${name},`,
      message: "Thank you for registering with Wealth Planning. Click the button below to confirm your email address and access your secure space.",
      buttonLabel: "Confirm my email",
      secondaryText: (hours) => `This link will expire in ${hours} hours.`,
    },
    resetPassword: {
      subject: "Password Reset",
      greeting: (name) => `Hello ${name},`,
      message: "You have requested to reset your password. Click the button below to securely set a new password.",
      buttonLabel: "Reset my password",
      secondaryText: (minutes) => `This link will expire in ${minutes} minutes.`,
      footerText: "If you did not make this request, please ignore this email.",
    },
  },
  // Ajoutez DE et IT sur le même modèle
  DE: {
    verifyEmail: {
      subject: "Bestätigen Sie Ihre E-Mail-Adresse",
      greeting: (name) => `Hallo ${name},`,
      message: "Danke für Ihre Registrierung. Klicken Sie unten, um Ihre E-Mail zu bestätigen.",
      buttonLabel: "E-Mail bestätigen",
      secondaryText: (hours) => `Dieser Link läuft in ${hours} Stunden ab.`,
    },
    resetPassword: {
      subject: "Passwort zurücksetzen",
      greeting: (name) => `Hallo ${name},`,
      message: "Sie haben eine Anfrage zum Zurücksetzen des Passworts gesendet. Klicken Sie unten.",
      buttonLabel: "Passwort zurücksetzen",
      secondaryText: (minutes) => `Dieser Link läuft in ${minutes} Minuten ab.`,
      footerText: "Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.",
    },
  },
  IT: {
    verifyEmail: {
      subject: "Conferma il tuo indirizzo email",
      greeting: (name) => `Ciao ${name},`,
      message: "Grazie per esserti registrato. Clicca qui sotto per confermare la tua email.",
      buttonLabel: "Conferma la mia email",
      secondaryText: (hours) => `Questo link scadrà tra ${hours} ore.`,
    },
    resetPassword: {
      subject: "Reimpostazione della password",
      greeting: (name) => `Ciao ${name},`,
      message: "Hai richiesto di reimpostare la password. Clicca il pulsante in basso.",
      buttonLabel: "Reimposta la mia password",
      secondaryText: (minutes) => `Questo link scadrà tra ${minutes} minuti.`,
      footerText: "Se non hai effettuato tu questa richiesta, ignora questa email.",
    },
  },
};

const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

const buildUserPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImageUrl: user.profileImageUrl,
  isEmailVerified: user.isEmailVerified,
  lastLoginAt: user.lastLoginAt,
});

const getClientIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
  req.socket?.remoteAddress ||
  req.ip;

const createRefreshToken = async (userId, ipAddress) => {
  const refreshToken = generateRandomToken(40);
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000
  );

  await RefreshToken.create({
    user: userId,
    tokenHash,
    expiresAt,
    createdByIp: ipAddress || null,
  });

  return { refreshToken, expiresAt };
};

const revokeRefreshToken = async (token, metadata = {}) => {
  const tokenHash = hashToken(token);
  return RefreshToken.findOneAndUpdate(
    { tokenHash, revokedAt: null },
    {
      revokedAt: new Date(),
      ...metadata,
    },
    { new: true }
  );
};

const normalizeEmail = (email) => email?.trim().toLowerCase();

const sendVerificationEmail = async (user, lang = 'FR') => {
  const rawToken = generateRandomToken(32);
  user.emailVerificationToken = hashToken(rawToken);
  user.emailVerificationExpires = new Date(
    Date.now() + EMAIL_VERIFICATION_HOURS * 60 * 60 * 1000
  );
  await user.save();

  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${rawToken}`;

  const copy = emailTranslations[lang.toUpperCase()] || emailTranslations.FR;
  const emailContent = copy.verifyEmail;

  const html = buildEmailTemplate({
    greeting: emailContent.greeting(user.name),
    message: emailContent.message,
    buttonLabel: emailContent.buttonLabel,
    buttonUrl: verificationUrl,
    secondaryText: emailContent.secondaryText(
      EMAIL_VERIFICATION_HOURS
    ),
  });

  await sendEmail({
    to: user.email,
    subject: emailContent.subject,
    html,
  });

  await logAuthEvent({
    user: user._id,
    email: user.email,
    event: "email_verification_sent",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, adminInviteToken, language } =
      req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email et mot de passe sont requis." });
    }

    const normalizedEmail = normalizeEmail(email);
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "Un utilisateur existe déjà." });
    }

    let role = "member";
    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      profileImageUrl,
      role,
      language: language?.toUpperCase() || 'FR',
      isEmailVerified: false,
    });

    await logAuthEvent({
      user: user._id,
      email: user.email,
      event: "register",
    });

    await sendVerificationEmail(user, user.language);

    res.status(201).json({
      message:
        "Compte créé. Vérifiez votre email pour activer votre compte.",
      requiresEmailVerification: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email et mot de passe sont requis." });
    }
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      await logAuthEvent({
        email: normalizedEmail,
        event: "login_failure",
        metadata: { reason: "user_not_found" },
      });
      return res.status(401).json({ message: "Email ou mot de passe invalide" });
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingMs = user.lockUntil - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      return res.status(423).json({
        i18nKey: "account_locked",
        params: {
          minutes: remainingMin,
        },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(
          Date.now() + LOGIN_LOCK_DURATION_MIN * 60 * 1000
        );
        user.loginAttempts = 0;
      }
      await user.save();

      await logAuthEvent({
        user: user._id,
        email: user.email,
        event: "login_failure",
        metadata: { reason: "invalid_password" },
      });
      return res.status(401).json({ message: "Email ou mot de passe invalide" });
    }

    if (user.isEmailVerified === false) {
      return res.status(403).json({
        message:
          "Veuillez confirmer votre adresse email avant de vous connecter.",
      });
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const { refreshToken, expiresAt } = await createRefreshToken(
      user._id,
      getClientIp(req)
    );

    await logAuthEvent({
      user: user._id,
      email: user.email,
      event: "login_success",
      metadata: { refreshTokenExpiresAt: expiresAt },
    });

    res.json({
      user: buildUserPayload(user),
      token: accessToken,
      refreshToken,
      refreshTokenExpiresAt: expiresAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token requis." });
    }

    const hashed = hashToken(refreshToken);
    const storedToken = await RefreshToken.findOne({
      tokenHash: hashed,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    }).populate("user");

    if (!storedToken || !storedToken.user) {
      return res.status(401).json({ message: "Refresh token invalide." });
    }

    const user = storedToken.user;
    if (user.isEmailVerified === false) {
      return res.status(403).json({
        message: "Compte non vérifié. Veuillez confirmer votre email.",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const { refreshToken: newRefreshToken, expiresAt } = await createRefreshToken(
      user._id,
      getClientIp(req)
    );

    storedToken.revokedAt = new Date();
    storedToken.revokedByIp = getClientIp(req);
    storedToken.replacedByToken = hashToken(newRefreshToken);
    await storedToken.save();

    res.json({
      user: buildUserPayload(user),
      token: accessToken,
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt: expiresAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Logout user (invalidate refresh token)
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    let storedToken;
    if (refreshToken) {
      storedToken = await revokeRefreshToken(refreshToken, {
        revokedByIp: getClientIp(req),
      });
    }
    await logAuthEvent({
      event: "logout",
      user: storedToken?.user,
    });
    res.json({ message: "Déconnexion réussie." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email, language } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Adresse email requise." });
    }
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({
        message: "Si le compte existe, un email a été envoyé.",
      });
    }

    const rawToken = generateRandomToken(32);
    user.passwordResetToken = hashToken(rawToken);
    user.passwordResetExpires = new Date(
      Date.now() + PASSWORD_RESET_TOKEN_MINUTES * 60 * 1000
    );
    await user.save();

    const resetUrl = `${FRONTEND_URL}/reset-password?token=${rawToken}`;

    const lang = language?.toUpperCase() || user.language || 'FR';
    const copy = emailTranslations[lang] || emailTranslations.FR;
    const emailContent = copy.resetPassword;

    const html = buildEmailTemplate({
      greeting: emailContent.greeting(user.name),
      message: emailContent.message,
      buttonLabel: emailContent.buttonLabel,
      buttonUrl: resetUrl,
      secondaryText: emailContent.secondaryText(
        PASSWORD_RESET_TOKEN_MINUTES
      ),
      footerText: emailContent.footerText,
    });

    await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      html,
    });

    await logAuthEvent({
      user: user._id,
      email: user.email,
      event: "password_reset_requested",
    });

    res.json({ message: "Si le compte existe, un email a été envoyé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token et nouveau mot de passe requis." });
    }

    const hashedToken = hashToken(token);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token invalide ou expiré. Recommencez." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.loginAttempts = 0;
    user.lockUntil = null;

    await user.save();
    await RefreshToken.deleteMany({ user: user._id });

    await logAuthEvent({
      user: user._id,
      email: user.email,
      event: "password_reset_success",
    });

    res.json({ message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Token manquant." });
    }

    const hashedToken = hashToken(token);
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token invalide ou expiré. Demandez un nouveau lien." });
    }

    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    await logAuthEvent({
      user: user._id,
      email: user.email,
      event: "email_verified",
    });

    res.json({ message: "Email confirmé avec succès. Vous pouvez vous connecter." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerificationEmail = async (req, res) => {
  try {
    const { email, language } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Adresse email requise." });
    }
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Aucun compte associé à cet email." });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email déjà vérifié." });
    }

    await sendVerificationEmail(user, language || user.language);
    res.json({ message: "Email de vérification renvoyé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const {
      name,
      email,
      profileImageUrl,
      currentPassword,
      newPassword,
    } = req.body;

    if (name) user.name = name;
    if (typeof profileImageUrl !== "undefined") {
      user.profileImageUrl = profileImageUrl;
    }

    if (email && email !== user.email) {
      const normalizedEmail = normalizeEmail(email);
      const exists = await User.findOne({ email: normalizedEmail });
      if (exists) {
        return res.status(400).json({ message: "Email déjà utilisé." });
      }
      user.email = normalizedEmail;
      user.isEmailVerified = false;
      await sendVerificationEmail(user, req.body.language || user.language);
    }

    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Mot de passe actuel requis pour la mise à jour." });
      }
      const isCurrentValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isCurrentValid) {
        return res.status(401).json({ message: "Mot de passe actuel invalide." });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await user.save();

    await logAuthEvent({
      user: updatedUser._id,
      email: updatedUser.email,
      event: "profile_updated",
    });

    res.json({
      user: buildUserPayload(updatedUser),
      token: generateAccessToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  getUserProfile,
  updateUserProfile,
};
