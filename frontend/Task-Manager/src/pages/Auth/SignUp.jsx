import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import { useLanguage } from "../../context/languageContext";

const translations = {
  FR: {
    title: "Créer un compte",
    subtitle: "Rejoignez-nous en remplissant les informations ci-dessous",
    lastNameLabel: "Nom *",
    lastNamePlaceholder: "Doe",
    firstNameLabel: "Prénom *",
    firstNamePlaceholder: "John",
    emailLabel: "Adresse Email *",
    emailPlaceholder: "john@example.com",
    passwordLabel: "Mot de passe *",
    passwordPlaceholder: "Min 8 caractères",
    submitButton: "S'INSCRIRE",
    successMessage:
      "Compte créé ! Vérifiez vos emails (et vos spams) pour valider votre adresse.",
    hasAccount: "Déjà un compte ?",
    user_exists: "Un utilisateur avec cet email existe déjà.",
    signInLink: "Se connecter",
    errors: {
      missingName: "Veuillez entrer le nom complet.",
      invalidEmail: "Veuillez entrer une adresse email valide.",
      missingPassword: "Veuillez entrer le mot de passe",
      somethingWrong: "Une erreur s'est produite. Veuillez réessayer.",
    },
  },
  EN: {
    title: "Create an account",
    subtitle: "Join us by filling in the information below",
    lastNameLabel: "Last Name *",
    lastNamePlaceholder: "Doe",
    firstNameLabel: "First Name *",
    firstNamePlaceholder: "John",
    emailLabel: "Email Address *",
    emailPlaceholder: "john@example.com",
    passwordLabel: "Password *",
    passwordPlaceholder: "Min 8 characters",
    submitButton: "SIGN UP",
    successMessage:
      "Account created! Please check your inbox (and spam) to verify your email.",
    hasAccount: "Already have an account?",
    user_exists: "A user with this email already exists.",
    signInLink: "Sign in",
    errors: {
      missingName: "Please enter full name.",
      invalidEmail: "Please enter a valid email address.",
      missingPassword: "Please enter the password",
      somethingWrong: "Something went wrong. Please try again.",
    },
  },
  DE: {
    title: "Konto erstellen",
    subtitle: "Treten Sie uns bei, indem Sie die folgenden Informationen ausfüllen",
    lastNameLabel: "Nachname *",
    lastNamePlaceholder: "Mustermann",
    firstNameLabel: "Vorname *",
    firstNamePlaceholder: "Max",
    emailLabel: "E-Mail-Adresse *",
    emailPlaceholder: "max@beispiel.com",
    passwordLabel: "Passwort *",
    passwordPlaceholder: "Min. 8 Zeichen",
    submitButton: "REGISTRIEREN",
    successMessage:
      "Konto erstellt! Prüfen Sie bitte Inbox und Spam zur Verifizierung.",
    hasAccount: "Bereits ein Konto?",
    user_exists: "Ein Benutzer mit dieser E-Mail existiert bereits.",
    signInLink: "Anmelden",
    errors: {
      missingName: "Bitte geben Sie den vollständigen Namen ein.",
      invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      missingPassword: "Bitte geben Sie das Passwort ein",
      somethingWrong: "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",
    },
  },
  IT: {
    title: "Crea un account",
    subtitle: "Unisciti a noi compilando le informazioni qui sotto",
    lastNameLabel: "Cognome *",
    lastNamePlaceholder: "Rossi",
    firstNameLabel: "Nome *",
    firstNamePlaceholder: "Mario",
    emailLabel: "Indirizzo Email *",
    emailPlaceholder: "mario@esempio.com",
    passwordLabel: "Password *",
    passwordPlaceholder: "Min 8 caratteri",
    submitButton: "REGISTRATI",
    successMessage:
      "Account creato! Controlla posta e spam per verificare l'email.",
    hasAccount: "Hai già un account?",
    user_exists: "Un utente con questa email esiste già.",
    signInLink: "Accedi",
    errors: {
      missingName: "Inserisci il nome completo.",
      invalidEmail: "Inserisci un indirizzo email valido.",
      missingPassword: "Inserisci la password",
      somethingWrong: "Qualcosa è andato storto. Riprova.",
    },
  },
};

const getErrorMessage = (error, copy) => {
  const errorData = error.response?.data;
  if (errorData) {
    if (errorData.i18nKey) {
      let message = copy[errorData.i18nKey] || errorData.i18nKey;
      if (errorData.params) {
        message = message.replace("{{minutes}}", errorData.params.minutes);
      }
      return message;
    }
    return errorData.message || copy.errors.somethingWrong;
  }
  return copy.errors.somethingWrong;
};

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const { lang } = useLanguage();
  const copy = translations[lang] ?? translations.FR;
  const navigate = useNavigate();

  // Handle SignUp Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = ''

    if (!fullName || !firstName) {
      setError(copy.errors.missingName);
      return;
    }

    if (!validateEmail(email)) {
      setError(copy.errors.invalidEmail);
      return;
    }

    if (!password) {
      setError(copy.errors.missingPassword);
      return;
    }

    setError("");
    setSuccess("");

    //SignUp API Call
    try {

      // Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const combinedName = `${firstName} ${fullName}`.trim();

      await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: combinedName,
        email,
        password,
        profileImageUrl,
        language: lang,
      });

      setSuccess(copy.successMessage);
      setFullName("");
      setFirstName("");
      setEmail("");
      setPassword("");
      setProfilePic(null);
    } catch (error){
      setError(getErrorMessage(error, copy));
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-2xl flex-1 flex flex-col justify-center">
        <div className="mb-12">
          <h3 className="text-4xl font-light text-[#1e4029] mb-4 tracking-tight">
            {copy.title}
          </h3>
          <p className="text-lg text-gray-600 font-light">
            {copy.subtitle}
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex justify-center mb-8">
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-light mb-2 text-base">
                {copy.lastNameLabel}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                placeholder={copy.lastNamePlaceholder}
                required
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5f3f] transition-colors font-light text-base"
              />
            </div>

            {/* First Name */}
            <div>
              <label className="block text-gray-700 font-light mb-2 text-base">
                {copy.firstNameLabel}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={({ target }) => setFirstName(target.value)}
                placeholder={copy.firstNamePlaceholder}
                required
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5f3f] transition-colors font-light text-base"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-light mb-2 text-base">
                {copy.emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                placeholder={copy.emailPlaceholder}
                required
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5f3f] transition-colors font-light text-base"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-light mb-2 text-base">
                {copy.passwordLabel}
              </label>
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder={copy.passwordPlaceholder}
                required
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5f3f] transition-colors font-light text-base"
              />
            </div>

          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 text-sm font-light">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-700 text-sm font-light">{success}</p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-3 underline text-[#2d5f3f] font-normal"
              >
                {copy.signInLink}
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-[#2d5f3f] text-white py-4 rounded-xl font-light text-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]"
          >
            {copy.submitButton}
          </button>

          <div className="text-center pt-4">
            <p className="text-base text-gray-600 font-light">
              {copy.hasAccount}{" "}
              <Link 
                className="text-[#2d5f3f] hover:text-[#5a8f6f] font-normal underline transition-colors" 
                to="/login"
              >
                {copy.signInLink}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
