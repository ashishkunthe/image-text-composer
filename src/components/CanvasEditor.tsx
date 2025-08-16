import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { loadGoogleFont } from "../utils/googleFonts";
import { Toolbar } from "./Toolbar";
import { TextControls } from "./TextControls";

interface CanvasEditorProps {
  imageSrc?: string;
}

export function CanvasEditor({ imageSrc }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isRestoringRef = useRef(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [fonts, setFonts] = useState<string[]>([]);
  const [selectedFont, setSelectedFont] = useState<string>("");

  // Initializing Fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#f0f0f0",
      selection: true,
    });

    fabricRef.current = fabricCanvas;

    // ✅ Zoom with mouse wheel
    fabricCanvas.on("mouse:wheel", (opt) => {
      const evt = opt.e as WheelEvent;
      let zoom = fabricCanvas.getZoom();
      zoom *= 0.999 ** evt.deltaY;
      if (zoom > 5) zoom = 5;
      if (zoom < 0.5) zoom = 0.5;
      fabricCanvas.zoomToPoint({ x: evt.offsetX, y: evt.offsetY }, zoom);
      evt.preventDefault();
      evt.stopPropagation();
    });

    // ✅ Pan with Alt + Drag
    let panning = false;
    fabricCanvas.on("mouse:down", (opt) => {
      const evt = opt.e as MouseEvent;
      if (evt.altKey) {
        panning = true;
        fabricCanvas.setCursor("grab");
      }
    });

    fabricCanvas.on("mouse:move", (opt) => {
      if (panning && opt.e) {
        const evt = opt.e as MouseEvent;
        fabricCanvas.relativePan({ x: evt.movementX, y: evt.movementY });
      }
    });

    fabricCanvas.on("mouse:up", () => {
      panning = false;
      fabricCanvas.setCursor("default");
    });

    // Restore saved design
    const saved = localStorage.getItem("canvasDesign");
    if (saved) {
      isRestoringRef.current = true;
      const json = JSON.parse(saved);

      fabricRef.current?.loadFromJSON(json, () => {
        const canvas = fabricRef.current!;
        // ✅ Restore canvas size from JSON
        if (json.width && json.height) {
          canvas.setWidth(json.width);
          canvas.setHeight(json.height);
          if (canvasRef.current) {
            canvasRef.current.width = json.width;
            canvasRef.current.height = json.height;
          }
        }

        canvas.renderAll();

        setHistory([saved]);
        setHistoryIndex(0);
        isRestoringRef.current = false;
      });
    } else {
      fabricRef.current.add(
        new fabric.Textbox("Hello", { left: 100, top: 100, fontSize: 40 })
      );
    }

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    const resizeCanvas = () => {
      if (!fabricRef.current || !canvasRef.current) return;
      if (isRestoringRef.current) return; // ✅ skip during restore

      const parent = canvasRef.current.parentElement;
      if (!parent) return;

      const { clientWidth, clientHeight } = parent;

      canvasRef.current.width = clientWidth;
      canvasRef.current.height = clientHeight;

      fabricRef.current.setWidth(clientWidth);
      fabricRef.current.setHeight(clientHeight);
      fabricRef.current.renderAll();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Handle image change
  useEffect(() => {
    if (imageSrc && fabricRef.current) {
      fabric.Image.fromURL(imageSrc, (img) => {
        const canvas = fabricRef.current!;

        // Set canvas size to image size
        canvas.setWidth(img.width || 800); // fallback width
        canvas.setHeight(img.height || 600); // fallback height

        // Position the image at top-left
        img.set({
          left: 0,
          top: 0,
          originX: "left",
          originY: "top",
          selectable: false, // optional, if you don't want the bg image movable
        });

        // Set as background image
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    }
  }, [imageSrc]);

  useEffect(() => {
    const fetchFonts = async () => {
      const res = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAFvCZZ4gSJ_mQ6lsqPucNW4GpvDoyhx0Y&sort=popularity`
      );
      const data = await res.json();
      setFonts(data.items.map((f: any) => f.family));
    };
    fetchFonts();
  }, []);

  const handleFontChange = (fontName: string) => {
    setSelectedFont(fontName);
    loadGoogleFont(fontName);

    const activeObj = fabricRef.current?.getActiveObject() as fabric.Textbox;
    if (activeObj) {
      activeObj.set({ fontFamily: fontName });
      fabricRef.current?.renderAll();
    }
  };

  useEffect(() => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;

    const saveHistory = () => {
      if (isRestoringRef.current) return;

      const json = canvas.toJSON();
      // @ts-ignore
      json.width = canvas.getWidth();
      // @ts-ignore
      json.height = canvas.getHeight();

      const jsonString = JSON.stringify(json);

      // Save to localStorage
      localStorage.setItem("canvasDesign", jsonString);

      setHistory((prev) => {
        let withoutRedo = prev;
        if (historyIndex !== -1) {
          withoutRedo = prev.slice(0, historyIndex + 1);
        }
        let updated = [...withoutRedo, jsonString];
        if (updated.length > 20) {
          updated = updated.slice(updated.length - 20);
        }
        setHistoryIndex(updated.length - 1);
        return updated;
      });
    };

    const events = [
      "object:added",
      "object:modified",
      "object:removed",
      "text:changed",
    ];
    events.forEach((evt) => canvas.on(evt, saveHistory));

    saveHistory();

    return () => {
      events.forEach((evt) => canvas.off(evt, saveHistory));
    };
  }, []);

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      isRestoringRef.current = true;
      fabricRef.current?.loadFromJSON(history[prevIndex], () => {
        fabricRef.current?.renderAll();
        setHistoryIndex(prevIndex);
        isRestoringRef.current = false;
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      isRestoringRef.current = true;
      fabricRef.current?.loadFromJSON(history[nextIndex], () => {
        fabricRef.current?.renderAll();
        setHistoryIndex(nextIndex);
        isRestoringRef.current = false;
      });
    }
  };

  const exportAsPNG = () => {
    if (!fabricRef.current) return;

    // Export with original image size
    const dataURL = fabricRef.current.toDataURL({
      format: "png",
      quality: 1.0,
      multiplier: 1,
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "export.png";
    link.click();
  };

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const active = canvas.getActiveObject();
      if (!active) return;

      const step = e.shiftKey ? 10 : 1;
      let moved = false;

      switch (e.key) {
        case "ArrowLeft":
          active.left = (active.left ?? 0) - step;
          moved = true;
          break;
        case "ArrowRight":
          active.left = (active.left ?? 0) + step;
          moved = true;
          break;
        case "ArrowUp":
          active.top = (active.top ?? 0) - step;
          moved = true;
          break;
        case "ArrowDown":
          active.top = (active.top ?? 0) + step;
          moved = true;
          break;
      }

      if (moved) {
        e.preventDefault();
        active.setCoords();
        canvas.renderAll();

        canvas.fire("object:modified", { target: active });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex w-screen min-h-screen overflow-scroll">
      <div className="w-[450px] bg-white shadow-lg border-r flex flex-col">
        <div className="p-4 flex-1 overflow-scroll">
          <Toolbar
            undo={undo}
            redo={redo}
            exportAsPNG={exportAsPNG}
            resetCanvas={() => {
              localStorage.removeItem("canvasDesign");
              fabricRef.current?.clear();
              fabricRef.current?.renderAll();
            }}
          />
          <div className="mt-6">
            <TextControls
              fabric={fabric}
              fabricRef={fabricRef}
              fonts={fonts}
              handleFontChange={handleFontChange}
              selectedFont={selectedFont}
            />
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 w-60 bg-gray-100 overflow-auto flex justify-center items-start p-6">
        <canvas ref={canvasRef} className="border shadow-lg rounded-xl" />
      </div>
    </div>
  );
}
