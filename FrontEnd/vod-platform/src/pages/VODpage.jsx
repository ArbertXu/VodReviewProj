import { useEffect, useState, useRef } from "react";
import Dashboard from "../assets/components/dashboard";
import CommentSection from "../assets/components/commentForm";
import UploadForm from "../assets/components/UploadFile";
import { Link } from "react-router-dom";
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
  


  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!file || !userID) {
      alert("Please select a video file and login");
      return;
    }

    setUploading(true);
    try {
      const fileType = file.type;
      const fileName = file.name;

      const res = await fetch("http://localhost:3000/api/get-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({fileName, fileType}),
      })
      
      const {uploadURL, fileKey} = await res.json();
      
      const s3Res = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": fileType },
        body: file,
      })

      if (!s3Res.ok) throw new Error("Upload to S3 failed");

      const publicURL = `https://${import.meta.env.VITE_S3_BUCKET}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileKey}`;

       const metadataRes = await fetch("http://localhost:3000/api/vods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: publicURL,
            s3_key: fileKey,
            date_uploaded: new Date().toISOString(),
            user_id: userID,
          }),
        });

        const newVod = await metadataRes.json();
        setVods((prev) => [...prev, newVod]);
        setFile(null);
      } catch (err) {
        console.error("Error uploading:", err);
      } finally {
        setUploading(false);
    }

    // const formData = new FormData();
    // formData.append("video", file);
    // formData.append("user_id", userID);
    //  try {
    //   const res = await fetch("http://localhost:3000/api/upload", {
    //     method: "POST",
    //     body: formData,
    //   });
    //   const {url, s3_key, date_uploaded} = await res.json();
    //   console.log("Upload success:");

    //   const metadataRes = await fetch("http://localhost:3000/api/vods", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       url,
    //       user_id: userID, 
    //       s3_key,
    //       date_uploaded,
    //     }),
    //   });

    //   const newVod = await metadataRes.json();
    //   setVods((prev) => [...prev, newVod]);
    //   setFile(null);
    // } catch (err) {
    //   console.error("Upload error:", err);
    // } finally {
    //   setUploading(false);
    // }
    
  };



  return (
    
    <div className="p-4">
        <Dashboard/>
      <h2 className="text-xl font-bold mb-4 text-white">Upload a New VOD</h2>

      <UploadForm
        buttonText="Submit VOD"
        fileLabel="Upload your match clip"
        onSubmit={handleSubmit}
        onFileChange={handleFileChange}
        uploading={uploading}
      />

      <h1 className="text-2xl p-5 text-white">Your VODS</h1>
      <div className="flex flex-wrap gap-4">
            {vods.map((vod) => (
              <Link key={vod.vod_id} to={`/vod/${vod_id}`}>
                 <CommentSection vod={vod} canComment={false}/>
              </Link>
            ))}
      </div>
                  
    </div>
  );
}

