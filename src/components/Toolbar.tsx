interface ToolbarProps {
  undo: () => void;
  redo: () => void;
  exportAsPNG: () => void;
  resetCanvas: () => void;
}

export function Toolbar({
  undo,
  redo,
  exportAsPNG,
  resetCanvas,
}: ToolbarProps) {
  return (
    <div
      className="flex flex-wrap justify-center gap-3 p-3 rounded-xl bg-white/70 backdrop-blur-md shadow-lg border border-gray-200 max-w-full"
      style={{ fontFamily: `"Poppins", "Inter", sans-serif` }}
    >
      <button
        onClick={undo}
        className="px-3 py-2 rounded-full bg-gray-100 text-gray-700 font-medium shadow hover:bg-gray-200 active:scale-95 transition-all text-sm"
      >
        Undo
      </button>
      <button
        onClick={redo}
        className="px-3 py-2 rounded-full bg-gray-100 text-gray-700 font-medium shadow hover:bg-gray-200 active:scale-95 transition-all text-sm"
      >
        Redo
      </button>
      <button
        onClick={exportAsPNG}
        className="px-3 py-2 rounded-full bg-indigo-500 text-white font-medium shadow hover:bg-indigo-600 active:scale-95 transition-all text-sm"
      >
        Export PNG
      </button>
      <button
        onClick={resetCanvas}
        className="px-3 py-2 rounded-full bg-red-500 text-white font-medium shadow hover:bg-red-600 active:scale-95 transition-all text-sm"
      >
        Reset
      </button>
    </div>
  );
}
