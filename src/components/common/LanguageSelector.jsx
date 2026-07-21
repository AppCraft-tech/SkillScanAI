import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';

const languages = [
  { code: 'en', name: 'English', country: 'GB' },
  { code: 'de', name: 'Deutsch', country: 'DE' },
  { code: 'es', name: 'Español', country: 'ES' },
  { code: 'fr', name: 'Français', country: 'FR' },
  { code: 'it', name: 'Italiano', country: 'IT' },
  { code: 'ja', name: '日本語', country: 'JP' },
  { code: 'ko', name: '한국어', country: 'KR' },
  { code: 'pt', name: 'Português', country: 'PR' },
  { code: 'zh', name: '中文', country: 'CN' },
  { code: 'ur', name: 'اردو', country: 'UR' }
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-between items-center w-36 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-blue-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all"
        >
          <span className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase w-5 text-center">{currentLanguage.country}</span>
            <span className="text-slate-800">{currentLanguage.name}</span>
          </span>
          <FaChevronDown className="w-3 h-3 text-slate-500" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-1 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm transition-colors ${
                  i18n.language === lang.code ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
                role="menuitem"
              >
                <span className={`text-xs font-bold uppercase w-5 text-center ${i18n.language === lang.code ? 'text-blue-200' : 'text-slate-400'}`}>
                  {lang.country}
                </span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
