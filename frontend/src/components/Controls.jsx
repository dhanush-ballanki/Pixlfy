import { useState, useRef } from "react";

export default function Controls({ onUpload, onConvert, loading }) {
  const [file, setFile] = useState(null);
  const [pixelSize, setPixelSize] = useState(8);
  const [palette, setPalette] = useState("original");
  const [dither, setDither] = useState(true);
  const [colors, setColors] = useState(8);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    setFile(f);
    onUpload(f);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) handleFile(f);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleConvertClick = () => {
    if (!file) {
      alert("Please upload an image first!");
      return;
    }
    onConvert(file, { pixelSize, palette, dither, colors });
  };

  return (
    <div className="space-y-4 mb-6">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition
          ${dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-white"}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        style={{ cursor: "pointer" }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={inputRef}
          style={{ display: "none" }}
        />
        <div className="flex flex-col items-center">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path fill="#6366f1" d="M12 16a1 1 0 0 1-1-1V8.41l-2.3 2.3a1 1 0 1 1-1.4-1.42l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1-1.4 1.42L13 8.42V15a1 1 0 0 1-1 1Z"/><path fill="#6366f1" d="M20 18a1 1 0 0 1-1-1v-7a8 8 0 1 0-16 0v7a1 1 0 1 1-2 0v-7a10 10 0 1 1 20 0v7a1 1 0 0 1-1 1Z"/></svg>
          <span className="mt-2 text-indigo-600 font-semibold">
            {dragActive ? "Drop your image here..." : "Click or drag & drop an image"}
          </span>
          {file && <span className="mt-1 text-gray-500 text-sm">{file.name}</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <label className="flex flex-col">
          <span className="font-medium mb-1">Pixel Size</span>
          <input
            type="number"
            min="1"
            value={pixelSize}
            onChange={(e) => setPixelSize(Number(e.target.value))}
            className="border rounded-lg p-2"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium mb-1">Palette</span>
          <select
            value={palette}
            onChange={(e) => setPalette(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="original">Original</option>
            <option value="grayscale">Grayscale</option>
            <option value="gameboy">GameBoy</option>
            <option value="nes">NES</option>
          </select>
        </label>

        <label className="flex flex-col">
          <span className="font-medium mb-1">Colors</span>
          <input
            type="number"
            min="2"
            max="256"
            value={colors}
            onChange={(e) => setColors(Number(e.target.value))}
            className="border rounded-lg p-2"
          />
        </label>

        <label className="flex items-center gap-2 col-span-2 md:col-span-1">
          <input
            type="checkbox"
            checked={dither}
            onChange={() => setDither(!dither)}
          />
          <span>Dithering</span>
        </label>
      </div>

      <button
        disabled={loading}
        onClick={handleConvertClick}
        className={`w-full py-2 rounded-lg font-semibold text-white transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Converting..." : "Convert Image"}
      </button>
    </div>
  );
}