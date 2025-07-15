import { useState, useEffect } from "react";

export default function CommentSection({ vod, canComment = true, isCoach = false, uploaderName, uploaderIMG, variant = "card", }) {
  const [commentText, setCommentText] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [videoRef, setVideoRef] = useState(null);
  const [comments, setComments] = useState([]);

  

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

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await fetch("http://localhost:3000/api/vod_comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vod_id: vod.vod_id,
          timestamp_seconds: currentTime,
          comments: commentText,
          created_at: new Date().toISOString(),
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
      const res = await fetch(`http://localhost:3000/api/vod_comments/${vod.vod_id}`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(`Error fetching comments for VOD`, err);
    }
  };

  return (
    <div className={`bg-[#1a1a1a] text-white rounded-md p-2 shadow-md flex flex-col  ${variant === "page"
      ? "w-fit text-xl align-center"
      : "w-90 text-xs"
    }`}>
      {uploaderName && (
        <div className={` mb-1 text-gray-400 flex items-center gap-2 ${variant === "page"
          ? "text-xl"
          : "text-xs"
        }`}>
          {uploaderIMG && (
            <img
              src={uploaderImg}
              alt="Uploader"
              className="w-5 h-5 rounded-full object-cover"
            />
          )}
          <span>Uploaded by: {uploaderName}</span>
        </div>
      )}
      <div className={`${variant === "page"  ? "flex justify-center w-full" : ""}`}>
      <video
        controls
        onTimeUpdate={handleTimeUpdate}
        ref={(ref) => setVideoRef(ref)}
        className={` rounded-md ${variant === "page"
          ? "max-w-xl w-full"
          :""
        }`}
      >
        <source src={vod.url} type="video/mp4" />
      </video>
      </div>
      <div className="mt-2 flex flex-col flex-grow">
        <p className="font-semibold mb-1 text-xs">Comments:</p>
        <div className={`space-y-1 pr-1 ${variant === "page" ? "" : "max-h-10 overflow-y-auto"}`}>
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <div key={i} className="bg-gray-800 p-1 rounded">
                <p className="text-green-400 cursor-pointer hover:underline" onClick={() => seekTime(c.timestamp_seconds)}>{formatTimestamp(c.timestamp_seconds)} </p>
                <p>{c.comments}</p>
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


