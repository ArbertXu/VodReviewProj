import Dashboard from "../assets/components/dashboard";
import { useEffect, useState, useRef } from "react";
import { getAuth } from "firebase/auth"
export default function ProfilePage() 
{
    const [userData, setUserData] = useState(null);
    const [userID, setUserID] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null); 

  useEffect(() => {
    const storedUserID = sessionStorage.getItem("user_id");
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);   
    useEffect(() => {
        if (!userID) return;
        fetch(`${import.meta.env.VITE_API_URL}/api/user/${userID}`)
        .then((res) => res.json())
        .then((data) => {
            setUserData(data)
        })
        .catch((err) => {
            console.error("Failed to get data:", err)
        });

    }, [userID]);

    const handleImageUpload = async () => {
        if(!selectedImage || !userID) return;

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
        <Dashboard/>
        <div className="text-white p-4 flex-col justify-center">
            <h1 className="text-2xl font-bold mb-2">Hi, {userData.username}</h1>
            <img src={userData.profile_img_url} alt="Profile" className="w-24 h-24 inline rounded-full" />
            <p>Role: {userData.role}</p>
            <p>Joined: {new Date(userData.created_at).toLocaleDateString()}</p>
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => setSelectedImage(e.target.files[0])}
            />
            <div className="space-y-2 mt-4 flex flex-col items-center justify-center ">
                <button
                    type="button"
                    onClick={triggerFileInput}
                    className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800"
                >
                    {selectedImage ? `Selected: ${selectedImage.name}` : "Change Profile Picture"}
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
        </div>
        </>
    )
}

