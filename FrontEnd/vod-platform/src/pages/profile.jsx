import Dashboard from "../assets/components/dashboard";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth"
export default function ProfilePage() 
{
    const [userData, setUserData] = useState(null);
    const [userID, setUserID] = useState(null);

  useEffect(() => {
    const storedUserID = sessionStorage.getItem("user_id");
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);
    useEffect(() => {
        if (!userID) return;
        fetch(`http://localhost:3000/api/user/${userID}`)
        .then((res) => res.json())
        .then((data) => {
            setUserData(data)
        })
        .catch((err) => {
            console.error("Failed to get data:", err)
        });

    }, [userID]);
    if(!userData) return <p className="text-white">LOGIN</p>;
    return (
        <>
        <Dashboard/>
        <div className="text-white p-4">
            <h1 className="text-2xl font-bold mb-2">Welcome, {userData.username}</h1>
            <img src={userData.profile_img_url} alt="Profile" className="w-24 h-24 rounded-full" />
            <p>Email: {userData.email}</p>
            <p>Role: {userData.role}</p>
            <p>Joined: {new Date(userData.created_at).toLocaleDateString()}</p>
        </div>
        </>
    )
}

