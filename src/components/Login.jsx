import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup 
} from '../lib/firebase';

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen-v2" style={{ 
      background: 'var(--bg-color)', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'white',
          padding: '3.5rem 2.5rem',
          borderRadius: '2.5rem',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
          border: '1px solid var(--surface-high)'
        }}
      >
        <div style={{ 
          background: 'var(--primary)', 
          width: '70px', 
          height: '70px', 
          borderRadius: '18px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'white',
          boxShadow: '0 8px 16px rgba(99, 95, 64, 0.2)'
        }}>
          <ChefHat size={35} />
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: '2.8rem', 
          color: 'var(--primary)', 
          marginBottom: '0.4rem',
          fontWeight: 700 
        }}>
          ChefApp
        </h1>
        
        <p style={{ 
          color: 'var(--text-muted)', 
          marginBottom: '3.5rem', 
          fontSize: '1rem',
          fontWeight: 500 
        }}>
          Bienvenido de nuevo, Chef
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '1.2rem', 
              borderRadius: 'var(--radius-full)', 
              background: 'var(--primary)',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 4px 12px rgba(99, 95, 64, 0.15)',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              'Cargando...'
            ) : (
              <>
                <img 
                  src="https://www.google.com/favicon.ico" 
                  alt="Google" 
                  style={{ width: 18, filter: 'brightness(0) invert(1)' }} 
                />
                Ingresar con Google
              </>
            )}
          </button>
        </div>

        <div style={{ marginTop: '3rem', fontSize: '0.8rem', color: 'var(--text-muted)', opacity: 0.5, letterSpacing: '0.05em' }}>
          Sincronizado vía Firebase Cloud
        </div>
      </motion.div>
    </div>
  );
}
