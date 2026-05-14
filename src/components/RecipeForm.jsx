import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Type, PenTool, Sparkles, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import DrawingCanvas from './DrawingCanvas';

export default function RecipeForm({ onSave, onClose, categories }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Salado',
    time: '',
    portions: '',
    ingredients: [{ id: Date.now(), name: '', amount: '', checked: false }],
    steps: [''],
    notes: [],
    mode: 'text'
  });

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { id: Date.now(), name: '', amount: '', checked: false }]
    });
  };

  const updateIngredient = (index, field, value) => {
    const newIngs = [...formData.ingredients];
    newIngs[index][field] = value;
    setFormData({ ...formData, ingredients: newIngs });
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      setFormData({ ...formData, ingredients: formData.ingredients.filter((_, i) => i !== index) });
    }
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] });
  };

  const updateStep = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      setFormData({ ...formData, steps: formData.steps.filter((_, i) => i !== index) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return alert('El título es obligatorio');
    onSave({ ...formData });
  };

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
        className={`modal-content recipe-form-modal ${formData.mode === 'notebook' ? 'large-modal' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <header className="form-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '10px', borderRadius: '12px' }}>
              <ChefHat size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>Nueva Creación Culinaria</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Digitaliza tu técnica y sabores</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><X /></button>
        </header>

        <form onSubmit={handleSubmit} className="recipe-form" style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label>Título de la Receta</label>
            <input 
              type="text" 
              placeholder="Ej: Salmón en Croûte de Hierbas" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <div className="category-chips-select">
              {categories.map(c => (
                <button
                  key={c.name}
                  type="button"
                  className={formData.category === c.name ? 'active' : ''}
                  onClick={() => setFormData({ ...formData, category: c.name })}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tiempo</label>
              <input 
                type="text" 
                placeholder="45 min" 
                value={formData.time} 
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Porciones</label>
              <input 
                type="text" 
                placeholder="4 pax" 
                value={formData.portions} 
                onChange={e => setFormData({...formData, portions: e.target.value})}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>Ingredientes</h3>
              <button type="button" onClick={addIngredient} className="add-btn-small">
                <Plus size={16} /> Añadir
              </button>
            </div>
            {formData.ingredients.map((ing, index) => (
              <div key={ing.id} className="item-row">
                <input 
                  type="text" 
                  placeholder="Ingrediente" 
                  value={ing.name} 
                  onChange={e => updateIngredient(index, 'name', e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Cant." 
                  className="amount-input"
                  value={ing.amount} 
                  onChange={e => updateIngredient(index, 'amount', e.target.value)}
                />
                <button type="button" onClick={() => removeIngredient(index)} className="del-btn"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>

          <div className={`form-section ${formData.mode === 'notebook' ? 'full-width-notebook' : ''}`}>
            <div className="section-header">
              <h3>Preparación</h3>
              <div className="mode-toggle-small">
                <button 
                  type="button" 
                  className={formData.mode === 'text' ? 'active' : ''} 
                  onClick={() => setFormData({...formData, mode: 'text'})}
                >
                  <Type size={16} /> Texto
                </button>
                <button 
                  type="button" 
                  className={formData.mode === 'notebook' ? 'active' : ''} 
                  onClick={() => setFormData({...formData, mode: 'notebook'})}
                >
                  <PenTool size={16} /> Cuaderno
                </button>
              </div>
            </div>

            {formData.mode === 'text' ? (
              <>
                <div className="section-header" style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pasos numerados</p>
                  <button type="button" onClick={addStep} className="add-btn-small">
                    <Plus size={16} /> Añadir Paso
                  </button>
                </div>
                {formData.steps.map((step, index) => (
                  <div key={index} className="item-row">
                    <span className="step-num">{index + 1}</span>
                    <textarea 
                      placeholder="Describe el paso..." 
                      value={step} 
                      onChange={e => updateStep(index, e.target.value)}
                    />
                    <button type="button" onClick={() => removeStep(index)} className="del-btn"><Trash2 size={18} /></button>
                  </div>
                ))}
              </>
            ) : (
              <div className="notebook-form-container">
                <p style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600 }}>
                  <PenTool size={18} /> Esquema Técnico del Chef
                </p>
                <DrawingCanvas 
                  strokes={formData.notes} 
                  onSave={(strokes) => setFormData({...formData, notes: strokes})} 
                />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem', fontStyle: 'italic', textAlign: 'center' }}>
                  Los trazos se incluirán automáticamente al guardar la receta.
                </p>
              </div>
            )}
          </div>

          <footer className="form-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">
              <Save size={20} /> Guardar Receta
            </button>
          </footer>
        </form>
      </motion.div>
    </motion.div>
  );
}
