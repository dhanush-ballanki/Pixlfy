export default function Loader() {
  return (
    <div className="flex flex-col items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
      <span className="mt-3 text-indigo-600 font-semibold">Processing...</span>
    </div>
  );
}