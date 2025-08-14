import React, { useState, useEffect } from "react";
import {getAuth, sendPasswordResetEmail, confirmPasswordReset} from "firebase/auth";
import {auth} from "../firebaseAuth";
import { useNavigate, useLocation } from "react-router-dom";
import Dashboard from "../assets/components/dashboard";
import { ToastContainer, toast } from 'react-toastify'; 

export default function ResetPassword() {

    const navigate = useNavigate();
    const location = useLocation();
    const [oobCode, setoobCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect (() => {
        const params = new URLSearchParams(location.search);
        const code = params.get("oobCode");
        if(!code) {
            toast.error("Invalid reset code.", {
                autoClose: 1000,
                onClose: () => navigate("/login/user"),
            })
            return;
        }
        setoobCode(code);
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!newPassword) {
            toast.error("Please enter a password.");
            return;
        }
        setLoading(true);
        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            toast.success("Password has been successfully reset!", {
                autoClose: 1000,
                onClose: () => navigate("/login/user"),
            })
        } catch (error) {
            // console.error("Error resetting password: ", error);
            toast.error("Error resetting password: ", error.message, {
                autoClose: 1000,
                onClose: () => navigate("/login/user"),
            });
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
        <Dashboard/>
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="card shadow-xl p-6 space-y-4 bg-gray-800 text-white w-full max-w-sm"
      >
        <h2 className="text-xl font-bold text-center">Reset Your Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input input-bordered w-full border-gray-500 focus:bg-gray-700 border p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn bg-teal-500 hover:bg-teal-700 w-full transition duration-200"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
    </>
    )
}