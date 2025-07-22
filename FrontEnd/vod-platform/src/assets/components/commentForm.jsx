import { useState, useEffect } from "react";
 import { getAuth, onAuthStateChanged } from "firebase/auth";
export default function CommentSection({ vod, canComment, uploaderName, uploaderIMG, variant = "card", }) {
  const [commentText, setCommentText] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [videoRef, setVideoRef] = useState(null);
  const [comments, setComments] = useState([]);
  const [userID, setUserID] = useState(null);
  const [isCoach, setIsCoach] = useState(false);
  useEffect(() => {
    const storedUserID = sessionStorage.getItem("user_id");
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);

  useEffect(() => {
      if (!userID) return;
      fetch(`${import.meta.env.VITE_API_URL}/api/user/${userID}`)
      .then((res) => res.json())
      .then((data) => {
          if (data.role == "coach") {
            setIsCoach(true);
          }
      })
      .catch((err) => {
          console.error("Failed to get data:", err)
      });

  }, [userID]);

  useEffect(() => {
    fetchComments();
  }, [vod.vod_id]);

  const handleTimeUpdate = () => {
    if (videoRef) {
      setCurrentTime(videoRef.currentTime);
    }
  };
  const seekTime = (seconds) => {
    if (videoRef) {
        videoRef.currentTime = seconds;
    }
  }

  const profanityCheck = async (text) => {
    try {
      const res = await fetch('https://vector.profanity.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      const data = await res.json()
      console.log(data);
      return data;
    } catch (err) {
      console.log("Error getting profanity:", err)
      return {isProfanity: false };
    }
  }

  const handleSubmitComment = async () => {
    
    if (!commentText.trim()) return;
    
    const profanity = await profanityCheck(commentText);

    if (profanity.isProfanity) {
      alert('Your comment contains inappropriate language. Please revise and try again.');
      return;
    } 

    try {
      console.log(userID)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vod_comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vod_id: vod.vod_id,
          timestamp_seconds: currentTime,
          comments: commentText,
          created_at: new Date().toISOString(),
          user_id: userID,
        }),
      });

      if (res.ok) {
        setCommentText("");
        fetchComments();
      } else {
        const err = await res.json();
        alert("Error: " + err.message);
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vod_comments/${vod.vod_id}`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(`Error fetching comments for VOD`, err);
    }
  };

  return (
    <div className={`bg-[#1a1a1a] text-white rounded-md p-4 shadow-lg flex flex-col gap-4  ${variant === "page"
      ? "w-fit text-sm align-center"
      : "w-90 text-xs"
    }`}>
      {uploaderName && (
        <div className={` mb-1 text-white font-bold flex items-center gap-2 ${variant === "page"
          ? "text-xl"
          : "text-xs"
        }`}>
          {uploaderIMG && (
            <img
              src={uploaderIMG}
              alt="Uploader"
              className="w-5 h-5 rounded-full object-cover"
            />
          )}
          <span>{uploaderName}</span>
        </div>
      )}
      <div className={` flex justify-center items-center ${variant === "page"  ? " w-full" : ""}`}>
      <video
        controls
        onTimeUpdate={handleTimeUpdate}
        ref={(ref) => setVideoRef(ref)}
        className={` rounded-md  ${variant === "page"
          ? " w-full" 
          :"h-50"
        }`}
      >
        <source src={vod.url} type="video/mp4" />
      </video>
      </div>
      <div className="mt-2 flex flex-col flex-grow">
        <p className="font-semibold mb-1 text-xs">Comments:</p>
        <div className={`space-y-2 ${variant === "page" ? "" : " h-10 max-h-10 overflow-y-auto"}`}>
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <div key={i} className="bg-gray-800 p-1 rounded">
                <div className="flex flex-row items-center justify-center">
                  {c.user_data?.profile_img_url && (
                    <img 
                  src={c.user_data.profile_img_url}
                  className="w-5 h-5 rounded-full object-cover pr-1"
                  />
                  )}
                  {c.user_data?.username && (
                    <p>{c.user_data.username}</p>
                  )}
                  
                </div>
                 <p>{c.comments}</p>
                <p className="text-green-400 cursor-pointer hover:underline" onClick={() => seekTime(c.timestamp_seconds)}>{formatTimestamp(c.timestamp_seconds)} </p>
              </div>
            ))
          ) : (
            <p className="italic text-gray-400">No comments yet</p>
          )}
        </div>

        {canComment && (
          <div className="mt-2">
            <p className="italic text-gray-400 mb-1">At: {formatTimestamp(currentTime)}</p>
            <textarea
              className="w-full p-1 text-xs rounded bg-black border border-gray-600"
              rows={2}
              placeholder="Add comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              className={`mt-1 w-full px-2 py-1 rounded text-xs ${
                isCoach
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-500 opacity-50 cursor-not-allowed"
              }`}
              disabled={!isCoach}
              onClick={handleSubmitComment}
            >
              Submit
            </button>
          </div>
        )}
      </div>
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


