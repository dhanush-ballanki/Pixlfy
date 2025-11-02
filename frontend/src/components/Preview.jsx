export default function Preview({ origImage, outImage }) {
  if (!origImage && !outImage) return null;

  return (
    <div className="flex flex-col md:flex-row justify-around items-start mt-4 gap-6">
      {origImage && (
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-medium mb-2 text-gray-600">Original</h3>
          <img
            src={origImage}
            alt="Original"
            className="max-w-xs rounded-lg shadow"
          />
        </div>
      )}

      {outImage && (
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-medium mb-2 text-gray-600">Pixel Art</h3>
          <img
            src={outImage}
            alt="Output"
            className="max-w-xs rounded-lg shadow"
          />
          <a
            href={outImage}
            download="pixel_art.png"
            className="mt-3 rainbow-bg text-white px-4 py-2 rounded-lg transition"
          >
            ⬇ Download PNG
          </a>

        </div>
      )}
    </div>
  );
}
