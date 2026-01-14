import React, { useState, useContext } from 'react';
import { useUser } from '../../context/userContext';
import { useLanguage } from '../../context/languageContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import DeleteAccountModal from '../../components/DeleteAccountModal';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaGlobe, FaTrashAlt } from 'react-icons/fa';
import { BASE_URL } from '../../utils/apiPaths';

const fullImageUrl = (url) => {
  if (!url) return null;
  let cleaned = url.replace(/^https?:\/\/localhost:8000/, '');
  if (cleaned.startsWith('http')) return cleaned;
  const baseUrlClean = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const pathClean = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
  return `${baseUrlClean}${pathClean}`;
};

const UserProfile = () => {
  const { user } = useUser();
  const { lang } = useLanguage();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const content = {
    FR: {
      title: 'Mon Profil',
      personalInfo: 'Informations personnelles',
      contactInfo: 'Informations de contact',
      accountSettings: 'Paramètres du compte',
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      company: 'Entreprise',
      address: 'Adresse',
      website: 'Site web',
      role: 'Rôle',
      deleteAccount: 'Supprimer mon compte',
      deleteAccountDesc: 'Une fois votre compte supprimé, toutes vos données seront définitivement perdues.',
      connected: 'Connecté',
      notConnected: 'Non connecté',
      noInfo: 'Non renseigné',
    },
    EN: {
      title: 'My Profile',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      accountSettings: 'Account Settings',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      company: 'Company',
      address: 'Address',
      website: 'Website',
      role: 'Role',
      deleteAccount: 'Delete my account',
      deleteAccountDesc: 'Once your account is deleted, all your data will be permanently lost.',
      connected: 'Connected',
      notConnected: 'Not connected',
      noInfo: 'Not provided',
    },
    DE: {
      title: 'Mein Profil',
      personalInfo: 'Persönliche Informationen',
      contactInfo: 'Kontaktinformationen',
      accountSettings: 'Kontoeinstellungen',
      name: 'Name',
      email: 'E-Mail',
      phone: 'Telefon',
      company: 'Unternehmen',
      address: 'Adresse',
      website: 'Website',
      role: 'Rolle',
      deleteAccount: 'Mein Konto löschen',
      deleteAccountDesc: 'Sobald Ihr Konto gelöscht ist, gehen alle Ihre Daten unwiderruflich verloren.',
      connected: 'Verbunden',
      notConnected: 'Nicht verbunden',
      noInfo: 'Nicht angegeben',
    },
    IT: {
      title: 'Il Mio Profilo',
      personalInfo: 'Informazioni Personali',
      contactInfo: 'Informazioni di Contatto',
      accountSettings: 'Impostazioni Account',
      name: 'Nome',
      email: 'Email',
      phone: 'Telefono',
      company: 'Azienda',
      address: 'Indirizzo',
      website: 'Sito web',
      role: 'Ruolo',
      deleteAccount: 'Elimina il mio account',
      deleteAccountDesc: 'Una volta eliminato l\'account, tutti i tuoi dati saranno persi definitivamente.',
      connected: 'Connesso',
      notConnected: 'Non connesso',
      noInfo: 'Non fornito',
    }
  };

  const copy = content[lang] || content.FR;

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'member': return 'Membre';
      case 'client': return 'Client';
      case 'partner': return 'Partenaire';
      case 'collaborator': return 'Collaborateur';
      default: return role;
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || '';
    const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] || '') : '';
    const initials = (first + second).toUpperCase();
    return initials || '?';
  };

  return (
    <DashboardLayout activeMenu="Profil">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden backdrop-blur-sm">
                {user?.profileImageUrl ? (
                  <img
                    src={fullImageUrl(user.profileImageUrl)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {getInitials(user?.name)}
                  </span>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{copy.title}</h1>
              <p className="text-white/80">{user?.name}</p>
              <p className="text-white/60 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-[#1e4029] mb-6 flex items-center gap-3">
            <FaUser className="text-[#2d5f3f]" />
            {copy.personalInfo}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#7a8b7f] mb-2">{copy.name}</label>
                <div className="flex items-center gap-3 p-4 bg-[#f8f9f8] rounded-xl">
                  <FaUser className="text-[#2d5f3f] text-lg" />
                  <span className="text-[#1e4029] font-medium">{user?.name || copy.noInfo}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7a8b7f] mb-2">{copy.email}</label>
                <div className="flex items-center gap-3 p-4 bg-[#f8f9f8] rounded-xl">
                  <FaEnvelope className="text-[#2d5f3f] text-lg" />
                  <span className="text-[#1e4029] font-medium">{user?.email || copy.noInfo}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7a8b7f] mb-2">{copy.role}</label>
                <div className="flex items-center gap-3 p-4 bg-[#f8f9f8] rounded-xl">
                  <FaUser className="text-[#2d5f3f] text-lg" />
                  <span className="text-[#1e4029] font-medium">{getRoleLabel(user?.role) || copy.noInfo}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#7a8b7f] mb-2">{copy.phone}</label>
                <div className="flex items-center gap-3 p-4 bg-[#f8f9f8] rounded-xl">
                  <FaPhone className="text-[#2d5f3f] text-lg" />
                  <span className="text-[#1e4029] font-medium">{user?.phoneNumber || copy.noInfo}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7a8b7f] mb-2">{copy.company}</label>
                <div className="flex items-center gap-3 p-4 bg-[#f8f9f8] rounded-xl">
                  <FaBuilding className="text-[#2d5f3f] text-lg" />
                  <span className="text-[#1e4029] font-medium">{user?.company || copy.noInfo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        {(user?.address || user?.website) && (
          <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-[#1e4029] mb-6 flex items-center gap-3">
              <FaMapMarkerAlt className="text-[#2d5f3f]" />
              {copy.contactInfo}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user?.address && (
                <div>
                  <label className="block text-sm font-medium text-[#7a8b7f] mb-2">{copy.address}</label>
                  <div className="flex items-center gap-3 p-4 bg-[#f8f9f8] rounded-xl">
                    <FaMapMarkerAlt className="text-[#2d5f3f] text-lg" />
                    <span className="text-[#1e4029] font-medium">{user.address}</span>
                  </div>
                </div>
              )}

              {user?.website && (
                <div>
                  <label className="block text-sm font-medium text-[#7a8b7f] mb-2">{copy.website}</label>
                  <div className="flex items-center gap-3 p-4 bg-[#f8f9f8] rounded-xl">
                    <FaGlobe className="text-[#2d5f3f] text-lg" />
                    <a
                      href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2d5f3f] font-medium hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Settings */}
        <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-[#1e4029] mb-6 flex items-center gap-3">
            <FaUser className="text-[#2d5f3f]" />
            {copy.accountSettings}
          </h2>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-2">{copy.deleteAccount}</h3>
                <p className="text-red-700 text-sm">{copy.deleteAccountDesc}</p>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                <FaTrashAlt size={14} />
                <span className="font-medium">{copy.deleteAccount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default UserProfile;

