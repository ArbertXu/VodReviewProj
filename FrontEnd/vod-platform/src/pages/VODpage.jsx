import { useEffect, useState } from "react";
import Dashboard from "../assets/components/dashboard";
import CommentSection from "../assets/components/commentForm";
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
        console.log(userID);    
        if (userID === null) return;
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
        <Dashboard/>
      <h2 className="text-xl font-bold mb-4 text-white">Upload a New VOD</h2>

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
      <div className="flex flex-wrap gap-4">
            {vods.map((vod) => (
                <CommentSection vod={vod} canComment={false}/>
            ))}
      </div>
                  
    </div>
  );
}

