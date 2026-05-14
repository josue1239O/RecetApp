import React from 'react';
import { X, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CategoriesModal({ categories, selectedCategory, onSelectCategory, onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: '100%' }} 
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ 
          marginTop: 'auto', 
          borderBottomLeftRadius: 0, 
          borderBottomRightRadius: 0,
          padding: '2rem',
          maxHeight: '70vh'
        }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Categorías</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Filtra tu recetario</p>
          </div>
          <button className="close-btn" onClick={onClose}><X /></button>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {categories.map(c => {
            const isSelected = selectedCategory === c.name;
            return (
              <button
                key={c.name}
                onClick={() => {
                  onSelectCategory(c.name);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  background: isSelected ? 'var(--surface-high)' : 'var(--surface-low)',
                  border: `1px solid ${isSelected ? 'var(--primary)' : 'transparent'}`,
                  borderRadius: 'var(--radius-md)',
                  color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: isSelected ? 700 : 600,
                  fontSize: '1.1rem',
                  transition: 'var(--transition)'
                }}
              >
                {c.name}
                {isSelected && <Check size={20} color="var(--primary)" />}
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
