import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useLanguage } from "../../context/languageContext";
import Input from "../../components/Inputs/Input";

const translations = {
  FR: {
    title: "Vérification de l'email",
    waiting: "Vérification en cours...",
    success: "Votre adresse email est confirmée. Vous pouvez vous connecter.",
    error:
      "Le lien est invalide ou expiré. Demandez un nouveau lien ci-dessous.",
    resendTitle: "Renvoyer le lien de vérification",
    resendButton: "Renvoyer",
    emailPlaceholder: "john@example.com",
    backToLogin: "Revenir à la connexion",
    successResend: "Un nouveau lien de vérification vient d'être envoyé.",
  },
  EN: {
    title: "Email verification",
    waiting: "Verifying your email...",
    success: "Your email is confirmed. You can now log in.",
    error: "Invalid or expired link. Request a new one below.",
    resendTitle: "Resend verification link",
    resendButton: "Resend",
    emailPlaceholder: "john@example.com",
    backToLogin: "Back to login",
    successResend: "A new verification link has been sent.",
  },
  DE: {
    title: "E-Mail-Bestätigung",
    waiting: "E-Mail wird verifiziert...",
    success: "Ihre E-Mail ist bestätigt. Sie können sich anmelden.",
    error: "Ungültiger oder abgelaufener Link. Fordern Sie einen neuen an.",
    resendTitle: "Bestätigungslink erneut senden",
    resendButton: "Erneut senden",
    emailPlaceholder: "john@beispiel.com",
    backToLogin: "Zurück zur Anmeldung",
    successResend: "Ein neuer Bestätigungslink wurde gesendet.",
  },
  IT: {
    title: "Verifica email",
    waiting: "Verifica della tua email in corso...",
    success: "Email confermata. Ora puoi accedere.",
    error: "Link non valido o scaduto. Richiedi un nuovo link.",
    resendTitle: "Invia nuovamente il link di verifica",
    resendButton: "Invia",
    emailPlaceholder: "john@esempio.com",
    backToLogin: "Torna al login",
    successResend: "Un nuovo link di verifica è stato inviato.",
  },
};

const VerifyEmail = () => {
  const { lang } = useLanguage();
  const copy = translations[lang] ?? translations.FR;
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? "loading" : "idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendResult, setResendResult] = useState("");
  const [resendError, setResendError] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("idle");
        return;
      }

      try {
        const response = await axiosInstance.get(
          API_PATHS.AUTH.VERIFY_EMAIL,
          {
            params: { token },
          }
        );
        setMessage(response.data.message || copy.success);
        setStatus("success");
      } catch (err) {
        setMessage(
          err.response?.data?.message || copy.error
        );
        setStatus("error");
      }
    };

    verify();
  }, [token, copy.success, copy.error]);

  const handleResend = async (e) => {
    e.preventDefault();
    setResendResult("");
    setResendError("");

    try {
      await axiosInstance.post(API_PATHS.AUTH.RESEND_VERIFICATION, { email });
      setResendResult(copy.successResend);
    } catch (err) {
      setResendError(err.response?.data?.message || copy.error);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md flex-1 flex flex-col justify-center space-y-8">
        <div>
          <h3 className="text-4xl font-light text-[#1e4029] mb-4 tracking-tight">
            {copy.title}
          </h3>

          <p className="text-lg text-gray-600 font-light">
            {status === "loading"
              ? copy.waiting
              : message || copy.error}
          </p>
        </div>

        <Link
          to="/login"
          className="text-[#2d5f3f] hover:text-[#5a8f6f] underline font-normal"
        >
          {copy.backToLogin}
        </Link>

        <form onSubmit={handleResend} className="space-y-4">
          <h4 className="text-xl font-light text-gray-800">
            {copy.resendTitle}
          </h4>

          <Input
            type="email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            placeholder={copy.emailPlaceholder}
          />

          {resendError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 text-sm font-light">{resendError}</p>
            </div>
          )}

          {resendResult && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-700 text-sm font-light">
                {resendResult}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-[#2d5f3f] text-white py-4 rounded-xl font-light text-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]"
          >
            {copy.resendButton}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;

