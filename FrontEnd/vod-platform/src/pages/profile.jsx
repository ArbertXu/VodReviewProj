import Dashboard from "../assets/components/dashboard";
import { useEffect, useState, useRef } from "react";
import { getAuth } from "firebase/auth";
import {auth} from "/src/firebaseAuth.js";
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";
export default function ProfilePage() 
{   
    const [user, setUser] = useState(null);
    const [preview, setPreview] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userID, setUserID] = useState(null);
    const [userName, setUserName] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null); 
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            setUser(firebaseUser);
        })
        return () => unsubscribe();
    }, []);
    

    useEffect(() => {
        if(!selectedImage) {
            setPreview(null);
            return;
        }
        const objectURL = URL.createObjectURL(selectedImage);
        setPreview(objectURL);

        return () => URL.revokeObjectURL(objectURL);
    }, [selectedImage])

    useEffect(() => {
        const storedUserID = sessionStorage.getItem("user_id");
        if (storedUserID) {
        setUserID(storedUserID);
        }
    }, []);   
  
    useEffect(() => {
    if (!userID) return;
    if(!user) {
        setUserData(null);
        console.log("NotUser")
        return;
    }
    const fetchUserData = async () => {
        try {
            console.log(user);
            if (!user) return;
            console.log("User here")
            const token = await user.getIdToken();

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
                headers: {
                "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch user data");
            }
            const data = await res.json();
            console.log(data);
            setUserData(data);
        } catch (err) {
        console.error("Failed to get data:", err);
        }
    };

    fetchUserData();
    }, [user, userID]);


    const changeUsername = async (e) => {
        if(!userID) return;
        e.preventDefault();
        const token = await user.getIdToken();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/username`, {
                method: "PUT",
                headers: {"Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    newUserName: userName,
                })
            });
            if (res.ok) {
                    toast.success("Username Updated", {
                        autoClose: 500,
                        onClose: () => navigate("/"),
                    });
                } else {
                    const errorData = await res.json();
                    toast.error("Failed to update username", errorData);
                }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update username", error);
        }
    }

    const handleImageUpload = async () => {
        if(!selectedImage || !userID) return;
        
        const token = await user.getIdToken();
        console.log(token);
        const fileType = selectedImage.type;
        const fileName = selectedImage.name;

        try {
             const res = await fetch(`${import.meta.env.VITE_API_URL}/api/get-upload-url`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({fileName, fileType}),
            })
            const {uploadURL, fileKey} = await res.json();

            const s3Res = await fetch(uploadURL, {
                method: "PUT",
                headers: { "Content-Type": fileType },
                body: selectedImage,
            })
            if (!s3Res.ok) throw new Error("Upload to S3 failed");
            const publicURL = `https://${import.meta.env.VITE_S3_BUCKET}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileKey}`;

            const updateRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile-image`, {
                method: "POST",
                headers: {"Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ profile_img_url: publicURL}),
            })
            const updatedUser = await updateRes.json();
            setUserData(updatedUser)
            setSelectedImage(null)
            fileInputRef.current.value = null
            } catch (err) {
                console.error("Error uploading image:", err);
            }
        }

        const triggerFileInput = () => {
            fileInputRef.current?.click();
        };

    
    if(!userData) return (
        <>
        <Dashboard/>
        <p className="text-white">LOGIN</p>
        </>
        );
    return (
        <>
            <Dashboard />

            <div className="text-white p-6 space-y-8 max-w-2xl mx-auto">
            <div className="bg-gray-900 p-6 rounded-2xl shadow-lg flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-2">Hi, {userData.username}</h1>
                <img
                src={preview || userData.profile_img_url}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-3 border-2 border-gray-700"
                />
                <p className="text-gray-300">Role: {userData.role}</p>
                <p className="text-gray-400">
                Joined: {new Date(userData.created_at).toLocaleDateString()}
                </p>
            </div>

            
            <div className="bg-gray-900 p-6 rounded-2xl shadow-lg flex flex-col items-center space-y-3">
                <h2 className="text-xl font-semibold">Change Profile Picture</h2>
                <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => setSelectedImage(e.target.files[0])}
                />

                <button
                type="button"
                onClick={triggerFileInput}
                className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800"
                >
                {selectedImage
                    ? `Selected: ${selectedImage.name}`
                    : "Choose Profile Picture"}
                </button>

                {selectedImage && (
                <button
                    type="button"
                    onClick={handleImageUpload}
                    className="bg-teal-600 px-4 py-2 rounded hover:bg-teal-700 transition duration-200"
                >
                    Submit New Picture
                </button>
                )}
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl shadow-lg flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4">Change Username</h2>
                <form
                onSubmit={changeUsername}
                className="flex flex-col w-full items-center space-y-4"
                >
                <input
                    className="w-full placeholder:text-center input input-bordered border-gray-600 focus:bg-gray-800 rounded px-3 py-2"
                    type="text"
                    placeholder="Enter new username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
                <button
                    className="bg-teal-600 px-4 py-2 rounded hover:bg-teal-700 transition duration-200"
                    type="submit"
                >
                    Update Username
                </button>
                </form>
            </div>
            </div>
        </>
        );
}

