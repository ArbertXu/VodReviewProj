import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../assets/components/dashboard";
function CoachLogin() {
    const navigate = useNavigate();
    const[formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ...formData,
                    role: "coach",
                })
            })
            const data = await response.json();
            if (response.ok) {
                alert("User registered successfully!")
            } else {
                alert ("ERROR: " + data.error)
            }
        } catch (err) {
            alert ("Request failed: " + err.message)
        }
    }

    return (
        <>
            <Dashboard/>
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-4">
            <h2 className="text-white text-center text-2xl mb-4">Coach Login</h2>
            <form
                onSubmit={handleSubmit}
                className="card shadow-xl p-6 space-y-4 text-white"
            >
                <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered w-full"
                onChange={handleChange}
                />
                <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered w-full"
                onChange={handleChange}
                />
                <button type="submit" className="btn bg-blue-500 hover:bg-blue-700 w-full">
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
    )
}
export default CoachLogin