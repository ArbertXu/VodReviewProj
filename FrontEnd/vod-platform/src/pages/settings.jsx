import Dashboard from "../assets/components/dashboard";
import {useState, useEffect} from 'react';
import {toast} from 'react-toastify';
import {auth} from "/src/firebaseAuth.js";
import { useNavigate } from "react-router-dom";
export default function Settings() 
{
    const navigate = useNavigate();
    const [role, setRole] = useState('user');
    const [userData, setUserData] = useState(null);
    const [userID, setUserID] = useState(null);
    const [user, setUser] = useState(null);
    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        setUser(firebaseUser);
    });
    return () => unsubscribe();
    }, []);

    useEffect(() => {
        const storedUserID = sessionStorage.getItem("user_id");
        if (storedUserID) {
          setUserID(storedUserID);
        }
    }, []);   
    useEffect(() => {
    if (!userID) return;
    const fetchUserRole = async () => {
        try {
            if(!user){
                console.log("No user")
                return;
            }
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
            setRole(data.role);
        } catch (err) {
        console.error("Failed to get data:", err);
        }
    };

    fetchUserRole();
    }, [user]);



    const handleSave = async () => {
        try {
            const token = await user.getIdToken();
            const res = await fetch
            
            (`${import.meta.env.VITE_API_URL}/api/user/role`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                     },
                    body: JSON.stringify({ role })
                });
                if (res.ok) {
                    toast.success("Role updated!", {
                        autoClose: 500,
                        onClose: () => navigate("/"),
                    });
                } else {
                    toast.error("Failed to update role");
                }
        } catch (err) {
            console.error(err);
            toast.error("Error while upadting Role")
        }
    }

    if(!userID) return (
            <>
            <Dashboard/>
            <p className="text-white">LOGIN</p>
            </>
            );
    return (
  <>
    <Dashboard />
    <div className="flex justify-center  min-h-screen">
      <div className="p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          User Settings
        </h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={role === "coach"}
            onChange={(e) => setRole(e.target.checked ? "coach" : "user")}
            className="w-5 h-5 accent-teal-500 cursor-pointer"
          />
          <span className="text-white text-lg">Coach Role</span>
        </label>

        <p className="text-gray-400 text-sm mt-2">
          Toggle this on if you want to switch to a coach account.
        </p>

        <button
          className="bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-700 
                     transition duration-200 mt-6 w-full text-white font-medium shadow"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  </>
);

}