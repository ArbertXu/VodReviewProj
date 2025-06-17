import { useEffect, useState } from "react";
import VideoPlayer from "../assets/components/VideoPlayer";
export default function VodTest() {
  const [vods, setVods] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userID, setUserID] = useState(null);
  const [vodComments, setvodComments] = useState({});

  useEffect(() => {
    const storedUserID = sessionStorage.getItem("user_id");
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);
    useEffect(() => {
        if (!userID) return;
        fetch(`http://localhost:3000/api/vods/user/${userID}`)
        .then((res) => res.json())
        .then((data) => {
            console.log("Fetched VOD data:", data);
            setVods(data);
        })
        .catch((err) => console.error("Error fetching VODs:", err));
    }, [userID]);
    useEffect(() => {
  console.log("VOD URLs:", vods.map(v => v.url));
}, [vods]);
  useEffect(() => {
    if (!userID) return;
    const fetchComments = async () => {
        const allComments = {}
        for (const vod of vods) {
            try {
                const res = await fetch(`http://localhost:3000/api/vod_comments/${vod.vod_id}`)
                const data = await res.json()
                allComments[vod.vod_id] = data
            } catch (err) {
                console.error(`Error fetching comments for VOD ${vod.vod_id}`, err)
            }
        }
        setvodComments(allComments)
    }
    if (vods.length > 0)
 {
    fetchComments()
 }  }, [vods])


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
                  {vods.map((vod) => (
  <div key={vod.vod_id} className="mb-8">
    <video controls width="600">
      <source src={vod.url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div className="text-white">
            <h3 className="font-bold mb-2">Comments:</h3>
            {vodComments[vod.vod_id]?.length > 0 ? (
              <ul className="space-y-2">
                {vodComments[vod.vod_id].map((c, index) => (
                  <li key={index} className="bg-gray-800 p-2 rounded">
                    <strong>{formatTimestamp(c.timestamp_seconds)}</strong>: {c.comments}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic">No comments yet</p>
            )}
          </div>
  </div>
))}


    </div>
  );
}
function formatTimestamp(seconds) {
  if (isNaN(seconds)) return "0:00";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const paddedMins = hrs > 0 ? String(mins).padStart(2, "0") : mins;
  const paddedSecs = String(secs).padStart(2, "0");

  return hrs > 0
    ? `${hrs}:${paddedMins}:${paddedSecs}`
    : `${paddedMins}:${paddedSecs}`;
}
