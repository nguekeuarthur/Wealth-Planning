import React from 'react'
import { BASE_URL } from '../utils/apiPaths'

const fullImageUrl = (url) => {
  if (!url) return null;
  // Aggressive cleanup of historical localhost URLs
  let cleaned = url.replace(/^https?:\/\/localhost:8000/, '');
  if (cleaned.startsWith('http')) return cleaned;
  const baseUrlClean = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const pathClean = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
  return `${baseUrlClean}${pathClean}`;
};

const AvatarGroup = ({ avatars, maxVisible = 3 }) => {
  const renderAvatar = (avatar, index) => {
    // avatar can be a string (url) or an object { url, name }
    if (typeof avatar === 'string' && avatar) {
      return (
        <img
          key={index}
          src={fullImageUrl(avatar)}
          alt={`Avatar ${index}`}
          className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0"
        />
      );
    }

    const url = avatar?.url;
    const name = avatar?.name || '';

    if (url) {
      return (
        <img
          key={index}
          src={fullImageUrl(url)}
          alt={name || `Avatar ${index}`}
          className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0"
        />
      );
    }

    const initials = name ? name.charAt(0).toUpperCase() : '?';
    return (
      <div
        key={index}
        className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 bg-[#5a8f6f] flex items-center justify-center text-white font-medium"
        title={name}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="flex items-center">
      {avatars.slice(0, maxVisible).map((avatar, index) => renderAvatar(avatar, index))}
      {avatars.length > maxVisible && (
        <div className="w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup