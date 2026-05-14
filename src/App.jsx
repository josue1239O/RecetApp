import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Plus, Heart, Clock, Users, ChevronLeft,
  Type, PenTool, Sparkles, Book, CheckCircle2,
  Circle, Home, User, Settings, Save, ChefHat, Moon, Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import DrawingCanvas from './components/DrawingCanvas';
import RecipeForm from './components/RecipeForm';
import Login from './components/Login';
import ProfileModal from './components/ProfileModal';
import CategoriesModal from './components/CategoriesModal';
import { RecipeCard, CategoryItem } from './components/DashboardItems';
import {
  auth, db, onAuthStateChanged, signOut,
  collection, addDoc, getDocs, query, where, setDoc, doc, deleteDoc
} from './lib/firebase';
import './styles/globals.css';

const INITIAL_DATA = [];
const INITIAL_CATEGORIES = [
  { name: 'Todo' }, { name: 'Postres' }, { name: 'Salado' }, { name: 'Bebidas' }, { name: 'Saludable' }
];

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('home');
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [active, setActive] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [category, setCategory] = useState('Todo');
  const [search, setSearch] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark Mode side effect
  useEffect(() => {
    if (isDarkMode) document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
  }, [isDarkMode]);

  // Auth Listener
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  // Firestore Data Fetcher
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        // Fetch Recipes
        const q = query(collection(db, "recipes"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const fetchedRecipes = snap.docs.map(d => {
          const data = d.data();
          if (data.notes && typeof data.notes === 'string') {
            try { data.notes = JSON.parse(data.notes); } catch (e) { data.notes = []; }
          }
          return { ...data, id: d.id };
        });
        setRecipes(fetchedRecipes.length > 0 ? fetchedRecipes : INITIAL_DATA);

        // Sync Categories merging initial ones with user-created ones
        const cq = query(collection(db, "categories"), where("userId", "==", user.uid));
        const csnap = await getDocs(cq);
        const fetchedCats = csnap.docs.map(d => d.data());

        // Merge without duplicates
        const merged = [...INITIAL_CATEGORIES];
        fetchedCats.forEach(fc => {
          if (!merged.find(m => m.name === fc.name)) merged.push(fc);
        });
        setCategories(merged);
      };
      fetchUserData();
    }
  }, [user]);

  // Sync Categories to Firestore
  const addCategory = async (name) => {
    const newCats = [...categories, { name }];
    setCategories(newCats);
    if (user) {
      await addDoc(collection(db, "categories"), { name, userId: user.uid });
    }
  };

  const handleDeleteCategory = async (name) => {
    if (name === 'Todo') return;
    if (confirm(`¿Borrar la categoría "${name}"? Las recetas no se borrarán.`)) {
      setCategories(categories.filter(c => c.name !== name));
      if (user) {
        const q = query(collection(db, "categories"), where("userId", "==", user.uid), where("name", "==", name));
        const snap = await getDocs(q);
        snap.forEach(async (d) => await deleteDoc(d.ref));
      }
    }
  };

  const filtered = useMemo(() => {
    return recipes.filter(r =>
      (category === 'Todo' || r.category === category) &&
      (r.title.toLowerCase().includes(search.toLowerCase()))
    );
  }, [recipes, category, search]);

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-low)', color: 'var(--primary)', fontWeight: 700 }}>Preparando la cocina...</div>;
  if (!user) return <Login />;

  const toggleIngredient = async (ingId) => {
    const updatedRecipes = recipes.map(r => {
      if (r.id === active.id) {
        const newIngs = r.ingredients.map(i => i.id === ingId ? { ...i, checked: !i.checked } : i);
        return { ...r, ingredients: newIngs };
      }
      return r;
    });
    setRecipes(updatedRecipes);
    const newActive = updatedRecipes.find(r => r.id === active.id);
    setActive(newActive);

    // Sync to Firestore
    if (user) {
      await setDoc(doc(db, "recipes", active.id), { ...newActive, userId: user.uid });
    }
  };

  const saveNotes = async (strokes) => {
    if (!active) return;
    const updatedRecipes = recipes.map(r => r.id === active.id ? { ...r, notes: strokes } : r);
    setRecipes(updatedRecipes);
    setActive(prev => ({ ...prev, notes: strokes }));

    // Sync to Firestore with merge
    if (user) {
      try {
        await setDoc(doc(db, "recipes", active.id), { notes: strokes }, { merge: true });
      } catch (e) {
        console.error("Error updating notes:", e);
      }
    }
  };

  const handleSaveRecipe = async (newRecipe) => {
    setSaving(true);
    try {
      // Fix: Firestore doesn't support nested arrays (strokes inside notes).
      // We serialize to JSON string.
      const recipeToSave = {
        ...newRecipe,
        userId: user.uid,
        updatedAt: new Date().toISOString(),
        notes: JSON.stringify(newRecipe.notes || [])
      };

      delete recipeToSave.image;

      const docRef = await addDoc(collection(db, "recipes"), recipeToSave);
      setRecipes(prev => [...prev, { ...newRecipe, id: docRef.id }]);
      setIsFormOpen(false);
      alert("¡Receta guardada con éxito!");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert(`Error Técnico: ${error.message}.`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      setRecipes(recipes.filter(r => r.id !== recipeId));
      if (user) {
        await deleteDoc(doc(db, "recipes", recipeId));
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Error al eliminar la receta");
    }
  };

  // Nav Handlers
  const openRecipe = (r) => { setActive(r); setView('recipe'); window.scrollTo(0, 0); };
  const backToHome = () => { setView('home'); setActive(null); };

  const handleOpenCategories = () => {
    setView('home');
    setActive(null);
    setIsCategoriesOpen(true);
  };

  return (
    <div className="app-container">
      {saving && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(var(--bg-rgb, 245, 243, 238), 0.85)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(5px)'
        }}>
          <ChefHat size={50} className="spin" style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
          <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary)', fontWeight: 600 }}>Guardando en el recetario...</p>
        </div>
      )}

      {view === 'home' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="main-content container">
          <header className="app-header" style={{ marginBottom: '1rem' }}>
            <div className="app-header-left">
              <h1>Bienvenido a la Cocina</h1>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem', fontWeight: 600, color: 'var(--primary)' }}>
                <ChefHat size={18} /> Chef {user.displayName ? user.displayName.split(' ')[0] : 'Guzmán'} | <Book size={16} /> {recipes.length} Recetas
              </p>
            </div>
            <div className="app-header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="search-container">
                <Search size={22} color="var(--primary)" />
                <input
                  placeholder="Buscar receta..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={{ background: 'var(--surface-high)', padding: '10px', borderRadius: '50%', color: 'var(--primary)', width: '42px', height: '42px' }}
                className="desktop-only-btn"
                title="Cambiar Modo Oscuro"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => setIsProfileOpen(true)}
                className="desktop-only-btn"
                style={{ background: 'var(--surface-high)', padding: '10px', borderRadius: '50%', color: 'var(--primary)', width: '42px', height: '42px' }}
                title="Mi Perfil"
              >
                <User size={20} />
              </button>

              <button
                onClick={() => signOut(auth)}
                className="logout-btn-desktop"
              >
                Cerrar Sesión
              </button>
            </div>
          </header>

          {/* Categorías (Todo, Postres, etc.) */}
          <section id="categories-section" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1rem 0', marginBottom: '2rem', alignItems: 'center' }}>
            {categories.map(c => (
              <CategoryItem
                key={c.name}
                category={c}
                active={category === c.name}
                onClick={setCategory}
                onDelete={handleDeleteCategory}
              />
            ))}
            <button
              onClick={() => {
                const name = prompt('Nueva categoría:');
                if (name) addCategory(name);
              }}
              style={{ background: 'var(--surface-highest)', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-full)', color: 'var(--primary)', border: '1px dashed var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={18} /> Nueva
            </button>
          </section>

          <section>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Mis Creaciones Digitales</h2>

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px dashed var(--primary)' }}>
                <Sparkles size={48} style={{ color: 'var(--primary)', marginBottom: '1rem', opacity: 0.8 }} />
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Aún no hay recetas aquí</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Empieza a documentar tu primer platillo tocando el recuadro gigante a continuación.</p>
              </div>
            )}

            <div className="grid-responsive">
              {filtered.map(r => <RecipeCard key={r.id} recipe={r} onClick={openRecipe} onDelete={handleDeleteRecipe} />)}
              <div
                className="card-recipe"
                style={{ background: 'var(--surface-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px', border: '3px dashed var(--primary)', opacity: 0.6, cursor: 'pointer' }}
                onClick={() => setIsFormOpen(true)}
              >
                <Plus size={48} color="var(--primary)" />
              </div>
            </div>
          </section>

          {/* Mobile Bottom Navigation - Centered 3 items */}
          <div className="nav-mobile" style={{ justifyContent: 'center', gap: '2rem' }}>
            <button onClick={handleOpenCategories}>
              <Book size={28} />
            </button>
            <button className="nav-fab-mobile" onClick={() => setIsFormOpen(true)}>
              <Plus size={32} />
            </button>
            <button onClick={() => setIsProfileOpen(true)}>
              <User size={28} />
            </button>
          </div>
        </motion.div>
      )}

      {view === 'recipe' && active && (
        <motion.div initial={{ x: '20px', opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="main-content container recipe-view">
          <header className="recipe-header">
            <button onClick={backToHome} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700 }}>
              <ChevronLeft /> Volver al Recetario
            </button>
            <div style={{ background: 'var(--surface-high)', padding: '6px', borderRadius: 'var(--radius-full)', display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setActive({ ...active, mode: 'text' })}
                style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-full)', background: active.mode === 'text' ? 'var(--surface-color)' : 'transparent', color: active.mode === 'text' ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: active.mode === 'text' ? 'var(--shadow-sm)' : 'none', fontWeight: active.mode === 'text' ? 700 : 400 }}
              >
                <Type size={18} /> Texto
              </button>
              <button
                onClick={() => setActive({ ...active, mode: 'notebook' })}
                style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-full)', background: active.mode === 'notebook' ? 'var(--surface-color)' : 'transparent', color: active.mode === 'notebook' ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: active.mode === 'notebook' ? 'var(--shadow-sm)' : 'none', fontWeight: active.mode === 'notebook' ? 700 : 400 }}
              >
                <PenTool size={18} /> Cuaderno
              </button>
            </div>
          </header>

          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '3.5rem', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{active.title}</h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              <span><Clock size={20} /> {active.time}</span>
              <span><Users size={20} /> {active.portions} personas</span>
            </div>
          </div>

          <div className="recipe-layout">
            <aside>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)' }}>
                <ChefHat size={24} /> Ingredientes
              </h3>
              <ul className="ingredients-list">
                {active.ingredients.map(ing => (
                  <li key={ing.id} onClick={() => toggleIngredient(ing.id)} style={{ cursor: 'pointer' }}>
                    {ing.checked ? <CheckCircle2 size={24} color="var(--primary)" /> : <Circle size={24} color="var(--surface-highest)" />}
                    <div style={{ flex: 1, textDecoration: ing.checked ? 'line-through' : 'none', opacity: ing.checked ? 0.5 : 1 }}>
                      <p style={{ fontWeight: 600 }}>{ing.name}</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{ing.amount}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>

            <main>
              {active.mode === 'text' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>Técnica de Elaboración</h3>
                  {active.steps.map((step, i) => (
                    <motion.div key={i} whileHover={{ x: 10 }} className="step-item">
                      <span style={{ background: 'var(--primary)', color: 'white', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>
                        {i + 1}
                      </span>
                      <p style={{ fontSize: '1.1rem' }}>{step}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <PenTool size={24} /> Notas y Dibujos del Chef
                  </h3>
                  <DrawingCanvas strokes={active.notes} onSave={saveNotes} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
                    Los trazos se guardan automáticamente como parte de tu receta.
                  </p>
                </div>
              )}
            </main>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <RecipeForm
            onSave={handleSaveRecipe}
            onClose={() => setIsFormOpen(false)}
            categories={categories.filter(c => c.name !== 'Todo')}
          />
        )}

        {isProfileOpen && (
          <ProfileModal
            user={user}
            recipesCount={recipes.length}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
            onLogout={() => { setIsProfileOpen(false); signOut(auth); }}
            onClose={() => setIsProfileOpen(false)}
          />
        )}

        {isCategoriesOpen && (
          <CategoriesModal
            categories={categories}
            selectedCategory={category}
            onSelectCategory={setCategory}
            onClose={() => setIsCategoriesOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
