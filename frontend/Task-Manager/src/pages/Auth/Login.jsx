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
    signUpLink: "S'inscrire",
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
    signUpLink: "Sign up",
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
    signUpLink: "Registrieren",
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
    signUpLink: "Registrati",
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

  const { lang } = useLanguage();
  const copy = translations[lang] ?? translations.FR;

  const {updateUser} = useContext(UserContext)
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

    //Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data)

        //Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error){
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError(copy.errors.somethingWrong);
      }
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

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-[#2d5f3f] text-white py-4 rounded-xl font-light text-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]"
          >
            {copy.submitButton}
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
