import { Clock, Users, Trash2, X, PenTool, Type, ChefHat } from 'lucide-react';

export const CategoryItem = ({ category, active, onClick, onDelete }) => (
  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
    <button 
      onClick={() => onClick(category.name)}
      className={`category-chip ${active ? 'active' : ''}`}
      style={{
        background: active ? 'var(--primary)' : 'var(--surface-color)',
        color: active ? 'white' : 'var(--text-main)',
        padding: '0.75rem 1.5rem',
        paddingRight: (onDelete && category.name !== 'Todo') ? '2.5rem' : '1.5rem',
        borderRadius: 'var(--radius-full)',
        boxShadow: 'var(--shadow-sm)',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: '1px solid var(--surface-highest)',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }}
    >
      {category.name}
    </button>
    {onDelete && category.name !== 'Todo' && (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(category.name);
        }}
        style={{
          position: 'absolute',
          right: '8px',
          background: active ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
          border: 'none',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: active ? 'white' : 'var(--text-muted)',
          cursor: 'pointer'
        }}
      >
        <X size={12} />
      </button>
    )}
  </div>
);

export const RecipeCard = ({ recipe, onClick, onDelete }) => (
  <div className="card-recipe" onClick={() => onClick(recipe)} style={{ 
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '260px',
    padding: '1.5rem',
    background: 'var(--surface-color)',
    border: '1px solid var(--surface-highest)',
    transition: 'all 0.3s ease'
  }}>
    <div style={{ 
      position: 'absolute', 
      bottom: '10px', 
      right: '10px', 
      opacity: 0.05, 
      pointerEvents: 'none',
      color: 'var(--primary)'
    }}>
      <ChefHat size={120} strokeWidth={1} />
    </div>

    <button 
      onClick={(e) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de eliminar esta receta?')) {
          onDelete(recipe.id);
        }
      }}
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'rgba(255, 255, 255, 0.95)',
        border: 'none',
        borderRadius: '50%',
        width: '34px',
        height: '34px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#dc2626',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-md)',
        zIndex: 10,
        transition: 'all 0.2s ease'
      }}
      className="delete-btn-hover"
    >
      <Trash2 size={16} />
    </button>
    
    <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <span className="card-tag" style={{ margin: 0 }}>{recipe.category}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', opacity: 0.7 }}>
          {recipe.mode === 'notebook' ? <PenTool size={18} /> : <Type size={18} />}
        </div>
      </div>
      
      <h3 style={{ 
        marginBottom: '0.8rem', 
        fontSize: '1.8rem', 
        fontWeight: 800,
        lineHeight: 1.1,
        color: 'var(--text-main)'
      }}>{recipe.title}</h3>
      
      <div className="card-meta" style={{ 
        marginBottom: '2rem', 
        fontSize: '1rem',
        color: 'var(--text-muted)',
        fontWeight: 500
      }}>
        <span style={{ marginRight: '1rem' }}><Clock size={16} /> {recipe.time || 'N/A'}</span>
        <span><Users size={16} /> {recipe.portions || 'N/A'}</span>
      </div>

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div style={{ marginTop: 'auto' }}>
          <div style={{ 
            height: '2px', 
            background: 'var(--primary)', 
            width: '30px', 
            marginBottom: '1rem',
            opacity: 0.3 
          }} />
          <p style={{ 
            fontSize: '0.8rem', 
            fontWeight: 900, 
            color: 'var(--primary)', 
            marginBottom: '0.6rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em' 
          }}>
            Ingredientes ({recipe.ingredients.length})
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {recipe.ingredients.slice(0, 3).map((ing, i) => (
              <li key={i} style={{ 
                fontSize: '0.85rem', 
                background: 'var(--surface-low)', 
                padding: '4px 10px', 
                borderRadius: '8px',
                color: 'var(--text-muted)',
                border: '1px solid var(--surface-highest)',
                fontWeight: 600
              }}>
                {ing.name}
              </li>
            ))}
            {recipe.ingredients.length > 3 && (
              <li style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>+ {recipe.ingredients.length - 3} más</li>
            )}
          </ul>
        </div>
      )}
    </div>
  </div>
);
