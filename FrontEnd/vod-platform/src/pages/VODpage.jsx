import { useEffect, useState } from "react";

export default function VodTest() {
  const [vods, setVods] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/vods")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched VOD data:", data);
        setVods(data);
      })
      .catch((err) => console.error("Error fetching VODs:", err));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!file) {
      alert("Please select a video file");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("video", file);
    formData.append("user_id", "1");
     try {
      const res = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });
      const {url, s3_key, date_uploaded} = await res.json();
      console.log("Upload success:");

      const metadataRes = await fetch("http://localhost:3000/api/vods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          user_id: 1, 
          s3_key,
          date_uploaded,
        }),
      });

      const newVod = await metadataRes.json();
      setVods((prev) => [...prev, newVod]);
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const latestVod = vods[vods.length - 1];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload a New VOD</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
        />
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {uploading ? "Uploading..." : "Upload VOD"}
        </button>
      </form>

      {latestVod && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Latest Uploaded VOD</h3>
          <p><strong>Date:</strong> {new Date(latestVod.date_uploaded).toLocaleString()}</p>
          <p><strong>S3 Key:</strong> {latestVod.s3_key}</p>
        </div>
      )}
    </div>
  );
}
