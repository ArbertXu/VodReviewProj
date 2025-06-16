import { useEffect, useState } from "react";
import VideoPlayer from "../assets/components/VideoPlayer";
export default function VodTest() {
  const [vods, setVods] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const storedUserID = sessionStorage.getItem("user_id");
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);
    useEffect(() => {

        fetch(`http://localhost:3000/api/vods/user/${userID}`)
        .then((res) => res.json())
        .then((data) => {
            console.log("Fetched VOD data:", data);
            setVods(data);
        })
        .catch((err) => console.error("Error fetching VODs:", err));
    }, [userID]);


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
    formData.append("user_id", userID);
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
          user_id: userID, 
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



  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload a New VOD</h2>

      <form onSubmit={handleSubmit} className="space-y-4 flex justify-center">
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
      <h1 className="text-2xl p-5 text-white">Your VODS</h1>
                  <video controls width="600" src="https://vod-storage-proj.s3.us-east-2.amazonaws.com/vods/compressed-abdde354-fb50-41a2-962d-7c46b52a19da.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAYLKIYXEZSAWWUR3J%2F20250616%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250616T021708Z&X-Amz-Expires=216000&X-Amz-Signature=6073e90398df090c2e2b698ef5b30f627ed4598a8a080f901a3d7f3151f86b08&X-Amz-SignedHeaders=host" />

    </div>
  );
}
