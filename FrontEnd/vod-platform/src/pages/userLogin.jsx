import React, { useState } from "react";
import { auth, signInWithEmailAndPassword } from "../firebaseAuth";
import { useNavigate } from "react-router-dom";
import Dashboard from "../assets/components/dashboard";
function UserLogin() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
    e.preventDefault()
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const token = await userCredential.user.getIdToken();

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/protected`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful and protected route accessed!");
      console.log("Protected response:", data);
      // const uid = userCredential.user.uid;
      // sessionStorage.setItem("user_id", uid);

    } else {
      alert("Failed to access protected route: " + data.error);
    }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
    <Dashboard/>
     <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-4">
            <h2 className="text-white text-center text-2xl mb-4">User Login</h2>
            <form
                onSubmit={handleSubmit}
                className="card shadow-xl p-6 space-y-4 text-white"
            >
                <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered w-full border-gray-500 focus:bg-gray-800 border p-1"
                onChange={handleChange}
                />
                <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered w-full border-gray-500 focus:bg-gray-800 border p-1"
                onChange={handleChange}
                />
                <button type="submit" onClick={() => navigate("/")} className="btn bg-blue-500 hover:bg-blue-700 w-full">
                Login
                </button>
                <div className="flex justify-evenly text-sm pt-2">
                    <span className="text-gray-400">Don't have an account?</span>
                    <div className="flex">
                    <button
                        type="button"
                        onClick={() => navigate("/registration/user")}
                        className="btn btn-outline btn-sm hover:bg-gray-500"
                    >
                        Sign Up
                    </button>
                    </div>
                </div>
            </form>
            </div>
        </div>
        </>
        );
}

export default UserLogin;
