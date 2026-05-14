# ChefApp - RecetApp

Aplicación web para gestión de recetas de cocina con un cuaderno de dibujo integrado. Permite crear, organizar y visualizar recetas, así como realizar esquemas técnicos y anotaciones visuales sobre una pizarra táctil.

## Características

- **Gestión de recetas** — Creación de recetas con ingredientes, cantidades, tiempos de preparación y porciones.
- **Categorización** — Organiza las recetas por categorías personalizables (Postres, Salado, Bebidas, Saludable).
- **Pizarra de dibujo** — Canvas táctil para dibujar esquemas técnicos, técnicas de emplatado y notas visuales.
- **Buscador** — Filtra recetas por nombre y categoría.
- **Tema oscuro** — Interfaz con modo claro/oscuro.
- **Sincronización en la nube** — Las recetas se almacenan en Firestore y se sincronizan automáticamente.
- **Autenticación** — Inicio de sesión con Google.
- **Diseño responsive** — Adaptado a dispositivos móviles y desktop.

## Tecnologías

| Frontend | Backend | Herramientas |
|----------|---------|--------------|
| React 18 | Firebase Auth | Vite |
| Framer Motion | Firestore | PWA |
| Lucide React | | |

## Instalación

```bash
npm install
npm run dev
```

## Estructura del proyecto

```
src/
├── components/
│   ├── CategoriesModal.jsx
│   ├── DashboardItems.jsx
│   ├── DrawingCanvas.jsx
│   ├── Login.jsx
│   ├── ProfileModal.jsx
│   └── RecipeForm.jsx
├── lib/
│   └── firebase.js
├── styles/
│   └── globals.css
├── App.jsx
└── main.jsx
```
