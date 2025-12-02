import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiUser, FiCalendar, FiFlag, FiPhone } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { getSession } from "../../utils/authStorage";
import toast from "react-hot-toast";

const countries = [
  { name: "France", code: "FR", phoneCode: "+33", flag: "🇫🇷" },
  { name: "Belgique", code: "BE", phoneCode: "+32", flag: "🇧🇪" },
  { name: "Suisse", code: "CH", phoneCode: "+41", flag: "🇨🇭" },
  { name: "Canada", code: "CA", phoneCode: "+1", flag: "🇨🇦" },
  { name: "États-Unis", code: "US", phoneCode: "+1", flag: "🇺🇸" },
  { name: "Royaume-Uni", code: "GB", phoneCode: "+44", flag: "🇬🇧" },
  { name: "Allemagne", code: "DE", phoneCode: "+49", flag: "🇩🇪" },
  { name: "Espagne", code: "ES", phoneCode: "+34", flag: "🇪🇸" },
  { name: "Italie", code: "IT", phoneCode: "+39", flag: "🇮🇹" },
  { name: "Portugal", code: "PT", phoneCode: "+351", flag: "🇵🇹" },
  { name: "Pays-Bas", code: "NL", phoneCode: "+31", flag: "🇳🇱" },
  { name: "Luxembourg", code: "LU", phoneCode: "+352", flag: "🇱🇺" },
  { name: "Monaco", code: "MC", phoneCode: "+377", flag: "🇲🇨" },
  { name: "Andorre", code: "AD", phoneCode: "+376", flag: "🇦🇩" }
];

const ProfileCompletion = () => {
  const [formData, setFormData] = useState({
    birthDate: "",
    nationality: "",
    phoneCountry: "FR",
    phoneNumber: ""
  });
  const [loading, setLoading] = useState(false);

  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.birthDate) {
      toast.error("Veuillez saisir votre date de naissance");
      return;
    }

    if (!formData.nationality) {
      toast.error("Veuillez sélectionner votre nationalité");
      return;
    }

    if (!formData.phoneNumber) {
      toast.error("Veuillez saisir votre numéro de téléphone");
      return;
    }

    // Validation âge minimum (13 ans)
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 13) {
      toast.error("Vous devez avoir au moins 13 ans");
      return;
    }

    setLoading(true);
    try {
      const selectedCountry = countries.find(c => c.code === formData.phoneCountry);
      const fullPhoneNumber = `${selectedCountry.phoneCode}${formData.phoneNumber}`;

      const updateData = {
        birthDate: formData.birthDate,
        nationality: formData.nationality,
        phoneNumber: fullPhoneNumber,
        profileCompleted: true
      };

      console.log("ProfileCompletion - Sending data:", updateData);

      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        updateData
      );

      console.log("ProfileCompletion - API response:", response.data);

      // Marquer le profil comme complété dans localStorage
      const profileCompletedKey = `profile-completed-${user._id}`;
      localStorage.setItem(profileCompletedKey, 'true');
      console.log("ProfileCompletion - Marked profile as completed for user:", user._id);

      // Mettre à jour l'utilisateur dans le contexte avec profileCompleted = true
      const updatedUser = {
        ...response.data.user,
        profileCompleted: true
      };

      // Récupérer la session actuelle pour préserver token et refreshToken
      const currentSession = getSession();

      updateUser({
        user: updatedUser,
        token: currentSession.token,
        refreshToken: currentSession.refreshToken
      });

      toast.success("Profil complété avec succès !");

      // Rediriger selon le rôle
      if (response.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Rediriger selon le rôle sans compléter le profil
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  };

  const selectedCountry = countries.find(c => c.code === formData.phoneCountry);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <FiUser className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Complétez votre profil</h1>
          <p className="text-white/80">Quelques informations supplémentaires pour finaliser votre inscription</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date de naissance */}
            <div>
              <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                <FiCalendar className="inline mr-2" />
                Date de naissance *
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029]"
                required
              />
              <p className="text-xs text-[#7a8b7f] mt-1">Vous devez avoir au moins 13 ans</p>
            </div>

            {/* Nationalité */}
            <div>
              <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                <FiFlag className="inline mr-2" />
                Nationalité *
              </label>
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237a8b7f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 1rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "3rem"
                }}
                required
              >
                <option value="">Sélectionnez votre nationalité</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Numéro de téléphone */}
            <div>
              <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                <FiPhone className="inline mr-2" />
                Numéro de téléphone *
              </label>
              <div className="flex gap-2">
                {/* Sélecteur de pays */}
                <select
                  name="phoneCountry"
                  value={formData.phoneCountry}
                  onChange={handleInputChange}
                  className="px-3 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] appearance-none min-w-[120px]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237a8b7f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.2em 1.2em",
                    paddingRight: "2rem"
                  }}
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.phoneCode}
                    </option>
                  ))}
                </select>

                {/* Numéro de téléphone */}
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    // Ne garder que les chiffres
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData(prev => ({ ...prev, phoneNumber: value }));
                  }}
                  placeholder="6 12 34 56 78"
                  className="flex-1 px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029]"
                  maxLength="10"
                  required
                />
              </div>
              <p className="text-xs text-[#7a8b7f] mt-1">
                Format: {selectedCountry?.phoneCode} XX XX XX XX XX
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 px-6 py-3 text-[#7a8b7f] bg-[#f4f7f4] rounded-xl hover:bg-[#e6f0ea] transition-colors font-medium"
                disabled={loading}
              >
                Plus tard
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Enregistrement..." : "Terminer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
