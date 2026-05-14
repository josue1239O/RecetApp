# 🧑‍🍳 ChefApp — RecetApp

Aplicación web progresiva (PWA) para estudiantes de gastronomía y chefs digitales. Permite crear, organizar y visualizar recetas con un cuaderno de dibujo técnico integrado y asistente culinario con IA.

## ✨ Características

- **Gestión de Recetas** — Creación, edición y eliminación de recetas con ingredientes, cantidades, tiempos y porciones.
- **Categorización** — Filtra recetas por categorías personalizables (Postres, Salado, Bebidas, Saludable, etc.).
- **Cuaderno de Dibujo** — Modo "Cuaderno" con canvas táctil para dibujar esquemas técnicos, plating y notas visuales.
- **Asistente IA** — Panel integrado con Gemini AI para consultar técnicas, sustituciones y mejoras de recetas.
- **Autenticación** — Login con Google via Firebase Authentication.
- **Sincronización Cloud** — Datos almacenados en Firestore en tiempo real.
- **Modo Oscuro** — Tema claro/oscuro con diseño atelier gastronómico.
- **PWA** — Instalable como aplicación en dispositivos móviles y desktop.

## 🚀 Tecnologías

| Frontend | Backend/Services | Herramientas |
|----------|-----------------|--------------|
| React 18 | Firebase Auth | Vite |
| Framer Motion | Firestore | PWA Plugin |
| Lucide Icons | Gemini AI | Firebase CLI |
| CSS Variables | Google Sign-In | |

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/josue1239O/RecetApp.git
cd RecetApp

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

## 🔧 Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo Vite |
| `npm run build` | Compila para producción |
| `npm run preview` | Previsualiza build de producción |

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── AIPanel.jsx         # Chat con asistente culinario IA
│   ├── CategoriesModal.jsx # Modal de selección de categorías
│   ├── DashboardItems.jsx  # RecipeCard y CategoryItem
│   ├── DrawingCanvas.jsx   # Canvas de dibujo técnico
│   ├── Login.jsx           # Pantalla de inicio de sesión
│   ├── ProfileModal.jsx    # Perfil del usuario y ajustes
│   └── RecipeForm.jsx      # Formulario de creación de recetas
├── lib/
│   └── firebase.js         # Configuración y servicios de Firebase
├── styles/
│   └── globals.css         # Sistema de diseño y estilos globales
├── App.jsx                 # Componente principal y lógica de estado
└── main.jsx                # Punto de entrada
```

## 🌐 Demo

La aplicación está desplegada en Firebase Hosting.  
Accede en: [https://recetapp-bfa4a.web.app](https://recetapp-bfa4a.web.app)

## 🔐 Configuración

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita **Authentication** con Google Sign-In
3. Crea una base de datos **Firestore**
4. (Opcional) Obtén una **API Key de Gemini** en [aistudio.google.com](https://aistudio.google.com/app/apikey)
5. Actualiza `src/lib/firebase.js` con tus credenciales

## 📄 Licencia

MIT
