import { useState } from "react";
import axios from "axios";
import Controls from "./components/Controls";
import Preview from "./components/Preview";
import RainbowWaveText from "./components/RainbowWaveText";

function App() {
  const [origImage, setOrigImage] = useState(null);
  const [outImage, setOutImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (file) => {
    setOrigImage(URL.createObjectURL(file));
  };

  const handleConvert = async (file, settings) => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("pixel_size", settings.pixelSize);
      form.append("palette", settings.palette);
      form.append("dither", settings.dither ? "true" : "false");
      form.append("colors", settings.colors);

      // 👇 Axios request to Django backend
      const response = await axios.post(
        "http://127.0.0.1:8000/api/convert/",
        form,
        {
          responseType: "blob", // important for binary data
          //headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Convert blob to a previewable image URL
      const url = URL.createObjectURL(response.data);
      setOutImage(url);
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="floating-shape floating-shape1"></div>
      <div className="floating-shape floating-shape2"></div>
      <div className="floating-shape floating-shape3"></div>
      <div className="min-h-screen flex flex-col items-center p-6">
        <div className="flex gap-2">
          <img src="/favicon-96.png" alt="Logo" className="w-10 h-10 mt-1" />
          <RainbowWaveText text="Pixlfy"/>
        </div>
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6">
          <Controls
            onUpload={handleUpload}
            onConvert={handleConvert}
            loading={loading}
          />
          <Preview origImage={origImage} outImage={outImage} />
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Built with React + Tailwind + Django 🧩
        </p>
      </div>
    </>
  );
}

export default App;
