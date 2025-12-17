import React from "react";
import { Link } from "react-router-dom";
import lacLemanImage from "../../assets/images/lac-leman-alpes.jpg";
import { useLanguage } from "../../context/languageContext";

const translations = {
  FR: {
    title: "Votre patrimoine,\nnotre expertise",
    subtitle: "Conseil en structuration patrimoniale et fiscale pour entrepreneurs, particuliers et investisseurs",
  },
  EN: {
    title: "Your wealth,\nour expertise",
    subtitle: "Wealth and tax structuring advisory for entrepreneurs, individuals and investors",
  },
  DE: {
    title: "Ihr Vermögen,\nunsere Expertise",
    subtitle: "Vermögens- und Steuerstrukturierungsberatung für Unternehmer, Privatpersonen und Investoren",
  },
  IT: {
    title: "Il tuo patrimonio,\nla nostra expertise",
    subtitle: "Consulenza sulla strutturazione patrimoniale e fiscale per imprenditori, privati e investitori",
  },
};

const AuthLayout = ({ children }) => {
  const { lang } = useLanguage();
  const copy = translations[lang] ?? translations.FR;

  return <div className="flex min-h-screen">
    {/* Left Panel - Form */}
    <div className="w-screen h-screen md:w-[55vw] pl-8 pr-8 md:pl-16 md:pr-48 pt-8 pb-12 flex flex-col justify-center items-center bg-white">
      <Link to="/" className="mb-2 text-center">
        <h2 className="text-3xl font-light text-[#1e4029] tracking-wide">
          Geneva Wealth Partners
        </h2>
        <div className="w-20 h-0.5 bg-[#2d5f3f] mt-2 mx-auto"></div>
      </Link>
      {children}
    </div>

    {/* Right Panel - Image */}
    <div className="hidden md:flex w-[45vw] h-screen relative overflow-hidden">
      <img
        src={lacLemanImage}
        alt="Geneva Wealth Partners"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e4029]/70 via-[#2d5f3f]/60 to-[#1e4029]/70"></div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-12">
        <div className="max-w-md text-center">
          <h3 className="text-4xl font-light mb-6 tracking-wide text-white" style={{ whiteSpace: 'pre-line' }}>
            {copy.title}
          </h3>
          <div className="w-24 h-0.5 bg-white/40 mx-auto mb-6"></div>
          <p className="text-lg font-light leading-relaxed opacity-90">
            {copy.subtitle}
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-24 h-0.5 bg-white/20"></div>
        <div className="absolute bottom-20 right-10 w-24 h-0.5 bg-white/20"></div>
        <div className="absolute top-1/4 right-16 w-2 h-2 rounded-full bg-white/30"></div>
        <div className="absolute bottom-1/3 left-16 w-2 h-2 rounded-full bg-white/30"></div>
      </div>
    </div>
  </div>
};

export default AuthLayout;
