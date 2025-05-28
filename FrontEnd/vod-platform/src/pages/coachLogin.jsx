import React, { useState } from "react";
function CoachLogin() {
    const[formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefualt();
        try {
            const response = await fetch("http://localhost:3000/api/register", {
                method: POST,
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
        <div>
            <h2>
                User Login
            </h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="name"
                    name="username"
                    placeholder="username"
                    onChange={handleChange}
                    />
                <input
                    type="email"
                    name="email"
                    placeholder="email"
                    onChange={handleChange}
                    />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={handleChange}
                    />
                <button type="Submit">Login as Coach</button>
            </form>
        </div>
    )
}
export default CoachLogin