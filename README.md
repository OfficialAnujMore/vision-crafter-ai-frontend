# Vision Crafter AI - Frontend

A web-based AI-powered image editing and creation tool built with React and Fabric.js. Users can upload images, apply edits using a suite of tools (text, crop, resize, background removal, AI-powered image extension), and export in multiple formats.

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Canvas Engine:** Fabric.js 7
- **Routing:** React Router DOM 7
- **HTTP Client:** Axios
- **Authentication:** Google OAuth (`@react-oauth/google`)
- **Image Hosting:** ImageKit.io
- **Styling:** CSS

## Features

- Google OAuth authentication
- Project dashboard with search and management
- Canvas-based image editor with:
  - Text addition with full typography controls
  - Crop with preset aspect ratios (1:1, 16:9, 4:5, 9:16, freeform)
  - Resize canvas and images
  - Image adjustments (brightness, contrast, saturation)
  - AI-powered background removal
  - Background color and image replacement
  - AI-powered image extension
- Undo/Redo (up to 50 states)
- Auto-save with 5-second debounce
- Export to PNG, JPEG, WebP, and PDF

## Prerequisites

- Node.js (v18+)
- npm

## Setup

1. Clone the repository:

```bash
git clone https://github.com/OfficialAnujMore/vision-crafter-ai-frontend.git
cd vision-crafter-ai-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory (refer to `.env.example`):

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_IMAGEKIT_UPLOAD_URL=https://upload.imagekit.io/api/v1/files/upload
VITE_IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-imagekit-id
VITE_IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
VITE_UNSPLASH_ACCESS_KEY=your-unsplash-access-key
VITE_UNSPLASH_SECRET_KEY=your-unsplash-secret-key
```

4. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest in watch mode |
| `npm run test:run` | Run all tests once |
| `npm run test:coverage` | Generate test coverage report |

## Project Structure

```
src/
├── pages/               # Route-level components (Landing, SignUp, Dashboard, Editor)
├── components/
│   ├── Canvas/          # Core editor interface (CanvasEditor, TopBar, BottomToolbar)
│   ├── FeatureComponents/  # Editing tools (Text, Crop, Resize, Adjust, etc.)
│   └── CustomComponents/   # Reusable UI elements
├── services/
│   ├── api/             # Axios instance and API service modules
│   ├── export/          # Canvas export logic (PNG/JPEG/WebP/PDF)
│   └── config/          # API endpoint configuration
├── context/             # React Context for canvas and tool state
├── hooks/               # Custom hooks (useCanvasHistory)
├── interface/           # TypeScript type definitions
├── constants/           # Routes, colors, text/button variants
├── utils/               # Helpers (history manager, fonts, toast)
├── styles/              # CSS files organized by component
└── layouts/             # App wrapper layout
```

## Related

- [Backend Repository](https://github.com/OfficialAnujMore/vision-crafter-ai-backend)
