import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useLanguage } from "../../context/languageContext";

const translations = {
  FR: {
    title: "Réinitialiser le mot de passe",
    subtitle: "Choisissez un nouveau mot de passe sécurisé.",
    passwordLabel: "Nouveau mot de passe *",
    confirmLabel: "Confirmer le mot de passe *",
    submitButton: "METTRE À JOUR",
    success: "Mot de passe mis à jour. Vous pouvez maintenant vous connecter.",
    missingToken:
      "Lien invalide ou expiré. Veuillez refaire une demande depuis la page 'Mot de passe oublié'.",
    backToLogin: "Retour à la connexion",
    errors: {
      mismatch: "Les mots de passe ne correspondent pas.",
      missingPassword: "Veuillez renseigner un nouveau mot de passe.",
      somethingWrong: "Une erreur s'est produite. Veuillez réessayer.",
    },
  },
  EN: {
    title: "Reset password",
    subtitle: "Choose a new secure password.",
    passwordLabel: "New password *",
    confirmLabel: "Confirm password *",
    submitButton: "UPDATE",
    success: "Password updated. You can now sign in.",
    missingToken:
      "Invalid or expired link. Please request a new one from the forgot password page.",
    backToLogin: "Back to login",
    errors: {
      mismatch: "Passwords do not match.",
      missingPassword: "Please provide a new password.",
      somethingWrong: "Something went wrong. Please try again.",
    },
  },
  DE: {
    title: "Passwort zurücksetzen",
    subtitle: "Wählen Sie ein neues sicheres Passwort.",
    passwordLabel: "Neues Passwort *",
    confirmLabel: "Passwort bestätigen *",
    submitButton: "AKTUALISIEREN",
    success: "Passwort aktualisiert. Sie können sich jetzt anmelden.",
    missingToken:
      "Ungültiger oder abgelaufener Link. Fordern Sie einen neuen Link an.",
    backToLogin: "Zurück zur Anmeldung",
    errors: {
      mismatch: "Die Passwörter stimmen nicht überein.",
      missingPassword: "Bitte geben Sie ein neues Passwort ein.",
      somethingWrong: "Etwas ist schief gelaufen. Bitte erneut versuchen.",
    },
  },
  IT: {
    title: "Reimposta password",
    subtitle: "Scegli una nuova password sicura.",
    passwordLabel: "Nuova password *",
    confirmLabel: "Conferma password *",
    submitButton: "AGGIORNA",
    success: "Password aggiornata. Ora puoi accedere.",
    missingToken:
      "Link non valido o scaduto. Richiedine uno nuovo.",
    backToLogin: "Torna al login",
    errors: {
      mismatch: "Le password non coincidono.",
      missingPassword: "Inserisci una nuova password.",
      somethingWrong: "Qualcosa è andato storto. Riprova.",
    },
  },
};

const ResetPassword = () => {
  const { lang } = useLanguage();
  const copy = translations[lang] ?? translations.FR;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(copy.missingToken);
    }
  }, [token, copy.missingToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError(copy.missingToken);
      return;
    }

    if (!password) {
      setError(copy.errors.missingPassword);
      return;
    }

    if (password !== confirmPassword) {
      setError(copy.errors.mismatch);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        token,
        password,
      });
      setMessage(copy.success);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(
        err.response?.data?.message || copy.errors.somethingWrong
      );
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
          <p className="text-lg text-gray-600 font-light">{copy.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-light mb-2 text-base">
              {copy.passwordLabel}
            </label>
            <Input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-light mb-2 text-base">
              {copy.confirmLabel}
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={({ target }) => setConfirmPassword(target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 text-sm font-light">{error}</p>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-700 text-sm font-light">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-[#2d5f3f] text-white py-4 rounded-xl font-light text-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "..." : copy.submitButton}
          </button>

          <div className="text-center pt-4">
            <Link
              className="text-[#2d5f3f] hover:text-[#5a8f6f] font-normal underline transition-colors"
              to="/login"
            >
              {copy.backToLogin}
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;

