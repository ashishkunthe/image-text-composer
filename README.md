# Image Text Composer

A React-based canvas editor built with [Fabric.js](https://fabricjs.com/), enabling users to add and manipulate text, images, and objects with features like undo/redo, zooming, panning, and export options.

## Features

- **Text Editing**: Add and edit text boxes with custom fonts.
- **Zoom & Pan**: Zoom in/out using the mouse wheel and pan with Alt + Drag.
- **Undo/Redo**: Supports up to 20 steps of undo and redo actions.
- **Canvas State**: Automatically saves and restores canvas state via `localStorage`.
- **Background Images**: Drag and drop background images with auto-scaling.
- **Keyboard Navigation**: Move objects with arrow keys (fine and coarse movement with Shift).
- **Export**: Export canvas as a high-resolution PNG image.
- **Responsive Design**: Canvas adjusts to the parent container size.

## Screenshots

![Canvas Editor Screenshot](https://via.placeholder.com/800x400.png?text=Canvas+Editor+Screenshot)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ashishkunthe/image-text-composer.git
cd image-text-composer
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173] in your browser.

## Usage

- **Toolbar**: Undo, redo, reset canvas, export as PNG.
- **Text Controls**: Change font, add/edit text.
- **Canvas**: Zoom with mouse wheel, pan with Alt + Drag, move objects with arrow keys.
- **Local Storage**: The canvas state is automatically saved and restored on reload.

## File Structure

```
src/
├── components/
│   ├── CanvasEditor.tsx      # Main canvas component
│   ├── Toolbar.tsx           # Toolbar buttons
│   └── TextControls.tsx      # Text/font controls
├── utils/
│   └── googleFonts.ts        # Utility to load Google Fonts dynamically
├── App.tsx
└── index.tsx
```

## Dependencies

- [React](https://reactjs.org/)
- [Fabric.js](https://fabricjs.com/)
- TypeScript

## License

This project is licensed under the MIT License.
