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
      className="space-y-4 flex flex-col items-center text-white"
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
        className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800"
      >
        {filename ? `Selected: ${filename}` : "Choose Video File"}
      </button>

      <button
        type="submit"
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {uploading ? "Uploading..." : "Upload VOD"}
      </button>
    </form>
  );
}
