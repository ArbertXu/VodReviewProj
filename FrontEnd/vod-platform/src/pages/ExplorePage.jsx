import { useEffect, useState } from "react";
import Dashboard from "../assets/components/dashboard";
import CommentSection from "../assets/components/commentForm";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom"
export default function explore() {
  const [vods, setVods] = useState([]);
  const [isCoach, setIsCoach] = useState(false);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_URL_API}/api/explore`)
        .then((res) => res.json())
        .then((data) => {
            console.log("Fetched VOD data:", data);
            setVods(data);
        })
        .catch((err) => console.error("Error fetching VODs:", err));
    }, []);
    useEffect(() => {
      const auth = getAuth()
      auth.currentUser?.getIdTokenResult().then((idTokenResult) => {
        setIsCoach(idTokenResult.claims.coach === true);
      }).catch((err) => {
        console.error("Error checking coach status", err)
      })
    }, [])
  return (
    
    <div className="p-4">
        <Dashboard/>
      <h1 className="text-2xl p-5 text-white">Explore VODS</h1>
      <div className="flex flex-wrap gap-4">
                  {vods.map((vod) => (
                     <Link key={vod.vod_id} to={`/vod/${vod.vod_id}`}>
                      <CommentSection
                        key={vod.id}
                        vod={vod}
                        canComment={false}
                        isCoach={isCoach}
                        uploaderName={vod.user_data?.username}
                        uploaderImg={vod.user_data?.profile_img_url}
                      />
                </Link>
            ))}
      </div>
    </div>
  );
}
