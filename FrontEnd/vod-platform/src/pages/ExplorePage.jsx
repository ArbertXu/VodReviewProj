import { useEffect, useState } from "react";
import Dashboard from "../assets/components/dashboard";
import CommentSection from "../assets/components/commentForm";

import { Link } from "react-router-dom"
export default function explore() {
  const [vods, setVods] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/explore`)
        .then((res) => res.json())
        .then((data) => {
            console.log("Fetched VOD data:", data);
            setVods(data);
        })
        .catch((err) => console.error("Error fetching VODs:", err));
    }, []);

  return (
    
    <div className="p-4">
        <Dashboard/>
      <h1 className="text-2xl p-5 text-white">Explore VODS</h1>
      <div className="flex flex-wrap gap-4">
                  { vods.map((vod) => (
                     <Link key={vod.vod_id} to={`/vod/${vod.vod_id}`}>
                      <CommentSection
                        key={vod.id}
                        vod={vod}
                        canComment={false}
                        uploaderName={vod.user_data?.username}
                        uploaderImg={vod.user_data?.profile_img_url}
                      />
                </Link>
            ))}
      </div>
    </div>
  );
}
