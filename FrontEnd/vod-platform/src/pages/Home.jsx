import React from "react";
import "../assets/styles/Home.css"
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Hello!</h1>
            <p>Welcome to our vod review platform</p>
            <button onClick={() => navigate("/login/user")}>Login as User</button>
            <button onClick={() => navigate("/login/coach")}>Login as Coach</button>
        </div>
           
    )
}
export default Home;