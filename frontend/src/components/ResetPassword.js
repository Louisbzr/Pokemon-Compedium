import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ResetPassword.css';
import { t } from '../i18n/translations';

const ResetPassword = ({ 
  token, 
  email, 
  onClose, 
  onLogin,
  language = 'fr',
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');  
  const [localEmail, setLocalEmail] = useState('');
  const [localToken, setLocalToken] = useState('');

  useEffect(() => {
    if (email && token) {
      setLocalEmail(email);
      setLocalToken(token);
      return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlEmail = urlParams.get('email');
    const urlToken = urlParams.get('token');
    
    if (urlEmail && urlToken) {
      setLocalEmail(decodeURIComponent(urlEmail));
      setLocalToken(urlToken);
    }
  }, [email, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage(t('resetPassword.passwordMismatch', language));
      setMessageType('error');
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage(t('resetPassword.passwordTooShort', language));
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/auth/reset-password', {
        email: localEmail,
        token: localToken,
        password: newPassword
      });

      if (response.status === 200) {
        setMessageType('success');
        setMessage(t('resetPassword.successMessage', language));

        setTimeout(() => {
          onLogin?.();
          onClose?.();
        }, 1500);
      } else {
        setMessageType('error');
        setMessage(t('resetPassword.resetError', language));
      }

      setMessageType('success');
      setMessage(t('resetPassword.successMessage', language));
      
      setTimeout(() => {
        onLogin?.(); 
        onClose?.();
      }, 1500);

    } catch (error) {
      console.error('Reset error:', error);
      setMessageType('error');
      setMessage(error.response?.data?.error || t('resetPassword.resetError', language));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="reset-password-modal">
        <button className="reset-password-close-btn" onClick={onClose}>×</button>
        
        <div className="reset-password-header">
          <h2 className="reset-password-title">{t('resetPassword.title', language)}</h2>
        </div>

        <div className="reset-password-content">
          <form onSubmit={handleSubmit}>
            <label className="reset-password-label">{t('resetPassword.emailLabel', language)}</label>
            <input
              className="reset-password-input"
              type="email"
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              placeholder={t('resetPassword.emailPlaceholder', language)}
              required
              disabled={!!email || !!token}
            />
            
            <label className="reset-password-label">{t('resetPassword.newPasswordLabel', language)}</label>
            <input
              className="reset-password-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('resetPassword.newPasswordPlaceholder', language)}
              minLength="6"
              required
            />
            
            <label className="reset-password-label">{t('resetPassword.confirmLabel', language)}</label>
            <input
              className="reset-password-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('resetPassword.confirmPlaceholder', language)}
              required
            />

            <button 
              type="submit" 
              className="reset-password-button"
              disabled={loading || !localEmail || !localToken}
            >
              {loading ? t('resetPassword.submitting', language) : t('resetPassword.submitButton', language)}
            </button>
          </form>

          {message && (
            <div className={`reset-password-message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default ResetPassword;
