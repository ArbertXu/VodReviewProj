import Dashboard from "../assets/components/dashboard";
import CommentSection from "../assets/components/commentForm";
import {useParams} from "react-router-dom";
import { useEffect, useState } from "react";

export default function VodPost() {
    const {vod_id} = useParams();
    const [Vod, setVod] = useState(null);
    const [game, setGame] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/vods/id/${vod_id}`)
        .then((res) => res.json())
        .then((data) => setVod(data))
        .catch((err) => console.error("Failed to get vod:", err))
    }, [vod_id])

   
    if (!Vod) return <p className="text-white">Loading VOD...</p>;
    return (
        <>
        <Dashboard/>
        <div className="flex justify-center">
            <CommentSection vod={Vod} canComment={true} isCoach={true} variant="page"/>
        </div>
        </>
        
    )
}
