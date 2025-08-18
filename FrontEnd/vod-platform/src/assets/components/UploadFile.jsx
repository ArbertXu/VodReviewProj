import { useRef, useState } from "react";

export default function UploadForm({ onSubmit, uploading, onFileChange}) {
  const fileInputRef = useRef(null);
  const [filename, setFileName] = useState("");

   const handleInternalChange = (e) => {
    const file = e.target.files?.[0];
    setFileName(file?.name || "");
    onFileChange?.(file);
  };

  return (
    <form
  onSubmit={onSubmit}
  className="space-y-6 w-full max-w-md mx-auto p-6 bg-[#111] rounded-2xl shadow-lg border border-gray-700"
>
  <input
    type="file"
    accept="video/*"
    ref={fileInputRef}
    className="hidden"
    onChange={handleInternalChange}
  />

  <button
    type="button"
    onClick={() => fileInputRef.current?.click()}
    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition duration-200 text-sm font-medium"
  >
    {filename ? ` Selected: ${filename}` : " Choose Video File"}
  </button>

  <button
    type="submit"
    disabled={uploading || !filename}
    className={`w-full ${
      uploading || !filename
        ? "bg-gray-800 cursor-not-allowed"
        : "bg-gray-700 hover:bg-gray-600"
    } text-white py-2 px-4 rounded-lg transition duration-200 text-sm font-semibold`}
  >
    {uploading ? "Uploading..." : " Upload VOD"}
  </button>
</form>
  );
}
