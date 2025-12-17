import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiUser, FiCalendar, FiFlag, FiPhone, FiUsers, FiUserCheck } from "react-icons/fi";
// Les drapeaux emoji sont plus simples et compatibles avec les <option>
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { getSession } from "../../utils/authStorage";
import toast from "react-hot-toast";

// Trier les pays par ordre alphabétique
const countries = [
  { name: "France", code: "FR", phoneCode: "+33", flag: "🇫🇷" },
  { name: "Belgique", code: "BE", phoneCode: "+32", flag: "🇧🇪" },
  { name: "Suisse", code: "CH", phoneCode: "+41", flag: "🇨🇭" },
  { name: "Allemagne", code: "DE", phoneCode: "+49", flag: "🇩🇪" },
  { name: "Espagne", code: "ES", phoneCode: "+34", flag: "🇪🇸" },
  { name: "Italie", code: "IT", phoneCode: "+39", flag: "🇮🇹" },
  { name: "Portugal", code: "PT", phoneCode: "+351", flag: "🇵🇹" },
  { name: "Pays-Bas", code: "NL", phoneCode: "+31", flag: "🇳🇱" },
  { name: "Luxembourg", code: "LU", phoneCode: "+352", flag: "🇱🇺" },
  { name: "Monaco", code: "MC", phoneCode: "+377", flag: "🇲🇨" },
  { name: "Andorre", code: "AD", phoneCode: "+376", flag: "🇦🇩" },
  { name: "Royaume-Uni", code: "GB", phoneCode: "+44", flag: "🇬🇧" },
  { name: "Irlande", code: "IE", phoneCode: "+353", flag: "🇮🇪" },
  { name: "Danemark", code: "DK", phoneCode: "+45", flag: "🇩🇰" },
  { name: "Suède", code: "SE", phoneCode: "+46", flag: "🇸🇪" },
  { name: "Norvège", code: "NO", phoneCode: "+47", flag: "🇳🇴" },
  { name: "Finlande", code: "FI", phoneCode: "+358", flag: "🇫🇮" },
  { name: "Islande", code: "IS", phoneCode: "+354", flag: "🇮🇸" },
  { name: "Autriche", code: "AT", phoneCode: "+43", flag: "🇦🇹" },
  { name: "République Tchèque", code: "CZ", phoneCode: "+420", flag: "🇨🇿" },
  { name: "Slovaquie", code: "SK", phoneCode: "+421", flag: "🇸🇰" },
  { name: "Hongrie", code: "HU", phoneCode: "+36", flag: "🇭🇺" },
  { name: "Pologne", code: "PL", phoneCode: "+48", flag: "🇵🇱" },
  { name: "Roumanie", code: "RO", phoneCode: "+40", flag: "🇷🇴" },
  { name: "Bulgarie", code: "BG", phoneCode: "+359", flag: "🇧🇬" },
  { name: "Grèce", code: "GR", phoneCode: "+30", flag: "🇬🇷" },
  { name: "Croatie", code: "HR", phoneCode: "+385", flag: "🇭🇷" },
  { name: "Slovénie", code: "SI", phoneCode: "+386", flag: "🇸🇮" },
  { name: "Bosnie-Herzégovine", code: "BA", phoneCode: "+387", flag: "🇧🇦" },
  { name: "Serbie", code: "RS", phoneCode: "+381", flag: "🇷🇸" },
  { name: "Monténégro", code: "ME", phoneCode: "+382", flag: "🇲🇪" },
  { name: "Macédoine du Nord", code: "MK", phoneCode: "+389", flag: "🇲🇰" },
  { name: "Albanie", code: "AL", phoneCode: "+355", flag: "🇦🇱" },
  { name: "Kosovo", code: "XK", phoneCode: "+383", flag: "🇽🇰" },
  { name: "Malte", code: "MT", phoneCode: "+356", flag: "🇲🇹" },
  { name: "Chypre", code: "CY", phoneCode: "+357", flag: "🇨🇾" },
  { name: "Estonie", code: "EE", phoneCode: "+372", flag: "🇪🇪" },
  { name: "Lettonie", code: "LV", phoneCode: "+371", flag: "🇱🇻" },
  { name: "Lituanie", code: "LT", phoneCode: "+370", flag: "🇱🇹" },
  { name: "Moldavie", code: "MD", phoneCode: "+373", flag: "🇲🇩" },
  { name: "Ukraine", code: "UA", phoneCode: "+380", flag: "🇺🇦" },
  { name: "Biélorussie", code: "BY", phoneCode: "+375", flag: "🇧🇾" },

  // Amérique du Nord
  { name: "Canada", code: "CA", phoneCode: "+1", flag: "🇨🇦" },
  { name: "États-Unis", code: "US", phoneCode: "+1", flag: "🇺🇸" },
  { name: "Mexique", code: "MX", phoneCode: "+52", flag: "🇲🇽" },

  // Amérique Centrale et Caraïbes
  { name: "Costa Rica", code: "CR", phoneCode: "+506", flag: "🇨🇷" },
  { name: "Panama", code: "PA", phoneCode: "+507", flag: "🇵🇦" },
  { name: "République Dominicaine", code: "DO", phoneCode: "+1", flag: "🇩🇴" },
  { name: "Cuba", code: "CU", phoneCode: "+53", flag: "🇨🇺" },
  { name: "Jamaïque", code: "JM", phoneCode: "+1", flag: "🇯🇲" },
  { name: "Haïti", code: "HT", phoneCode: "+509", flag: "🇭🇹" },

  // Amérique du Sud
  { name: "Brésil", code: "BR", phoneCode: "+55", flag: "🇧🇷" },
  { name: "Argentine", code: "AR", phoneCode: "+54", flag: "🇦🇷" },
  { name: "Colombie", code: "CO", phoneCode: "+57", flag: "🇨🇴" },
  { name: "Pérou", code: "PE", phoneCode: "+51", flag: "🇵🇪" },
  { name: "Chili", code: "CL", phoneCode: "+56", flag: "🇨🇱" },
  { name: "Équateur", code: "EC", phoneCode: "+593", flag: "🇪🇨" },
  { name: "Bolivie", code: "BO", phoneCode: "+591", flag: "🇧🇴" },
  { name: "Uruguay", code: "UY", phoneCode: "+598", flag: "🇺🇾" },
  { name: "Paraguay", code: "PY", phoneCode: "+595", flag: "🇵🇾" },
  { name: "Venezuela", code: "VE", phoneCode: "+58", flag: "🇻🇪" },
  { name: "Guyana", code: "GY", phoneCode: "+592", flag: "🇬🇾" },
  { name: "Suriname", code: "SR", phoneCode: "+597", flag: "🇸🇷" },

  // Afrique
  { name: "Maroc", code: "MA", phoneCode: "+212", flag: "🇲🇦" },
  { name: "Algérie", code: "DZ", phoneCode: "+213", flag: "🇩🇿" },
  { name: "Tunisie", code: "TN", phoneCode: "+216", flag: "🇹🇳" },
  { name: "Libye", code: "LY", phoneCode: "+218", flag: "🇱🇾" },
  { name: "Égypte", code: "EG", phoneCode: "+20", flag: "🇪🇬" },
  { name: "Afrique du Sud", code: "ZA", phoneCode: "+27", flag: "🇿🇦" },
  { name: "Nigeria", code: "NG", phoneCode: "+234", flag: "🇳🇬" },
  { name: "Kenya", code: "KE", phoneCode: "+254", flag: "🇰🇪" },
  { name: "Tanzanie", code: "TZ", phoneCode: "+255", flag: "🇹🇿" },
  { name: "Ouganda", code: "UG", phoneCode: "+256", flag: "🇺🇬" },
  { name: "Rwanda", code: "RW", phoneCode: "+250", flag: "🇷🇼" },
  { name: "Burundi", code: "BI", phoneCode: "+257", flag: "🇧🇮" },
  { name: "Ghana", code: "GH", phoneCode: "+233", flag: "🇬🇭" },
  { name: "Côte d'Ivoire", code: "CI", phoneCode: "+225", flag: "🇨🇮" },
  { name: "Sénégal", code: "SN", phoneCode: "+221", flag: "🇸🇳" },
  { name: "Mali", code: "ML", phoneCode: "+223", flag: "🇲🇱" },
  { name: "Burkina Faso", code: "BF", phoneCode: "+226", flag: "🇧🇫" },
  { name: "Niger", code: "NE", phoneCode: "+227", flag: "🇳🇪" },
  { name: "Tchad", code: "TD", phoneCode: "+235", flag: "🇹🇩" },
  { name: "Soudan", code: "SD", phoneCode: "+249", flag: "🇸🇩" },
  { name: "Cameroun", code: "CM", phoneCode: "+237", flag: "🇨🇲" },
  { name: "Gabon", code: "GA", phoneCode: "+241", flag: "🇬🇦" },
  { name: "République Congo", code: "CG", phoneCode: "+242", flag: "🇨🇬" },
  { name: "République Démocratique du Congo", code: "CD", phoneCode: "+243", flag: "🇨🇩" },
  { name: "Angola", code: "AO", phoneCode: "+244", flag: "🇦🇴" },

  // Asie
  { name: "Turquie", code: "TR", phoneCode: "+90", flag: "🇹🇷" },
  { name: "Russie", code: "RU", phoneCode: "+7", flag: "🇷🇺" },
  { name: "Chine", code: "CN", phoneCode: "+86", flag: "🇨🇳" },
  { name: "Japon", code: "JP", phoneCode: "+81", flag: "🇯🇵" },
  { name: "Corée du Sud", code: "KR", phoneCode: "+82", flag: "🇰🇷" },
  { name: "Inde", code: "IN", phoneCode: "+91", flag: "🇮🇳" },
  { name: "Pakistan", code: "PK", phoneCode: "+92", flag: "🇵🇰" },
  { name: "Bangladesh", code: "BD", phoneCode: "+880", flag: "🇧🇩" },
  { name: "Indonésie", code: "ID", phoneCode: "+62", flag: "🇮🇩" },
  { name: "Thaïlande", code: "TH", phoneCode: "+66", flag: "🇹🇭" },
  { name: "Vietnam", code: "VN", phoneCode: "+84", flag: "🇻🇳" },
  { name: "Philippines", code: "PH", phoneCode: "+63", flag: "🇵🇭" },
  { name: "Malaisie", code: "MY", phoneCode: "+60", flag: "🇲🇾" },
  { name: "Singapour", code: "SG", phoneCode: "+65", flag: "🇸🇬" },
  { name: "Israël", code: "IL", phoneCode: "+972", flag: "🇮🇱" },
  { name: "Arabie Saoudite", code: "SA", phoneCode: "+966", flag: "🇸🇦" },
  { name: "Émirats Arabes Unis", code: "AE", phoneCode: "+971", flag: "🇦🇪" },

  // Océanie
  { name: "Australie", code: "AU", phoneCode: "+61", flag: "🇦🇺" },
  { name: "Nouvelle-Zélande", code: "NZ", phoneCode: "+64", flag: "🇳🇿" }
].sort((a, b) => a.name.localeCompare(b.name));

