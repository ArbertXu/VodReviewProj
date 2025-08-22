import React, { useState } from "react";
import { auth, signInWithEmailAndPassword } from "../firebaseAuth";
import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Dashboard from "../assets/components/dashboard";
import { ToastContainer, toast } from 'react-toastify'; 
function UserLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
    e.preventDefault()
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      console.log("Logging in with", formData.email, formData.password);
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      if(!userCredential.user.emailVerified) {
        toast.error("Please verify your email before logging in. Check your spam folder if you cannot find the email.");
        await auth.signOut();
        return;
      }
      const token = await userCredential.user.getIdToken(); 

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/protected`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      // alert("Login successful!");
      toast.success("Logged in Successfully!", {
        autoClose: 500,
        onClose: () => navigate("/"),
      });
      console.log("Protected response:", data);
      // navigate("/");
    } else {
      alert("Failed to access protected route: " + data.error);
    }

    } catch (err) {
      setError("Login error. Incorrect password or email.")
    }
  };

  const handleReset = async (e) => {
    e.preventDefault()
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (error) {
      setMessage("Error:" + error);
    }
  }

  return (
    <>
    <Dashboard/>
     <div className="flex justify-center min-h-screen">
            <div className="w-full max-w-md p-4">
            <h2 className="text-white text-center text-2xl mb-4 pt-20">User Login</h2>
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
                <button type="submit"  className="btn bg-teal-500 hover:bg-teal-700 w-full transition duration-200">
                Login
                </button>
                <div className="flex justify-evenly text-sm pt-2">
                    <span className="text-gray-400">Don't have an account?</span>
                    <div className="flex">
                    <button
                        type="button"
                        className="btn btn-outline btn-sm hover:bg-gray-500 transition duration-200 rounded pl-1 pr-1"
                        onClick={() => navigate("/registration/user")}
                    >
                        Sign Up
                    </button>
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
             <div>
                        
                          <button
                            className="btn btn-outline btn-sm hover:bg-gray-500 transition duration-200 rounded pl-1 pr-1 text-white"
                            onClick={() => navigate("/forgot-password")}  
                          >
                            Forgot Password?
                          </button>
                    </div>
            </div>
        </div>
        </>
        );
}

export default UserLogin;
