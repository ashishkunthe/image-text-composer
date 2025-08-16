import { useState, useEffect } from "react";
import { CanvasEditor } from "./components/CanvasEditor";

function App() {
  const [imageSrc, setImageSrc] = useState<string>();

  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result as string);
        reader.readAsDataURL(file);
      }
    };

    const handleDragOver = (e: DragEvent) => e.preventDefault();

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 font-[Poppins]">
      {/* 🔹 Header / Toolbar */}
      <header className="h-16 w-full flex items-center justify-between px-6 bg-white shadow-md border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-800">
          Image Text Composer{" "}
        </h1>

        {/* File Upload */}
        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg shadow-sm border hover:bg-gray-200 transition">
          <span className="text-sm font-medium text-gray-700">Upload PNG</span>
          <input
            type="file"
            accept="image/png"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => setImageSrc(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
        </label>
      </header>

      {/* 🔹 Main Editor Area */}
      <main className="flex-1 flex overflow-hidden">
        <CanvasEditor imageSrc={imageSrc} />
      </main>
    </div>
  );
}

export default App;