const ProfileCompletion = () => {
  const [formData, setFormData] = useState({
    birthDate: "",
    nationality: "",
    nationality2: "",
    gender: "",
    role: "",
    phoneCountry: "FR",
    phoneNumber: "",
    // Champs supplémentaires pour les clients
    companyName: "",
    address: "",
    website: "",
    companyEmail: "",
    companyPhone: "",
    companySize: "",
    description: "",
    // Champs supplémentaires pour les partenaires
    organizationName: "",
    position: "",
    professionalPhone: "",
    professionalEmail: "",
    professionalAddress: "",
    specialization: "",
    experience: ""
  });
  const [loading, setLoading] = useState(false);
  const [existingCompanies, setExistingCompanies] = useState([]);
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [organizationSuggestions, setOrganizationSuggestions] = useState([]);
  const [showOrganizationDropdown, setShowOrganizationDropdown] = useState(false);

  // Fonction pour obtenir le placeholder du numéro de téléphone selon le pays
  const getPhonePlaceholder = (countryCode) => {
    switch (countryCode) {
      // Europe
      case 'FR':
        return "0 12 34 56 78";
      case 'CH':
        return "0 12 345 67 89";
      case 'BE':
        return "0 123 45 67 89";
      case 'DE':
        return "0 123 4567890";
      case 'ES':
        return "6 12 34 56 78";
      case 'IT':
        return "3 12 3456789";
      case 'PT':
        return "9 12 345 6789";
      case 'NL':
        return "0 612 345678";
      case 'LU':
        return "6 12 345 678";
      case 'MC':
        return "6 12 34 56 78";
      case 'AD':
        return "3 12 345";
      case 'GB':
        return "0 1234 567890";
      case 'IE':
        return "8 12 345 6789";
      case 'DK':
        return "1 23 45 67 89";
      case 'SE':
        return "0 123 456 789";
      case 'NO':
        return "1 23 45 67 89";
      case 'FI':
        return "0 123 456789";
      case 'IS':
        return "3 12 3456";
      case 'AT':
        return "0 123 4567890";
      case 'CZ':
        return "1 23 456 789";
      case 'SK':
        return "0 123 456 789";
      case 'HU':
        return "0 123 456 789";
      case 'PL':
        return "1 23 456 789";
      case 'RO':
        return "0 123 456 789";
      case 'BG':
        return "8 123 4567";
      case 'GR':
        return "2 123 4567";
      case 'HR':
        return "0 123 456 789";
      case 'SI':
        return "0 123 456 78";
      case 'BA':
        return "0 123 456 789";
      case 'RS':
        return "0 123 456 789";
      case 'ME':
        return "0 123 456 789";
      case 'MK':
        return "0 123 456 789";
      case 'AL':
        return "0 123 456 789";
      case 'XK':
        return "0 123 456 789";
      case 'MT':
        return "2 123 4567";
      case 'CY':
        return "9 123 4567";
      case 'EE':
        return "1 23 45678";
      case 'LV':
        return "2 123 4567";
      case 'LT':
        return "3 12 34567";
      case 'MD':
        return "0 123 45678";
      case 'UA':
        return "0 123 456 789";
      case 'BY':
        return "0 123 456 789";

      // Amérique du Nord
      case 'CA':
      case 'US':
        return "1 23 456 7890";
      case 'MX':
        return "5 512 345 6789";

      // Amérique Centrale et Caraïbes
      case 'CR':
        return "2 123 4567";
      case 'PA':
        return "1 234 5678";
      case 'DO':
        return "8 123 456 7890";
      case 'CU':
        return "0 123 456 789";
      case 'JM':
        return "2 345 6789";
      case 'HT':
        return "2 345 6789";

      // Amérique du Sud
      case 'BR':
        return "1 1234 56789";
      case 'AR':
        return "9 11 1234 5678";
      case 'CO':
        return "3 123 456 7890";
      case 'PE':
        return "9 123 456 789";
      case 'CL':
        return "9 1234 5678";
      case 'EC':
        return "0 123 456 789";
      case 'BO':
        return "6 123 4567";
      case 'UY':
        return "0 912 34567";
      case 'PY':
        return "0 981 123456";
      case 'VE':
        return "2 123 456 7890";
      case 'GY':
        return "2 345 6789";
      case 'SR':
        return "2 345 678";

      // Afrique
      case 'MA':
        return "6 12 34 56 78";
      case 'DZ':
        return "5 12 34 56 78";
      case 'TN':
        return "2 123 456 789";
      case 'LY':
        return "9 123 456 789";
      case 'EG':
        return "1 012 345 6789";
      case 'ZA':
        return "0 21 123 4567";
      case 'NG':
        return "8 012 345 6789";
      case 'KE':
        return "7 123 456 789";
      case 'TZ':
        return "6 123 456 789";
      case 'UG':
        return "7 123 456 789";
      case 'RW':
        return "7 123 456 789";
      case 'BI':
        return "7 123 456 789";
      case 'GH':
        return "2 012 345 6789";
      case 'CI':
        return "0 123 456 789";
      case 'SN':
        return "7 012 345 6789";
      case 'ML':
        return "6 123 456 789";
      case 'BF':
        return "7 012 345 6789";
      case 'NE':
        return "2 012 345 6789";
      case 'TD':
        return "6 123 456 789";
      case 'SD':
        return "9 123 456 789";
      case 'CM':
        return "6 123 456 789";
      case 'GA':
        return "0 612 345 678";
      case 'CG':
        return "0 123 456 789";
      case 'CD':
        return "8 123 456 789";
      case 'AO':
        return "9 123 456 789";

      // Asie
      case 'TR':
        return "5 012 345 67 89";
      case 'RU':
        return "7 123 456 78 90";
      case 'CN':
        return "1 234 567 8901";
      case 'JP':
        return "9 0123 45 6789";
      case 'KR':
        return "1 012 3456 7890";
      case 'IN':
        return "9 1234 567 890";
      case 'PK':
        return "3 012 345 6789";
      case 'BD':
        return "1 712 345 6789";
      case 'ID':
        return "8 1234 567 890";
      case 'TH':
        return "8 1234 5678";
      case 'VN':
        return "9 0123 456 789";
      case 'PH':
        return "9 123 456 7890";
      case 'MY':
        return "1 2345 6789";
      case 'SG':
        return "8 1234 5678";
      case 'IL':
        return "5 012 345 6789";
      case 'SA':
        return "5 012 345 6789";
      case 'AE':
        return "5 012 345 6789";

      // Océanie
      case 'AU':
        return "0 412 345 678";
      case 'NZ':
        return "2 123 456 789";

      default:
        return "0 123 456 7890";
    }
  };

  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Charger les entreprises existantes au montage
  useEffect(() => {
    const loadExistingCompanies = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.USERS.GET_COMPANIES);
        const companies = response.data?.companies || [];
        setExistingCompanies(companies);
      } catch (error) {
        console.error('Erreur lors du chargement des entreprises:', error);
      }
    };

    loadExistingCompanies();
  }, []);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.company-input-container')) {
        setShowCompanyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gestionnaire spécial pour le champ entreprise
  const handleCompanyNameChange = (value) => {
    setFormData(prev => ({ ...prev, companyName: value }));

    if (value.trim()) {
      // Recherche insensible à la casse
      const existingCompany = existingCompanies.find(
        company => company.name.toLowerCase().trim() === value.toLowerCase().trim()
      );

      if (existingCompany) {
        // Préremplir automatiquement les champs entreprise (sauf contactName)
        setFormData(prev => ({
          ...prev,
          companyName: value,
          address: existingCompany.address || prev.address,
          website: existingCompany.website || prev.website,
          companyEmail: existingCompany.companyEmail || prev.companyEmail,
          companyPhone: existingCompany.companyPhone || prev.companyPhone,
          companySize: existingCompany.companySize || prev.companySize,
          description: existingCompany.notes || prev.description
        }));

        toast.success(`Entreprise "${existingCompany.name}" trouvée - Informations préremplies automatiquement`);
      }

      // Mettre à jour les suggestions pour l'autocomplétion
      const filtered = existingCompanies.filter(
        company => company.name.toLowerCase().includes(value.toLowerCase())
      );
      setCompanySuggestions(filtered);
      setShowCompanyDropdown(filtered.length > 0 || value.length > 0);
    } else {
      setCompanySuggestions([]);
      setShowCompanyDropdown(false);
    }
  };

  // Sélection d'une entreprise depuis les suggestions
  const selectCompanySuggestion = (company) => {
    setFormData(prev => ({
      ...prev,
      companyName: company.name,
      address: company.address || prev.address,
      website: company.website || prev.website,
      companyEmail: company.companyEmail || prev.companyEmail,
      companyPhone: company.companyPhone || prev.companyPhone,
      companySize: company.companySize || prev.companySize,
      description: company.notes || prev.description
    }));

    setCompanySuggestions([]);
    setShowCompanyDropdown(false);
    toast.success(`Entreprise "${company.name}" sélectionnée - Informations préremplies`);
  };

  // Gestion du nom d'organisation pour les partenaires
  const handleOrganizationNameChange = (value) => {
    setFormData(prev => ({ ...prev, organizationName: value }));

    if (value.trim()) {
      // Recherche insensible à la casse
      const existingCompany = existingCompanies.find(
        company => company.name.toLowerCase().trim() === value.toLowerCase().trim()
      );

      if (existingCompany) {
        // Préremplir automatiquement les champs entreprise (sauf contactName)
        setFormData(prev => ({
          ...prev,
          organizationName: value,
          professionalAddress: existingCompany.address || prev.professionalAddress,
          website: existingCompany.website || prev.website,
          professionalEmail: existingCompany.companyEmail || prev.professionalEmail,
          professionalPhone: existingCompany.companyPhone || prev.professionalPhone
        }));

        toast.success(`Entreprise "${existingCompany.name}" trouvée - Informations préremplies automatiquement`);
      }

      // Mettre à jour les suggestions pour l'autocomplétion
      const filtered = existingCompanies.filter(
        company => company.name.toLowerCase().includes(value.toLowerCase())
      );
      setOrganizationSuggestions(filtered);
      setShowOrganizationDropdown(filtered.length > 0 || value.length > 0);
    } else {
      setOrganizationSuggestions([]);
      setShowOrganizationDropdown(false);
    }
  };

  // Sélection d'une entreprise depuis les suggestions pour partenaires
  const selectOrganizationSuggestion = (company) => {
    setFormData(prev => ({
      ...prev,
      organizationName: company.name,
      professionalAddress: company.address || prev.professionalAddress,
      website: company.website || prev.website,
      professionalEmail: company.companyEmail || prev.professionalEmail,
      professionalPhone: company.companyPhone || prev.professionalPhone
    }));

    setOrganizationSuggestions([]);
    setShowOrganizationDropdown(false);
    toast.success(`Entreprise "${company.name}" sélectionnée - Informations préremplies`);
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

    if (!formData.gender) {
      toast.error("Veuillez sélectionner votre sexe");
      return;
    }

    if (!formData.phoneNumber) {
      toast.error("Veuillez saisir votre numéro de téléphone");
      return;
    }

    // Validation pour les clients et collaborateurs : au moins email OU téléphone entreprise
    if ((formData.role === "client" || formData.role === "collaborator") && !formData.companyEmail && !formData.companyPhone) {
      toast.error("Veuillez saisir au moins l'email ou le téléphone de l'entreprise");
      return;
    }

    // Validation pour les partenaires : nom organisation et au moins email OU téléphone professionnel requis
    if (formData.role === "partner") {
      if (!formData.organizationName) {
        toast.error("Veuillez saisir le nom de votre organisation/cabinet");
        return;
      }
      if (!formData.professionalEmail && !formData.professionalPhone) {
        toast.error("Veuillez saisir au moins l'email ou le téléphone professionnel");
        return;
      }
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
        nationality2: formData.nationality2 || null,
        gender: formData.gender || null,
        role: formData.role || "member",
        phoneNumber: fullPhoneNumber,
        profileCompleted: true,
        // Champs supplémentaires pour les clients et collaborateurs
        ...((formData.role === "client" || formData.role === "collaborator") && {
          company: formData.companyName || null,
          address: formData.address || null,
          website: formData.website || null,
          companyEmail: formData.companyEmail || null,
          companyPhone: formData.companyPhone || null,
          companySize: formData.companySize || null,
          notes: formData.description || null,
        }),
        // Champs supplémentaires pour les partenaires
        ...(formData.role === "partner" && {
          organizationName: formData.organizationName || null,
          position: formData.position || null,
          professionalPhone: formData.professionalPhone || null,
          professionalEmail: formData.professionalEmail || null,
          professionalAddress: formData.professionalAddress || null,
          specialization: formData.specialization || null,
          experience: formData.experience || null,
          status: "active" // Par défaut actif pour les nouveaux clients
        })
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
      const userRole = response.data.user.role || "user";
      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else if (userRole === "client") {
        navigate("/client/dashboard");
      } else if (userRole === "partner") {
        navigate("/partner/dashboard");
      } else if (userRole === "collaborator") {
        navigate("/collaborator/dashboard");
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
    const userRole = user?.role || "user";
    if (userRole === "admin") {
      navigate("/admin/dashboard");
    } else if (userRole === "client") {
      navigate("/client/dashboard");
    } else if (userRole === "partner") {
      navigate("/partner/dashboard");
    } else if (userRole === "collaborator") {
      navigate("/collaborator/dashboard");
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
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                placeholder="Ex: Française, Suisse, Belge..."
                className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
                required
              />
              <p className="text-xs text-[#7a8b7f] mt-1">
                Écrivez votre nationalité (ex: Française, Suisse, Canadienne, etc.)
              </p>
            </div>

            {/* Nationalité 2 (optionnel) */}
            <div>
              <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                <FiFlag className="inline mr-2" />
                Deuxième nationalité (optionnel)
              </label>
              <input
                type="text"
                name="nationality2"
                value={formData.nationality2}
                onChange={handleInputChange}
                placeholder="Ex: Suisse, Canadienne, Italienne... (laissez vide si aucune)"
                className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
              />
              <p className="text-xs text-[#7a8b7f] mt-1">
                Si vous avez une deuxième nationalité, écrivez-la ici
              </p>
            </div>

            {/* Sexe */}
            <div>
              <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                <FiUser className="inline mr-2" />
                Sexe *
              </label>
              <select
                name="gender"
                value={formData.gender}
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
                <option value="">Sélectionnez votre sexe</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
              </select>
            </div>

            {/* Rôle */}
            <div>
              <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                <FiUsers className="inline mr-2" />
                Rôle (optionnel - sinon vous serez utilisateur)
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237a8b7f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 1rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "3rem"
                }}
              >
                <option value="member">Utilisateur simple</option>
                <option value="client">Client</option>
                <option value="partner">Partenaire</option>
                <option value="collaborator">Collaborateur</option>
              </select>
              <p className="text-xs text-[#7a8b7f] mt-1">
                Choisissez votre rôle dans l'organisation. Si vous n'êtes pas sûr, laissez vide.
              </p>
            </div>

            {/* Champs supplémentaires pour les clients et collaborateurs */}
            {(formData.role === "client" || formData.role === "collaborator") && (
              <>
                <div className="border-t border-[#dfe8e1] pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-[#1e4029] mb-4 flex items-center">
                    <FiUsers className="mr-2" />
                    Informations {formData.role === "client" ? "de l'entreprise" : "professionnelles"}
                  </h3>

                  {/* Nom entreprise */}
                  <div className="mb-4">
                    <div className="company-input-container">
                      <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                        {formData.role === "client" ? "Nom de l'entreprise" : "Nom de votre entreprise"} *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={(e) => handleCompanyNameChange(e.target.value)}
                          onFocus={() => formData.companyName && setShowCompanyDropdown(true)}
                          placeholder="Ex: Ma Société SARL"
                          className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
                          required={formData.role === "client" || formData.role === "collaborator"}
                        />

                        {/* Dropdown des suggestions d'entreprises */}
                        {showCompanyDropdown && companySuggestions.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-[#dfe8e1] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {companySuggestions.map((company) => (
                              <div
                                key={company.name}
                                className="px-4 py-3 hover:bg-[#f4f7f4] cursor-pointer border-b border-[#f4f7f4] last:border-b-0"
                                onClick={() => selectCompanySuggestion(company)}
                              >
                                <div className="font-medium text-[#1e4029]">{company.name}</div>
                                <div className="text-xs text-[#7a8b7f]">
                                  {company.employeeCount} employé{company.employeeCount > 1 ? 's' : ''}
                                  {company.industry && ` • ${company.industry}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Deuxième ligne : Email et Téléphone entreprise */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                        {formData.role === "client" ? "Email entreprise" : "Votre email professionnel"} {!formData.companyPhone ? "*" : "(optionnel si téléphone rempli)"}
                      </label>
                      <input
                        type="email"
                        name="companyEmail"
                        value={formData.companyEmail}
                        onChange={handleInputChange}
                        placeholder="Ex: contact@monsite.com"
                        className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
                        required={formData.role === "client" && !formData.companyPhone}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                        {formData.role === "client" ? "Téléphone entreprise" : "Votre téléphone professionnel"} {!formData.companyEmail ? "*" : "(optionnel si email rempli)"}
                      </label>
                      <input
                        type="tel"
                        name="companyPhone"
                        value={formData.companyPhone}
                        onChange={(e) => {
                          // Ne garder que les chiffres et espaces
                          const value = e.target.value.replace(/[^\d\s]/g, '');
                          setFormData(prev => ({ ...prev, companyPhone: value }));
                        }}
                        placeholder="Ex: 01 23 45 67 89"
                        className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
                        required={formData.role === "client" && !formData.companyEmail}
                      />
                    </div>
                  </div>

                  {/* Troisième ligne : Adresse et Site web */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                        {formData.role === "client" ? "Adresse" : "Adresse professionnelle"}
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Ex: 123 Rue de la Paix, 75001 Paris"
                        className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                        Site web (optionnel)
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="Ex: https://www.monsite.com"
                        className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
                      />
                    </div>
                  </div>


                  {/* Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                      {formData.role === "client" ? "Description" : "Informations supplémentaires"}
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Informations supplémentaires sur l'entreprise..."
                      rows="2"
                      className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f] resize-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Champs supplémentaires pour les partenaires */}
            {formData.role === "partner" && (
              <>
                <div className="border-t border-[#dfe8e1] pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-[#1e4029] mb-4 flex items-center">
                    <FiUserCheck className="mr-2" />
                    Informations professionnelles
                  </h3>

                  {/* Première ligne : Organisation et Poste */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                        Nom de l'entreprise *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={(e) => handleOrganizationNameChange(e.target.value)}
                          onFocus={() => formData.organizationName && setShowOrganizationDropdown(true)}
                          placeholder="Ex: Cabinet Dupont & Associés"
                          className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
                          required={formData.role === "partner"}
                        />

                        {/* Dropdown des suggestions d'entreprises pour partenaires */}
                        {showOrganizationDropdown && organizationSuggestions.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-[#dfe8e1] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {organizationSuggestions.map((company) => (
                              <div
                                key={company.name}
                                className="px-4 py-3 hover:bg-[#f4f7f4] cursor-pointer border-b border-[#f4f7f4] last:border-b-0"
                                onClick={() => selectOrganizationSuggestion(company)}
                              >
                                <div className="font-medium text-[#1e4029]">{company.name}</div>
                                <div className="text-xs text-[#7a8b7f]">
                                  {company.employeeCount} employé{company.employeeCount > 1 ? 's' : ''}
                                  {company.industry && ` • ${company.industry}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                        Poste/Position
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="Ex: Consultant Senior"
                        className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
                      />
                    </div>
                  </div>

                  {/* Deuxième ligne : Email et Téléphone professionnel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                        Email professionnel {!formData.professionalPhone ? "*" : "(optionnel si téléphone rempli)"}
                      </label>
                      <input
                        type="email"
                        name="professionalEmail"
                        value={formData.professionalEmail}
                        onChange={handleInputChange}
                        placeholder="Ex: jean.dupont@cabinet.com"
                        className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
                        required={formData.role === "partner" && !formData.professionalPhone}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                        Téléphone professionnel {!formData.professionalEmail ? "*" : "(optionnel si email rempli)"}
                      </label>
                      <input
                        type="tel"
                        name="professionalPhone"
                        value={formData.professionalPhone}
                        onChange={(e) => {
                          // Ne garder que les chiffres et espaces
                          const value = e.target.value.replace(/[^\d\s]/g, '');
                          setFormData(prev => ({ ...prev, professionalPhone: value }));
                        }}
                        placeholder="Ex: 01 23 45 67 89"
                        className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
                        required={formData.role === "partner" && !formData.professionalEmail}
                      />
                    </div>
                  </div>

                  {/* Troisième ligne : Spécialisation et Expérience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                        Domaine d'expertise
                      </label>
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        placeholder="Ex: Gestion de patrimoine, Immobilier, Fiscalité..."
                        className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                        Années d'expérience
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237a8b7f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: "right 0.5rem center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "1.5em 1.5em",
                          paddingRight: "2.5rem"
                        }}
                      >
                        <option value="">Sélectionnez l'expérience</option>
                        <option value="1-3">1-3 ans</option>
                        <option value="3-5">3-5 ans</option>
                        <option value="5-10">5-10 ans</option>
                        <option value="10-15">10-15 ans</option>
                        <option value="15-20">15-20 ans</option>
                        <option value="20+">Plus de 20 ans</option>
                      </select>
                    </div>
                  </div>

                  {/* Quatrième ligne : Adresse professionnelle et Site web */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                        Adresse professionnelle
                      </label>
                      <input
                        type="text"
                        name="professionalAddress"
                        value={formData.professionalAddress}
                        onChange={handleInputChange}
                        placeholder="Ex: 123 Avenue des Champs-Élysées, 75008 Paris"
                        className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                        Site web (optionnel)
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="Ex: https://www.cabinet-dupont.com"
                        className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
                      />
                    </div>
                  </div>

                </div>
              </>
            )}

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
                      {country.flag} {country.phoneCode} - {country.name}
                    </option>
                  ))}
                </select>

                {/* Numéro de téléphone */}
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    // Ne garder que les chiffres et espaces
                    const value = e.target.value.replace(/[^\d\s]/g, '');
                    setFormData(prev => ({ ...prev, phoneNumber: value }));
                  }}
                  placeholder={getPhonePlaceholder(formData.phoneCountry)}
                  className="flex-1 px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f] font-mono"
                  maxLength={
                    // Calcul de la longueur maximale basé sur le placeholder + espaces
                    getPhonePlaceholder(formData.phoneCountry).replace(/\s/g, '').length + Math.ceil(getPhonePlaceholder(formData.phoneCountry).split(' ').length / 2)
                  }
                  required
                />
              </div>
              <p className="text-xs text-[#7a8b7f] mt-1">
                {selectedCountry?.flag} Format: {selectedCountry?.phoneCode} {getPhonePlaceholder(formData.phoneCountry).replace(/[\d]/g, 'X').replace(/\s/g, ' ')}
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
