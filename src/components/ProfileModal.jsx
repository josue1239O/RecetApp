import React from 'react';
import { X, Moon, Sun, LogOut, Award, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfileModal({ user, recipesCount, isDarkMode, toggleTheme, onLogout, onClose }) {
  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, scale: 0.9 }} 
        animate={{ y: 0, scale: 1 }}
        className="modal-content profile-modal"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '400px', padding: '2rem' }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--text-main)' }}>Mi Perfil</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 700 }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              user.displayName ? user.displayName[0].toUpperCase() : 'C'
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '4px' }}>{user.displayName || 'Chef Guzmán'}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
          </div>
        </div>

        <div style={{ background: 'var(--surface-low)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <BookOpen size={24} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>{recipesCount}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Recetas</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Award size={24} style={{ color: '#D4AF37', marginBottom: '8px' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Junior</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nivel</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={toggleTheme}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--surface-highest)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontWeight: 600 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              Modo {isDarkMode ? 'Claro' : 'Oscuro'}
            </div>
            <div style={{ width: 40, height: 24, borderRadius: 12, background: isDarkMode ? 'var(--primary)' : 'var(--surface-low)', position: 'relative', transition: 'var(--transition)' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: isDarkMode ? 19 : 3, transition: 'var(--transition)' }} />
            </div>
          </button>

          <button 
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '1rem', background: 'transparent', border: '1px solid #CC4444', color: '#CC4444', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
          >
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
