import React, { useState } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import axios from '../utils/axiosInstance';
import { useUser } from '../context/userContext';
import { useLanguage } from '../context/languageContext';
import { API_PATHS } from '../utils/apiPaths';
import toast from 'react-hot-toast';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const { user, clearUser } = useUser();
  const { lang } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const content = {
    FR: {
      title: 'Supprimer mon compte',
      warning: 'Attention ! Cette action est irréversible.',
      description: 'La suppression de votre compte entraînera :',
      consequences: [
        'La suppression permanente de toutes vos données',
        'La perte de l\'accès à tous vos projets et tâches',
        'La suppression de vos conversations et messages',
        'L\'impossibilité de récupérer votre compte'
      ],
      confirmation: 'Pour confirmer la suppression, tapez "SUPPRIMER" dans le champ ci-dessous :',
      placeholder: 'Tapez SUPPRIMER pour confirmer',
      cancel: 'Annuler',
      delete: 'Supprimer définitivement',
      success: 'Votre compte a été supprimé avec succès',
      error: 'Erreur lors de la suppression du compte'
    },
    EN: {
      title: 'Delete my account',
      warning: 'Warning! This action is irreversible.',
      description: 'Deleting your account will result in:',
      consequences: [
        'Permanent deletion of all your data',
        'Loss of access to all your projects and tasks',
        'Deletion of your conversations and messages',
        'Inability to recover your account'
      ],
      confirmation: 'To confirm deletion, type "DELETE" in the field below:',
      placeholder: 'Type DELETE to confirm',
      cancel: 'Cancel',
      delete: 'Delete permanently',
      success: 'Your account has been successfully deleted',
      error: 'Error deleting account'
    },
    DE: {
      title: 'Mein Konto löschen',
      warning: 'Achtung! Diese Aktion ist irreversibel.',
      description: 'Das Löschen Ihres Kontos führt zu:',
      consequences: [
        'Permanente Löschung aller Ihrer Daten',
        'Verlust des Zugriffs auf alle Ihre Projekte und Aufgaben',
        'Löschung Ihrer Unterhaltungen und Nachrichten',
        'Unmöglichkeit, Ihr Konto wiederherzustellen'
      ],
      confirmation: 'Um die Löschung zu bestätigen, geben Sie "LÖSCHEN" in das Feld unten ein:',
      placeholder: 'Geben Sie LÖSCHEN ein, um zu bestätigen',
      cancel: 'Abbrechen',
      delete: 'Endgültig löschen',
      success: 'Ihr Konto wurde erfolgreich gelöscht',
      error: 'Fehler beim Löschen des Kontos'
    },
    IT: {
      title: 'Elimina il mio account',
      warning: 'Attenzione! Questa azione è irreversibile.',
      description: 'L\'eliminazione del tuo account comporterà:',
      consequences: [
        'Eliminazione permanente di tutti i tuoi dati',
        'Perdita dell\'accesso a tutti i tuoi progetti e attività',
        'Eliminazione delle tue conversazioni e messaggi',
        'Impossibilità di recuperare il tuo account'
      ],
      confirmation: 'Per confermare l\'eliminazione, digita "ELIMINA" nel campo sottostante:',
      placeholder: 'Digita ELIMINA per confermare',
      cancel: 'Annulla',
      delete: 'Elimina definitivamente',
      success: 'Il tuo account è stato eliminato con successo',
      error: 'Errore durante l\'eliminazione dell\'account'
    }
  };

  const copy = content[lang] || content.FR;
  const requiredText = lang === 'EN' ? 'DELETE' : lang === 'DE' ? 'LÖSCHEN' : lang === 'IT' ? 'ELIMINA' : 'SUPPRIMER';

  const handleDeleteAccount = async () => {
    if (confirmText !== requiredText) {
      toast.error('Le texte de confirmation ne correspond pas');
      return;
    }

    setIsLoading(true);
    try {
      await axios.delete(API_PATHS.USERS.DELETE_OWN_ACCOUNT);
      toast.success(copy.success);
      clearUser(); // Déconnecte l'utilisateur
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      toast.error(copy.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-red-600" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{copy.title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 font-medium">{copy.warning}</p>
          </div>

          <div>
            <p className="text-gray-700 font-medium mb-3">{copy.description}</p>
            <ul className="space-y-2">
              {copy.consequences.map((consequence, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600 text-sm">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{consequence}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {copy.confirmation}
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={copy.placeholder}
              className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-3 bg-white">
          <button
            onClick={handleClose}
            className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            {copy.cancel}
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={isLoading || confirmText !== requiredText}
            className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg shadow-red-600/10"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{copy.delete}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;

