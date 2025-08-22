import { useEffect, useState, useRef } from "react";
import Dashboard from "../assets/components/dashboard";
import CommentSection from "../assets/components/commentForm";
import UploadForm from "../assets/components/UploadFile";
import { Link } from "react-router-dom";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { ToastContainer, toast } from 'react-toastify'; 
import {auth} from "../firebaseAuth";
export default function VodTest() {
  const [vods, setVods] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userID, setUserID] = useState(null);
  const [user, setUser] = useState(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const ffmpegRef = useRef(null);
  const [game, setGame] = useState("");

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-100 border-red-400 text-red-700';
    if (progress < 70) return 'bg-yellow-100 border-yellow-400 text-yellow-700';
    return 'bg-green-100 border-green-400 text-green-700';
  };

  const handleGameChange = (e) => {
        setGame(e.target.value);
    }
  useEffect(() => {
          const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
              setUser(firebaseUser);
          })
          return () => unsubscribe();
      }, []);
    
   const handleDelete = async (vod_id) => {
        if(!window.confirm("Are you sure you want to delete this vod?")) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/delete-video/${vod_id}`, {
                method: "DELETE",
            })
        if (!res.ok) {
            const err = await res.json()
            toast.error("Video Failed to delete");
            return;
        }
        toast.success("Video Successfully deleted!");
        setVods((prev) => prev.filter((v) => v.vod_id !== vod_id))
        } catch (err) {
            console.error("ERROR deleting video:", err);
            toast.error("Error Deleting Video");
        }
    }
  useEffect(() => {
    const initFFmpeg = async () => {
      if (!ffmpegRef.current) {
        ffmpegRef.current = new FFmpeg();
        ffmpegRef.current.on('progress', ({ progress }) => {
          setUploadProgress(Math.round(progress * 100));
        });

        try {
          await ffmpegRef.current.load({
            coreURL: await toBlobURL(`${import.meta.env.VITE_FFMPEG_CORE_URL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${import.meta.env.VITE_FFMPEG_CORE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
          });
          
          setFfmpegLoaded(true);
          console.log('FFmpeg loaded successfully');
        } catch (error) {
          console.error('Failed to load FFmpeg:', error);
          setError('Failed to initialize video processor. Please refresh the page.');
        }
      }
    };

    initFFmpeg();
  }, []);
  useEffect(() => {
    const storedUserID = sessionStorage.getItem("user_id");
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);
  useEffect(() => {
    console.log("UserID:", userID);
    if (!userID || !user) return;
    
    const fetchUserVods = async () => {
        try {
            const token = await user.getIdToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vods/user`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            
            if (!res.ok) {
                throw new Error(`HTTP error ${res.status}`);
            }
            
            const data = await res.json();
            console.log("Fetched VOD data:", data);
            setVods(data);
        } catch (err) {
            console.error("Error fetching VODs:", err);
        }
    };

    fetchUserVods();
}, [userID, user]);

useEffect(() => {
    if (vods && vods.length > 0) {
        console.log("VOD URLs:", vods.map(v => v.url));
    }
}, [vods]);
  


  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setError('');
  };

  const validateFile = (file) => {
    const maxSize = 500 * 1024 * 1024;
    const allowedTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi'];
    
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 500MB.');
    }
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload MP4, WebM, MOV, or AVI files.');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!file || !userID) {
      alert("Please select a video file and login");
      return;
    }
    
    const token = await user.getIdToken();
    if (!ffmpegLoaded) {
      setError("Video processor not ready. Please wait and try again.");
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);
    try {
    validateFile(file);
      
    const ffmpeg = ffmpegRef.current;
      
      try {
        await ffmpeg.deleteFile('input.mp4');
        await ffmpeg.deleteFile('output.webm');
      } catch (e) {

      }
      console.log('Starting video processing...');
      const inputFileName = file.name.includes('.') ? 
        `input.${file.name.split('.').pop()}` : 'input.mp4';
      await ffmpeg.writeFile(inputFileName, await fetchFile(file));

      const ffmpegArgs = [
        '-i', inputFileName,
        '-vf', 'scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2',
        '-c:v', 'libx264', // Use H.264 instead of VP9
        '-crf', '28', // Good quality for H.264
        '-preset', 'ultrafast', // H.264 preset
        '-c:a', 'aac', // Use AAC instead of Opus
        '-b:a', '96k',
        '-movflags', '+faststart', // Optimize for web streaming
        'output.mp4' // Output as MP4
      ];

      console.log('FFmpeg command:', ffmpegArgs.join(' '));
      
      await ffmpeg.exec(ffmpegArgs);

      console.log('Video processing completed');
      
      
      const data = await ffmpeg.readFile('output.mp4');
      
      
      await ffmpeg.deleteFile('input.mp4');
      await ffmpeg.deleteFile('output.mp4');
      

      const compressedFile = new File([data.buffer], 'compressed.mp4', {type: 'video/mp4'});
      const fileType = compressedFile.type;
      const fileName = compressedFile.name;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/get-upload-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({fileName, fileType}),
      })

      if (!res.ok) {
        throw new Error(`failed to get uplaoded URL: ${res.statusText}`)
      }
      
      const {uploadURL, fileKey} = await res.json();
      
      const s3Res = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": fileType },
        body: compressedFile,
      })

      if (!s3Res.ok) throw new Error("Upload to S3 failed");

      const publicURL = `https://${import.meta.env.VITE_S3_BUCKET}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileKey}`;

       const metadataRes = await fetch(`${import.meta.env.VITE_API_URL}/api/vods`, {
          method: "POST",
          headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
           },
          body: JSON.stringify({
            url: publicURL,
            s3_key: fileKey,
            date_uploaded: new Date().toISOString(),
            game: game,
          }),
        });

        const newVod = await metadataRes.json();
        setVods((prev) => [...prev, newVod]);
        setFile(null);
        toast.success("Video successfully uploaded!")
      } catch (err) {
        console.error("Error uploading:", err);
      } finally {
        setUploading(false);
    }
    
  };
  return (
    
    <div className="p-4">
        <Dashboard/>
      <h2 className="text-xl font-bold mb-4 text-white">Upload a New VOD</h2>
    {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}


      {uploading && (
      <div className={`mb-4 p-3 border rounded transition-colors duration-500 ${getProgressColor(uploadProgress)}`}>
        <div className="flex justify-between items-center mb-2">
          <span>Processing video: {uploadProgress}%</span>
        </div>
        <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${uploadProgress}%`,
              backgroundColor: uploadProgress < 30 ? '#dc2626' : 
                            uploadProgress < 70 ? '#d97706' : '#059669'
            }}
          />
        </div>
      </div>
    )}
    <label htmlFor="game" className="block mb-2 text-lg  text-white">
        Select game in VOD:
      </label>
      <select
        id="game"
        value={game}
        onChange={handleGameChange}
        className="w-full p-3 m-5 rounded-lg bg-gray-800 text-white shadow-md 
                   focus:ring-2 focus:ring-teal-500 focus:outline-none 
                   hover:bg-gray-700 transition duration-200"
      >
        <option value="">-- Choose game --</option>
        <option value="lol">League of Legends</option>
        <option value="dota2">Dota 2</option>
        <option value="valorant">Valorant</option>
      </select>
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
              
              <div key={vod.vod_id} className="relative">
                <button
                  className="absolute top-1 right-1 bg-red-800 hover:bg-red-500 text-white text-[10px]  rounded-full z-10 shadow-md transition duration-200"
                  onClick={(e) => {
                    e.preventDefault()
                    handleDelete(vod.vod_id)}}
                >
                  X
                </button>
              <Link key={vod.vod_id} to={`/vod/${vod.vod_id}`}>
                 <CommentSection vod={vod} canComment={false}/>
              </Link>
               
              </div>
              
            ))}
      </div> 
    </div>
  );
}

