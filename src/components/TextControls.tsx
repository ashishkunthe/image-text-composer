interface TextControlsProps {
  fabricRef: any;
  selectedFont: any;
  handleFontChange: any;
  fonts: any;
  fabric: any;
}

export function TextControls({
  fabricRef,
  selectedFont,
  handleFontChange,
  fonts,
  fabric,
}: TextControlsProps) {
  return (
    <div
      className="flex flex-col gap-6 p-4 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl border border-gray-200 w-[400px]"
      style={{ fontFamily: `"Poppins", "Inter", sans-serif` }}
    >
      {/* 🎨 Text Style Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Text Style</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Color Picker */}
          <label className="flex flex-col text-sm font-medium text-gray-800">
            <span>Color</span>
            <input
              type="color"
              className="h-10 w-10 cursor-pointer rounded-md border border-gray-300 shadow-sm mt-1"
              onChange={(e) => {
                const activeObj =
                  fabricRef.current?.getActiveObject() as fabric.Textbox;
                if (activeObj) {
                  activeObj.set({ fill: e.target.value });
                  fabricRef.current?.renderAll();
                }
              }}
            />
          </label>

          {/* Font Selector */}
          <label className="flex flex-col text-sm font-medium text-gray-800">
            <span>Font</span>
            <select
              value={selectedFont}
              onChange={(e) => handleFontChange(e.target.value)}
              className="mt-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            >
              <option value="">Select Font</option>
              {fonts.map((font: any) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </label>

          {/* Font Size */}
          <label className="flex flex-col text-sm font-medium text-gray-800">
            <span>Size</span>
            <input
              type="number"
              min={8}
              max={200}
              placeholder="30"
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm"
              onChange={(e) => {
                const activeObj =
                  fabricRef.current?.getActiveObject() as fabric.Textbox;
                if (activeObj) {
                  activeObj.set({ fontSize: parseInt(e.target.value, 10) });
                  fabricRef.current?.renderAll();
                }
              }}
            />
          </label>

          {/* Bold Button */}
          <button
            onClick={() => {
              const activeObj =
                fabricRef.current?.getActiveObject() as fabric.Textbox;
              if (activeObj) {
                const current =
                  activeObj.fontWeight === "bold" ? "normal" : "bold";
                activeObj.set({ fontWeight: current });
                fabricRef.current?.renderAll();
              }
            }}
            className="mt-6 px-3 py-2 rounded-lg bg-gray-100 shadow hover:bg-gray-200 transition text-sm font-semibold"
          >
            <b>B</b>
          </button>
        </div>
      </div>

      {/* ➕ Add Text */}
      <button
        onClick={() =>
          fabricRef.current?.add(
            new fabric.Textbox("New Text", {
              left: 50,
              top: 50,
              fontSize: 30,
              fill: "#000000",
              fontFamily: "Arial",
            })
          )
        }
        className="w-full px-4 py-2 rounded-lg bg-indigo-500 text-white shadow hover:bg-indigo-600 transition font-medium"
      >
        ➕ Add Text
      </button>

      {/* 📐 Alignment & Opacity */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Alignment & Opacity
        </h3>
        <div className="flex items-center gap-4">
          <label className="flex flex-col text-sm font-medium text-gray-800">
            <span>Align</span>
            <select
              className="mt-1 rounded-md border border-gray-300 px-2 py-1 shadow-sm"
              onChange={(e) => {
                const activeObj =
                  fabricRef.current?.getActiveObject() as fabric.Textbox;
                if (activeObj) {
                  activeObj.set({
                    textAlign: e.target.value as "left" | "center" | "right",
                  });
                  fabricRef.current?.renderAll();
                }
              }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-800 flex-1">
            <span>Opacity</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              className="accent-indigo-500 mt-2"
              onChange={(e) => {
                const activeObj =
                  fabricRef.current?.getActiveObject() as fabric.Textbox;
                if (activeObj) {
                  activeObj.set({ opacity: parseFloat(e.target.value) });
                  fabricRef.current?.renderAll();
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* 🪄 Effects */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Effects</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Stroke */}
          <label className="flex flex-col text-sm">
            <span>Stroke</span>
            <input
              type="color"
              onChange={(e) => {
                const activeObj =
                  fabricRef.current?.getActiveObject() as fabric.Textbox;
                if (activeObj) {
                  activeObj.set({ stroke: e.target.value });
                  fabricRef.current?.renderAll();
                }
              }}
            />
          </label>

          {/* Stroke Width */}
          <label className="flex flex-col text-sm">
            <span>Stroke Width</span>
            <input
              type="number"
              min={0}
              max={10}
              className="rounded-md border px-2 py-1 shadow-sm"
              onChange={(e) => {
                const activeObj =
                  fabricRef.current?.getActiveObject() as fabric.Textbox;
                if (activeObj) {
                  activeObj.set({ strokeWidth: parseInt(e.target.value, 10) });
                  fabricRef.current?.renderAll();
                }
              }}
            />
          </label>

          {/* Shadow Color */}
          <label className="flex flex-col text-sm">
            <span>Shadow Color</span>
            <input
              type="color"
              onChange={(e) => {
                const activeObj =
                  fabricRef.current?.getActiveObject() as fabric.Textbox;
                if (activeObj) {
                  const shadow = activeObj.shadow || {};
                  activeObj.set({
                    // @ts-ignore
                    shadow: {
                      ...shadow,
                      color: e.target.value,
                      // @ts-ignore
                      offsetX: shadow.offsetX || 0,
                      // @ts-ignore
                      offsetY: shadow.offsetY || 0,
                      // @ts-ignore
                      blur: shadow.blur || 0,
                    },
                  });
                  fabricRef.current?.renderAll();
                }
              }}
            />
          </label>

          {/* Shadow X */}
          <label className="flex flex-col text-sm">
            <span>Shadow X</span>
            <input
              type="number"
              defaultValue={0}
              className="rounded-md border px-2 py-1 shadow-sm"
              onChange={(e) => {
                const activeObj =
                  fabricRef.current?.getActiveObject() as fabric.Textbox;
                if (activeObj) {
                  const shadow = activeObj.shadow || {};
                  activeObj.set({
                    // @ts-ignore
                    shadow: {
                      ...shadow,
                      offsetX: parseInt(e.target.value, 10), // @ts-ignore
                      color: shadow.color || "#000000", // @ts-ignore
                      offsetY: shadow.offsetY || 0, // @ts-ignore
                      blur: shadow.blur || 0,
                    },
                  });
                  fabricRef.current?.renderAll();
                }
              }}
            />
          </label>

          {/* Shadow Y */}
          <label className="flex flex-col text-sm">
            <span>Shadow Y</span>
            <input
              type="number"
              defaultValue={0}
              className="rounded-md border px-2 py-1 shadow-sm"
              onChange={(e) => {
                const activeObj =
                  fabricRef.current?.getActiveObject() as fabric.Textbox;
                if (activeObj) {
                  const shadow = activeObj.shadow || {};
                  activeObj.set({
                    // @ts-ignore
                    shadow: {
                      ...shadow,
                      offsetY: parseInt(e.target.value, 10), // @ts-ignore
                      color: shadow.color || "#000000", // @ts-ignore
                      offsetX: shadow.offsetX || 0, // @ts-ignore
                      blur: shadow.blur || 0,
                    },
                  });
                  fabricRef.current?.renderAll();
                }
              }}
            />
          </label>

          {/* Shadow Blur */}
          <label className="flex flex-col text-sm">
            <span>Shadow Blur</span>
            <input
              type="number"
              min={0}
              max={50}
              defaultValue={0}
              className="rounded-md border px-2 py-1 shadow-sm"
              onChange={(e) => {
                const activeObj =
                  fabricRef.current?.getActiveObject() as fabric.Textbox;
                if (activeObj) {
                  const shadow = activeObj.shadow || {};
                  activeObj.set({
                    // @ts-ignore
                    shadow: {
                      ...shadow,
                      blur: parseInt(e.target.value, 10), // @ts-ignore
                      color: shadow.color || "#000000", // @ts-ignore
                      offsetX: shadow.offsetX || 0, // @ts-ignore
                      offsetY: shadow.offsetY || 0,
                    },
                  });
                  fabricRef.current?.renderAll();
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* 📚 Layer Controls */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Layer Controls
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            className="px-3 py-2 rounded-lg bg-gray-100 shadow hover:bg-gray-200 text-sm"
            onClick={() => {
              const activeObj = fabricRef.current?.getActiveObject();
              if (activeObj) {
                fabricRef.current?.bringToFront(activeObj);
                fabricRef.current?.renderAll();
              }
            }}
          >
            ⬆️ Bring Front
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-gray-100 shadow hover:bg-gray-200 text-sm"
            onClick={() => {
              const activeObj = fabricRef.current?.getActiveObject();
              if (activeObj) {
                fabricRef.current?.sendToBack(activeObj);
                fabricRef.current?.renderAll();
              }
            }}
          >
            ⬇️ Send Back
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-gray-100 shadow hover:bg-gray-200 text-sm"
            onClick={() => {
              const activeObj = fabricRef.current?.getActiveObject();
              if (activeObj) {
                fabricRef.current?.bringForward(activeObj);
                fabricRef.current?.renderAll();
              }
            }}
          >
            ↗️ Bring Forward
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-gray-100 shadow hover:bg-gray-200 text-sm"
            onClick={() => {
              const activeObj = fabricRef.current?.getActiveObject();
              if (activeObj) {
                fabricRef.current?.sendBackwards(activeObj);
                fabricRef.current?.renderAll();
              }
            }}
          >
            ↘️ Send Backward
          </button>
        </div>
      </div>
    </div>
  );
}
