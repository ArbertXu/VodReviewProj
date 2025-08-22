import { useState, useEffect, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {auth} from "/src/firebaseAuth.js";
export default function CommentSection({ vod, canComment, uploaderName, uploaderIMG, variant = "card", }) {
  const [commentText, setCommentText] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [videoRef, setVideoRef] = useState(null);
  const [comments, setComments] = useState([]);
  const [userID, setUserID] = useState(null);
  const [isCoach, setIsCoach] = useState(false);
  const [user, setUser] = useState(null);
  const [showAddComment, setShowAddComment] = useState(false);
  const [coachablegames, setcoachablegames] = useState([]);
  const game = vod.Game;
    useEffect(() => {
      const storedUserID = sessionStorage.getItem("user_id");
      if (storedUserID) {
        setUserID(storedUserID);
      }
    }, []);


  useEffect(() => {
          const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
              setUser(firebaseUser);
          })
          return () => unsubscribe();
      }, []);

  useEffect(() => {
      if (!userID || !user) return;
      const fetchUserRole = async () => {
          try {
              const token = await user.getIdToken();
              const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
                  headers: {
                      "Authorization": `Bearer ${token}`,
                  },
              });
              if (!res.ok) {
                  throw new Error(`HTTP error ${res.status}`);
              }
              const data = await res.json();
              if (data.role === "coach") {
                  setIsCoach(true);
              }
              if (data.is_lol_coach) {
                setcoachablegames(prev => [...prev, "lol"])
              }
              if (data.is_val_coach) {
                setcoachablegames(prev => [...prev, "valorant"])
              }
              if (data.is_dota2_coach) {
                setcoachablegames(prev => [...prev, "dota2"])
              }

          } catch (err) {
              console.error("Failed to get data:", err);
          }
      };
      fetchUserRole();
  }, [userID, user]);


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

  const fetchComments = useCallback(async () => {
    if (!userID || !user) return;
    try {
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vod_comments/${vod.vod_id}`);
      const data = await res.json();
      const token = await user.getIdToken();
      const likeResult = await fetch(`${import.meta.env.VITE_API_URL}/api/user_comment_likes`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })
      const likedComments = await likeResult.json();
      const combined = data.map(c => ({
        ...c,
        liked: likedComments.includes(c.id),
      }));
      setComments(combined);
    } catch (err) {
      console.error(`Error fetching comments for VOD`, err);
    }
  }, [vod.vod_id, user]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);


  const handleLike = useCallback(async (comment_id) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/commentAdd/${comment_id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if(res.ok) {
        const data = await res.json();
        console.log("data: ", data);
        setComments(prevComments =>
          prevComments.map(c =>
            c.id === comment_id ? { ...c, likeCount: data.likeCount, liked: !c.liked } : c
          )
        );
      } else {
        const err = await res.json();
        console.error("Error liking comment:, ", err.message);
      }
    } catch (error) {
        console.error("Failed to like comment: ", error);
      }
  }, [user, userID, fetchComments ]);

  const handleSubmitComment = useCallback(async () => {
  if (!commentText.trim()) return;
  
  console.log('Current commentText:', `"${commentText}"`);
  
  const profanity = await profanityCheck(commentText.trim());

  if (profanity.isProfanity) {
    alert('Your comment contains inappropriate language. Please revise and try again.');
    return;
  } 

    try {
      console.log(userID)
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vod_comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
         },
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
  }, [commentText, currentTime, vod.vod_id, userID, user, fetchComments]);


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
        controlsList="nodownload"
        onTimeUpdate={handleTimeUpdate}
        ref={(ref) => setVideoRef(ref)}
        className={` rounded-md border border-gray-700 shadow-md  ${variant === "page"
          ? " w-full" 
          :"h-50"
        }`}
      >
        <source src={vod.url} type="video/mp4" />
      </video>
      </div>
      <div className="mt-2 flex flex-col flex-grow">
        <p className="font-semibold mb-1 text-xs">Comments:</p>
        {showAddComment && canComment && coachablegames.includes(game) && (
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
              className={`mt-1 w-full px-2 py-1 rounded text-xs transition duration-200 mb-5 ${
                isCoach
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-gray-500 opacity-50 cursor-not-allowed"
              }`}
              disabled={!isCoach}
              onClick={handleSubmitComment}
            >
              Submit
            </button>
          </div>
        )}
        <button className={`mb-2 px-2 py-1 w-50  text-white text-xs mx-auto rounded transitionduration-200 ${showAddComment ? "bg-red-600 hover:bg-red-700" : "rounded bg-teal-600 hover:bg-teal-700"}
        ${coachablegames.includes(game)? "": "cursor-not-allowed bg-gray-500 opacity-50"}`
        }
        disabled={!coachablegames.includes(game)}
        onClick={() => setShowAddComment(!showAddComment)}>
           {coachablegames.includes(game) ? showAddComment ? "Cancel" : "add comment" : "Rank not high enough to coach. Update rank in settings."}
        </button>
        <div className={`space-y-2 ${variant === "page" ? "" : " h-15 max-h-15 overflow-y-auto"}`}>
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <div key={c.id} className="bg-gray-800 p-1 rounded w-full">
                <div className="flex flex-row items-center justify-center">
                  {c.user_data?.profile_img_url && (
                    <img 
                  src={c.user_data.profile_img_url}
                  className=" size-5 rounded-full object-cover mr-1 mb-1"
                  />
                  )}
                  {c.user_data?.username && (
                    <p>{c.user_data.username}</p>
                  )}
                  
                </div>
                 <p className="mb-1">{c.comments}</p>
                <p className="text-green-400 cursor-pointer hover:underline mb-1" onClick={() => seekTime(c.timestamp_seconds)}>{formatTimestamp(c.timestamp_seconds)} </p>
                <div className="flex justify-center items-center mb-1">
                    <button onClick= {() => handleLike(c.id)}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={c.liked ? "red" : "white"}
                        className="transition-colors duration-300 ease-in-out"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      </button> 
                    <p className="text-xs p-1">{c.likeCount}</p>
                  </div>
              </div>
            ))
          ) : (
            <p className="italic text-gray-400">No comments yet</p>
          )}
        </div>

        
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