import React, { useState } from "react";
function UserLogin() {
    const[formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }


    return (
        <div>
            <h2>
                User Login
            </h2>
            <form>
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
                <button type="Submit">Login as User</button>
            </form>
        </div>
    )
}
export default UserLogin