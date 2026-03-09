import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/views/AuthModal.css';
import { t } from '../i18n/translations';

export default function AuthModal({ onClose, isOpen, language = 'fr' }) {
  const { login } = useAuth();
  const modalRef = useRef(null);

  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setFormData({ email: '', username: '', password: '' });
    setResetEmail('');
    setErrors({});
    setShowPassword(false);
  }, [mode]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t('authModal.emailRequired', language);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('authModal.emailInvalid', language);
    }

    if (mode === 'login' || mode === 'register') {
      if (!formData.password) {
        newErrors.password = t('authModal.passwordRequired', language);
      } else if (formData.password.length < 6) {
        newErrors.password = t('authModal.passwordMin', language);
      }
    }

    if (mode === 'register' && (!formData.username || formData.username.trim().length < 3)) {
      newErrors.username = t('authModal.usernameMin', language);
    }

    setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [formData, mode, language]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const endpoint = mode === 'login' ? 'login' : 'register';
      const body =
        mode === 'login'
          ? { email: formData.email, password: formData.password }
          : formData;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`http://localhost:5000/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (res.ok) {
        const userData = {
          username: data.user?.username || formData.username || data.username || t('authModal.defaultUsername', language),
        };
        login(data.token, userData);
        onClose();
      } else {
        setErrors({ general: data.error || t('authModal.generalError', language) });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setErrors({ general: t('authModal.requestTimeout', language) });
      } else {
        setErrors({ general: t('authModal.networkError', language) });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    if (!resetEmail.trim()) {
      setErrors({ general: t('authModal.emailRequired', language) });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch('http://localhost:5000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(t('authModal.resetSent', language))
        setMode('login');
      } else {
        setErrors({ general: data.error || t('authModal.emailNotFound', language) });
      }
    } catch (error) {
      setErrors({ general: t('authModal.networkError', language) });
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = useCallback(
    (field) => (e) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 auth-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="auth-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* HEADER */}
        <div className="auth-modal-header">
          <h2 id="modal-title" className="auth-modal-title">
            {mode === 'login' && t('authModal.loginTitle', language)}
            {mode === 'register' && t('authModal.registerTitle', language)}
            {mode === 'forgot' && t('authModal.forgotTitle', language)}
          </h2>
        </div>

        {/* CONTENU */}
        <div className="auth-modal-content">
          {errors.general && <div className="auth-modal-error">{errors.general}</div>}

          {/* FORMULAIRE MOT DE PASSE OUBLIÉ */}
          {mode === 'forgot' ? (
            <form onSubmit={handleForgotSubmit} noValidate>
              <label htmlFor="resetEmail" className="auth-modal-label">
                {t('authModal.emailLabel', language)}
              </label>
              <input
                id="resetEmail"
                type="email"
                placeholder={t('authModal.emailPlaceholder', language)}
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="auth-modal-input"
                required
              />

              <button type="submit" disabled={isLoading} className="auth-modal-button">
                {isLoading ? t('authModal.sending', language) : t('authModal.sendReset', language)}
              </button>

              <div className="auth-modal-toggle">
                <button
                  type="button"
                  className="auth-modal-toggle-link"
                  disabled={isLoading}
                  onClick={() => setMode('login')}
                >
                  {t('authModal.backToLogin', language)}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAuthSubmit} noValidate>
              {/* USERNAME (inscription seulement) */}
              {mode === 'register' && (
                <>
                  <label htmlFor="username" className="auth-modal-label">
                    {t('authModal.usernameLabel', language)}
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder={t('authModal.usernamePlaceholder', language)}
                    value={formData.username}
                    onChange={updateField('username')}
                    className={`auth-modal-input ${errors.username ? 'error' : ''}`}
                    required={mode === 'register'}
                    maxLength={20}
                    aria-invalid={!!errors.username}
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.username}</p>
                  )}
                </>
              )}

              {/* EMAIL */}
              <label htmlFor="email" className="auth-modal-label">
                {t('authModal.emailLabel', language)}
              </label>
              <input
                id="email"
                type="email"
                placeholder={t('authModal.emailPlaceholder', language)}
                value={formData.email}
                onChange={updateField('email')}
                className={`auth-modal-input ${errors.email ? 'error' : ''}`}
                required
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>
              )}

              {/* PASSWORD + TOGGLE VISIBILITÉ */}
              <label htmlFor="password" className="auth-modal-label">
                {t('authModal.passwordLabel', language)}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('authModal.passwordPlaceholder', language)}
                  value={formData.password}
                  onChange={updateField('password')}
                  className={`auth-modal-input ${errors.password ? 'error' : ''}`}
                  required
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-modal-password-toggle"
                  aria-label={showPassword ? t('authModal.hidePassword', language) : t('authModal.showPassword', language)}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.password}</p>
              )}

              {/* BOUTON PRINCIPAL */}
              <button type="submit" disabled={isLoading} className="auth-modal-button">
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin inline mr-2" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t('authModal.submitting', language)}
                  </>
                ) : mode === 'login' ? (
                  t('authModal.submitLogin', language)
                ) : (
                  t('authModal.submitRegister', language)
                )}
              </button>

              {/* LIEN MOT DE PASSE OUBLIÉ */}
              {mode === 'login' && (
                <div className="auth-modal-toggle" style={{ marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    className="auth-modal-toggle-link"
                    disabled={isLoading}
                    onClick={() => setMode('forgot')}
                  >
                    {t('authModal.forgotPassword', language)}
                  </button>
                </div>
              )}

              {/* TOGGLE LOGIN / REGISTER */}
              <div className="auth-modal-toggle">
                <p className="text-center text-sm text-gray-700 mb-2 font-medium">
                 {mode === 'login' ? t('authModal.noAccount', language) : t('authModal.hasAccount', language)}
                </p>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="auth-modal-toggle-link"
                  disabled={isLoading}
                >
                   {mode === 'login' ? t('authModal.createAccount', language) : t('authModal.loginInstead', language)}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
