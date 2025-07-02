import { useState, useEffect } from "react";

export default function CommentSection({ vod }) {
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
        alert("Comment submitted!");
        setCommentText("");
      } else {
        const err = await res.json();
        alert("Error: " + err.message);
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
    await fetchComments();
  };
    const fetchComments = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/vod_comments/${vod.vod_id}`)
                const data = await res.json()
                setComments(data);
            } catch (err) {
                console.error(`Error fetching comments for VOD`, err)
            }
        }; 
  

  return (
    <div className="text-white mt-4">
      <video
        controls
        width="600"
        onTimeUpdate={handleTimeUpdate}
        ref={(ref) => setVideoRef(ref)}
        className="inline"
      >
    <source src={vod.url} type="video/mp4" />
      </video>
        <div className="text-white">
            <h3 className="font-bold mb-2">Comments:</h3>
            {comments.length > 0 ? (
              <ul className="space-y-2">
                {comments.map((c, index) => (
                  <li key={index} className="bg-gray-800 p-2 rounded">
                    <strong>{formatTimestamp(c.timestamp_seconds)}</strong>: {c.comments}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic">No comments yet</p>
            )}
          </div>
      <div className="mt-2">
        <p className="mb-1 italic">Timestamp: {formatTimestamp(currentTime)}</p>
        <textarea
          className="w-full p-2 text-black"
          placeholder="Add your comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          className="mt-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          onClick={handleSubmitComment}
        >
          Submit Comment
        </button>
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
