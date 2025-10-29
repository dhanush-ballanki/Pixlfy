import { useState } from "react";

export default function Controls({ onUpload, onConvert, loading }) {
  const [file, setFile] = useState(null);
  const [pixelSize, setPixelSize] = useState(8);
  const [palette, setPalette] = useState("original");
  const [dither, setDither] = useState(true);
  const [colors, setColors] = useState(8);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      onUpload(f);
    }
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
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0 file:text-sm file:font-semibold
          file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />

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
