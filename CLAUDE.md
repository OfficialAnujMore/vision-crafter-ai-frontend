# VisionCrafterAI — Frontend

## Tech Stack

- **React 19** with TypeScript (strict mode)
- **Vite** for dev server and builds
- **Fabric.js 7.1.0** for canvas rendering and manipulation
- **Axios** for API calls
- **React Router 7** for routing
- **Vitest** for testing

## Commands

```bash
npm run dev       # Start dev server on :5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm test          # Run tests with Vitest
npm run lint      # ESLint
```

## Directory Structure

```
src/
├── pages/              # Route-level components (Editor, Dashboard, SignUp, LandingPage)
├── components/
│   ├── Canvas/         # CanvasEditor, TopBar, BottomToolbar, FeatureBar
│   ├── FeatureComponents/  # One component per editing tool (Text, Crop, Resize, Adjust, etc.)
│   └── CustomComponents/   # Reusable UI elements (Button, Slider, ColorPicker, Input)
├── services/
│   ├── api/            # Axios instance + service modules (auth, project, canvas, s3)
│   ├── config/         # API endpoint constants
│   └── export/         # Canvas export utilities (PNG, JPG, WebP, PDF)
├── context/            # React Context (canvasContext — stores Fabric canvas ref + active tool)
├── hooks/              # Custom hooks (useCanvasHistory for undo/redo)
├── interface/          # TypeScript interfaces (api, auth, canvas, project, common)
├── constants/          # App constants (routes, colors, button/text variants, export formats)
├── utils/              # Utilities (CanvasHistoryManager, toast, googleFonts, injectColors)
├── styles/             # CSS files organized by component type
└── layouts/            # Layout wrappers (MainLayout)
```

## Architecture

### Canvas System
- `CanvasEditor.tsx` initializes Fabric.js and sets up event listeners
- Canvas ref is shared via `canvasContext` (React Context)
- `CanvasHistoryManager` tracks up to 50 undo/redo states in memory
- Undo/redo exposed globally via `window.canvasUndo()` / `window.canvasRedo()`

### Auto-Save Pipeline
Canvas change → `addToHistory()` → debounced save (5s) → export canvas to data URL → overwrite the project's S3 object in place via presigned PUT (URL stays stable, `?v=ts` cache-buster) → save `canvas_state` JSON to backend

### Tool Activation Flow
`BottomToolbar` click → `setActiveTool()` via context → `FeatureBar` renders the matching `FeatureComponent`

### API Layer
- Axios instance in `services/api/index.ts` with request/response interceptors
- 401 responses trigger token refresh automatically
- Service modules: `authService`, `projectService`, `canvasService`, `s3Service` (presigned uploads)

### Auth
- Google OAuth via `@react-oauth/google`
- Tokens stored in HttpOnly cookies (set by backend)
- User state cached in localStorage for UI

## Styling

- Plain CSS files — no framework (no Tailwind, no CSS modules)
- One CSS file per component/feature, stored in `styles/`
- CSS variables defined in `constants/colors.ts` and injected via `utils/injectColors.ts`

## Key Files

| File | Purpose |
|------|---------|
| `src/components/Canvas/CanvasEditor.tsx` | Core canvas initialization and event handling |
| `src/components/Canvas/FeatureBar.tsx` | Routes active tool to the correct feature component |
| `src/services/api/index.ts` | Axios instance with interceptors |
| `src/context/canvasContext.ts` | Canvas and active tool state |
| `src/utils/CanvasHistoryManager.ts` | Undo/redo state management |
| `src/services/export/exportService.ts` | Canvas export to PNG/JPG/WebP/PDF |
