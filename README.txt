# ConceptLab AI — no-API demo files

These files are intended for your existing Vite + React + TypeScript project named `robotics-mission-control`.

## 1. Install the required packages
Open the VS Code terminal in `robotics-mission-control` and run:

```powershell
npm.cmd install three @react-three/fiber @react-three/drei lucide-react
```

## 2. Replace the files
- Replace `src/App.tsx` with the `App.tsx` from this package.
- Replace `src/index.css` with the `index.css` from this package.
- Check that `src/main.tsx` imports `./index.css` and renders `<App />`. A standard Vite React entry file already does this.

## 3. Run the site
In the project terminal:

```powershell
npm.cmd run dev
```

Open the exact `Local:` URL printed in the terminal in Chrome. Keep the terminal running.

## Supported interactive demo topics
- Electric Motor
- Solar System
- Water Cycle
- Photosynthesis
- Atomic Structure

This demo uses built-in lessons and 3D illustrations, not live AI. If a user enters an unsupported topic, it explains that limitation and offers a general planning activity rather than pretending it generated a real AI answer.

3D note: drag to rotate and scroll to zoom. The controls are illustrative learning controls, not scientific instruments.
