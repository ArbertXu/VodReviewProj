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
    const [selectedGame, setSelectedGame] = useState("");
    const [accountID, setaccountID] = useState("");
    const [tagLine, setTagLine] = useState("");
    const [riotID, setriotID] = useState("");
    const [message, setMessage] = useState("");
    const handleGameChange = (e) => {
        setSelectedGame(e.target.value);
    }
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

    const checkRank = async () => {
        try {
            const body = { game: selectedGame };
            console.log(selectedGame);
            const token = await user.getIdToken();
            if(selectedGame === "lol" || selectedGame === "valorant") {
                body.riotID = riotID;
                body.tagLine = tagLine;
            } else if (selectedGame === "dota2") {
                body.account = accountID;
            }
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/apply-coach`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                     },
                    body: JSON.stringify(body)
                });
            const data = await res.json();
            if(res.ok) {
                setMessage(`Success! Rank: ${data.rank}, Eligible: ${data.eligible}`);
            } else {
                setMessage(`Error: ${data.error}`)
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage("Error", err);
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
<div className="flex justify-center items-start min-h-screen py-12">
  <div className="p-8 rounded-xl shadow-xl w-full max-w-lg ">
    <h2 className="text-3xl font-bold text-white mb-8 text-center">
      User Settings
    </h2>

    
    <div className="mb-6 space-y-1 text-gray-300">
      <p className="font-medium text-white">Upload Rank to be eligible to coach</p>
      <p className="text-sm">Ranks to be eligible:</p>
      <ul className="list-disc list-inside ml-4 text-sm">
        <li>Valorant: Diamond</li>
        <li>League of Legends: Diamond</li>
        <li>Dota 2: Ancient</li>
      </ul>
    </div>

    
    <div className="mb-6">
      <label htmlFor="game" className="block mb-2 text-lg font-semibold text-white">
        Select a game:
      </label>
      <select
        id="game"
        value={selectedGame}
        onChange={handleGameChange}
        className="w-full p-3 rounded-lg bg-gray-700 text-white shadow-md 
                   focus:ring-2 focus:ring-teal-500 focus:outline-none 
                   hover:bg-gray-600 transition duration-200"
      >
        <option value="">-- Choose a game --</option>
        <option value="lol">League of Legends</option>
        <option value="dota2">Dota 2</option>
        <option value="valorant">Valorant</option>
      </select>
    </div>

    
    {selectedGame === "lol" && (
      <div className="mb-6 space-y-4 text-white">
        <div>
          <label className="block font-medium mb-1">Riot ID:</label>
          <input
            type="text"
            className="border rounded p-2 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter Riot ID"
            onChange={(e) => setriotID(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Tagline:</label>
          <input
            type="text"
            className="border rounded p-2 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter tagline"
            onChange={(e) => setTagLine(e.target.value)}
          />
        </div>
      </div>
    )}

    {selectedGame === "dota2" && (
      <div className="mb-6 text-white">
        <label className="block font-medium mb-1">Account ID:</label>
        <input
          type="text"
          className="border rounded p-2 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Last 8 numbers in Dotabuff / friend code in game"
          onChange={(e) => setaccountID(e.target.value)}
        />
      </div>
    )}

    {selectedGame === "valorant" && (
      <div className="mb-6 space-y-4 text-white">
        <div>
          <label className="block font-medium mb-1">Riot ID:</label>
          <input
            type="text"
            className="border rounded p-2 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter Riot ID"
            onChange={(e) => setriotID(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Tagline:</label>
          <input
            type="text"
            className="border rounded p-2 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter tagline"
            onChange={(e) => setTagLine(e.target.value)}
          />
        </div>
      </div>
    )}

    
    <button
      className="w-full bg-teal-600 hover:bg-teal-700 transition duration-200 py-3 rounded-lg text-white font-semibold shadow"
      onClick={checkRank}
    >
      Save Changes
    </button>

    
    {message && (
      <p className="mt-4 text-center text-white font-medium">{message}</p>
    )}
  </div>
</div>


  </>
);

}