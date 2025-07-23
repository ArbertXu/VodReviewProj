import React from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../assets/components/dashboard";
function Home() {
    const navigate = useNavigate();
    return (
        <>
        <Dashboard/>
          <div className="bg-gray-500 h-px w-full max-w-7xl mx-auto my-2" />
        <div className="min-h-screen flex pt-10 ">
            <div className="text-center space-y-6 text-balance">
                <p className="text-5xl text-white">VOD Reviews Simplified</p>
                <p className="text-lg text-white">Rank up or help others with our all-encompassing Vod review platform. Sign up to become a coach and review other's VODS or become a user yourself and get your VODS reviewed.</p>
                
            </div>
        </div>
        </>
    );
}

export default Home;
