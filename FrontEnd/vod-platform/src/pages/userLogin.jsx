import React, { useState } from "react";
import { auth, signInWithEmailAndPassword } from "../firebaseAuth";

function UserLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const token = await userCredential.user.getIdToken();

    const response = await fetch("http://localhost:3000/api/protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful and protected route accessed!");
      console.log("Protected response:", data);
    } else {
      alert("Failed to access protected route: " + data.error);
    }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
      {error && <p style={{color:"red"}}>{error}</p>}
    </form>
  );
}

export default UserLogin;
