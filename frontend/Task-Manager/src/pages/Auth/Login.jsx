import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { useLanguage } from "../../context/languageContext";

const translations = {
  FR: {
    title: "Bienvenue",
    subtitle: "Connectez-vous pour accéder à votre espace de gestion",
    emailLabel: "Adresse Email",
    emailPlaceholder: "john@example.com",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Min 8 caractères",
    submitButton: "SE CONNECTER",
    noAccount: "Pas encore de compte ?",
    account_locked: "Compte verrouillé. Réessayez dans {{minutes}} minute(s).",
    signUpLink: "S'inscrire",
    forgotPassword: "Mot de passe oublié ?",
    invalid_credentials: "Email ou mot de passe invalide.",
    email_not_verified: "Veuillez confirmer votre adresse email avant de vous connecter.",
    errors: {
      invalidEmail: "Veuillez entrer une adresse email valide.",
      missingPassword: "Veuillez entrer le mot de passe",
      somethingWrong: "Une erreur s'est produite. Veuillez réessayer.",
    },
  },
  EN: {
    title: "Welcome",
    subtitle: "Sign in to access your management space",
    emailLabel: "Email Address",
    emailPlaceholder: "john@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Min 8 characters",
    submitButton: "SIGN IN",
    noAccount: "Don't have an account?",
    account_locked: "Account locked. Try again in {{minutes}} minute(s).",
    signUpLink: "Sign up",
    forgotPassword: "Forgot password?",
    invalid_credentials: "Invalid email or password.",
    email_not_verified: "Please confirm your email address before logging in.",
    errors: {
      invalidEmail: "Please enter a valid email address.",
      missingPassword: "Please enter the password",
      somethingWrong: "Something went wrong. Please try again.",
    },
  },
  DE: {
    title: "Willkommen",
    subtitle: "Melden Sie sich an, um auf Ihren Verwaltungsbereich zuzugreifen",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "john@beispiel.com",
    passwordLabel: "Passwort",
    passwordPlaceholder: "Min. 8 Zeichen",
    submitButton: "ANMELDEN",
    noAccount: "Noch kein Konto?",
    account_locked: "Konto gesperrt. Versuchen Sie es in {{minutes}} Minute(n) erneut.",
    signUpLink: "Registrieren",
    forgotPassword: "Passwort vergessen?",
    invalid_credentials: "Ungültige E-Mail oder Passwort.",
    email_not_verified: "Bitte bestätigen Sie Ihre E-Mail-Adresse, bevor Sie sich anmelden.",
    errors: {
      invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      missingPassword: "Bitte geben Sie das Passwort ein",
      somethingWrong: "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",
    },
  },
  IT: {
    title: "Benvenuto",
    subtitle: "Accedi per accedere al tuo spazio di gestione",
    emailLabel: "Indirizzo Email",
    emailPlaceholder: "john@esempio.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Min 8 caratteri",
    submitButton: "ACCEDI",
    noAccount: "Non hai ancora un account?",
    account_locked: "Account bloccato. Riprova tra {{minutes}} minuto/i.",
    signUpLink: "Registrati",
    forgotPassword: "Password dimenticata?",
    invalid_credentials: "Email o password non validi.",
    email_not_verified: "Per favore, conferma il tuo indirizzo email prima di accedere.",
    errors: {
      invalidEmail: "Inserisci un indirizzo email valido.",
      missingPassword: "Inserisci la password",
      somethingWrong: "Qualcosa è andato storto. Riprova.",
    },
  },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { lang } = useLanguage();
  const copy = translations[lang] ?? translations.FR;

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError(copy.errors.invalidEmail);
      return;
    }

    if (!password) {
      setError(copy.errors.missingPassword);
      return;
    }

    setError("");
    setLoading(true);

    //Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, refreshToken, user } = response.data;

      if (token && refreshToken && user) {
        updateUser(response.data);

        //Redirect based on role
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        setError(copy.errors.somethingWrong);
      }
    } catch (error){
      const errorData = error.response?.data;
      if (errorData) {
        // Gère les erreurs avec clé de traduction (i18n)
        if (errorData.i18nKey) {
          let message = copy[errorData.i18nKey] || errorData.i18nKey;
          if (errorData.params) {
            message = message.replace("{{minutes}}", errorData.params.minutes);
          }
          setError(message);
        } else {
          setError(errorData.message || copy.errors.somethingWrong);
        }
      } else {
        setError(copy.errors.somethingWrong);
      }
      setPassword(""); // Vider le mot de passe pour la sécurité
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md flex-1 flex flex-col justify-center">
        <div className="mb-12">
          <h3 className="text-4xl font-light text-[#1e4029] mb-4 tracking-tight">
            {copy.title}
          </h3>
          <p className="text-lg text-gray-600 font-light">
            {copy.subtitle}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-light mb-2 text-base">
              {copy.emailLabel}
            </label>
            <input
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder={copy.emailPlaceholder}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5f3f] transition-colors font-light text-base"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-light mb-2 text-base">
              {copy.passwordLabel}
            </label>
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder={copy.passwordPlaceholder}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5f3f] transition-colors font-light text-base"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 text-sm font-light">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <Link
              className="text-[#2d5f3f] hover:text-[#5a8f6f] font-normal underline transition-colors"
              to="/forgot-password"
            >
              {copy.forgotPassword}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-[#2d5f3f] text-white py-4 rounded-xl font-light text-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "..." : copy.submitButton}
          </button>

          <div className="text-center pt-4">
            <p className="text-base text-gray-600 font-light">
              {copy.noAccount}{" "}
              <Link 
                className="text-[#2d5f3f] hover:text-[#5a8f6f] font-normal underline transition-colors" 
                to="/signup"
              >
                {copy.signUpLink}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
