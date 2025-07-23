import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../assets/components/dashboard";
function UserRegistration() {
    const navigate = useNavigate();
    const[formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "user",
    });
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const handleSubmit = async (e) => {
        console.log("Submitting form:", formData);
        e.preventDefault();
        try {
            console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            })
            const data = await response.json();
            if (response.ok) {
                alert("User registered successfully!")
                navigate("/")
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
        <div className="flex justify-center min-h-screen">
            <div className="w-full max-w-md p-4">
            <h2 className="text-white text-center text-2xl mb-4 pt-20">User Registration</h2>
            <form
                onSubmit={handleSubmit}
                className="card shadow-xl p-6 space-y-4 text-white"
            >
                <input
                type="text"
                name="username"
                placeholder="Username"
                className="input input-bordered w-full border-gray-500 focus:bg-gray-800 border p-1"
                onChange={handleChange}
                />
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
                <input
                type="checkbox"
                id="coachCheckbox"
                checked={formData.role == "coach"}
                className="flex-row"
                onChange={(e) => setFormData({
                    ...formData, 
                    role: e.target.checked ? "coach" : "user",
                })
                }
                />
                <label htmlFor="coachCheckbox" className="p-1">
                    Register as Coach
                </label>
                <button type="submit" className="btn bg-blue-500 hover:bg-blue-700 w-full">
                Register
                </button>
                <div className="flex flex-wrap items-center justify-evenly gap-2 text-sm pt-2">
                    <span className="text-gray-400">Already have an account?</span>
                    <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => navigate("/login/coach")}
                        className="btn btn-outline btn-sm hover:bg-gray-600"
                    >
                        Login as Coach
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/login/user")}
                        className="btn btn-outline btn-sm hover:bg-gray-600"
                    >
                        Login as User
                    </button>
                    </div>
                </div>
            </form>
            </div>
        </div>
        </>
        );

}
export default UserRegistration