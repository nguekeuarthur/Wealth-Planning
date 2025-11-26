import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useLanguage } from "../../context/languageContext";
import { validateEmail } from "../../utils/helper";
import { Link } from "react-router-dom";

const translations = {
  FR: {
    title: "Mot de passe oublié",
    subtitle:
      "Entrez votre adresse email et nous vous enverrons un lien de réinitialisation.",
    emailLabel: "Adresse Email *",
    emailPlaceholder: "john@example.com",
    submitButton: "ENVOYER LE LIEN",
    backToLogin: "Retour à la connexion",
    success:
      "Si ce compte existe, un email de réinitialisation a été envoyé.",
    errors: {
      invalidEmail: "Veuillez entrer une adresse email valide.",
      somethingWrong: "Une erreur s'est produite. Veuillez réessayer.",
    },
  },
  EN: {
    title: "Forgot password",
    subtitle:
      "Enter your email address and we'll send you a reset link.",
    emailLabel: "Email Address *",
    emailPlaceholder: "john@example.com",
    submitButton: "SEND LINK",
    backToLogin: "Back to login",
    success: "If this account exists, a reset email has been sent.",
    errors: {
      invalidEmail: "Please enter a valid email address.",
      somethingWrong: "Something went wrong. Please try again.",
    },
  },
  DE: {
    title: "Passwort vergessen",
    subtitle:
      "Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link.",
    emailLabel: "E-Mail-Adresse *",
    emailPlaceholder: "john@beispiel.com",
    submitButton: "LINK SENDEN",
    backToLogin: "Zurück zur Anmeldung",
    success:
      "Falls dieses Konto existiert, wurde eine E-Mail versendet.",
    errors: {
      invalidEmail: "Bitte eine gültige E-Mail-Adresse eingeben.",
      somethingWrong: "Etwas ist schief gelaufen. Bitte erneut versuchen.",
    },
  },
  IT: {
    title: "Password dimenticata",
    subtitle:
      "Inserisci il tuo indirizzo email e ti invieremo un link.",
    emailLabel: "Indirizzo Email *",
    emailPlaceholder: "john@esempio.com",
    submitButton: "INVIA LINK",
    backToLogin: "Torna al login",
    success:
      "Se l'account esiste, è stata inviata un'email di reset.",
    errors: {
      invalidEmail: "Inserisci un indirizzo email valido.",
      somethingWrong: "Qualcosa è andato storto. Riprova.",
    },
  },
};

const ForgotPassword = () => {
  const { lang } = useLanguage();
  const copy = translations[lang] ?? translations.FR;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError(copy.errors.invalidEmail);
      return;
    }

    setError("");
    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, {
        email,
        language: lang,
      });
      setMessage(copy.success);
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
              {copy.emailLabel}
            </label>
            <Input
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder={copy.emailPlaceholder}
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

export default ForgotPassword;
