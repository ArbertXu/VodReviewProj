import React, { useState } from "react";
import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Dashboard from "../assets/components/dashboard";
import { ToastContainer, toast } from 'react-toastify'; 

export default function ForgotPassword() {
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const handleReset = async (e) => {
        e.preventDefault()
        const auth = getAuth();
        try {
          await sendPasswordResetEmail(auth, email, {
            url: 'https://vod-review-proj.vercel.app/reset-password',
            handleCodeInApp: true,
          });
          setMessage("Password reset email sent! Check your inbox.");
        } catch (error) {
          setMessage("Error:" + error);
        }
      }
    

    return (
        <>
        <Dashboard/>
         <div className="flex justify-center  min-h-screen">
            <div className="w-fit">
                          <form
                            onSubmit={handleReset}
                            className="card shadow-xl p-6 space-y-4 text-white"
                          >
                            <input
                              type="email"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="input input-bordered w-full border-gray-500 focus:bg-gray-800 border p-1"
                            />
                          <button type="submit"
                          className="btn btn-outline btn-sm hover:bg-gray-500 transition duration-200 rounded pl-1 pr-1 text-white">
                            Send Reset Email
                          </button>
                          </form>
                          
                        {message && <p className="text-white">{message}</p>}
                    </div>
                    </div>
                    
        </>
    )
}