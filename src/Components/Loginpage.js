import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../Css/Login.css";

export default function Login() {
  const [staffid, setstaffid] = useState("");  
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!staffid || !password)
     {
      setError("Please fill in all required fields");
      return;
     }
    try 
    {
      const response = await fetch("https://localhost:7234/api/staff/login", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ staffid, password}),
      });
      const data = await response.json();
      if (response.ok) { navigate("/sidebar");} 
      else {setError(data.message || "Invalid staffid or password");}
    } catch (err) 
      { setError("Unable to connect to server");}
  };

  return (
    <div className="login-container">
      <motion.div className="login-box"initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}transition={{ duration: 0.7 }}>
        <h2>Login Page</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input type="text"placeholder="staffid"value={staffid} 
          onChange={(e) => setstaffid(e.target.value)}/>
        <input type="password" placeholder="Password"value={password}
          onChange={(e) => setPassword(e.target.value)}/>
        <button onClick={handleLogin}>Login</button>
      </motion.div>
    </div>
  );
}
