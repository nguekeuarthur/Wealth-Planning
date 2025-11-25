import React from "react";
import { Link } from "react-router-dom";
import lacLemanImage from "../../assets/images/lac-leman-alpes.jpg";

const AuthLayout = ({ children }) => {
  return <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="w-screen h-screen md:w-[55vw] px-8 md:px-16 pt-8 pb-12 flex flex-col bg-white">
        <Link to="/" className="mb-12">
          <h2 className="text-3xl font-light text-[#1e4029] tracking-wide">
            Geneva Wealth Partners
          </h2>
          <div className="w-20 h-0.5 bg-[#2d5f3f] mt-2"></div>
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
            <h3 className="text-4xl font-light mb-6 tracking-wide">
              Votre patrimoine,<br/>notre expertise
            </h3>
            <div className="w-24 h-0.5 bg-white/40 mx-auto mb-6"></div>
            <p className="text-lg font-light leading-relaxed opacity-90">
              Conseil en structuration patrimoniale et fiscale pour entrepreneurs et investisseurs
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
