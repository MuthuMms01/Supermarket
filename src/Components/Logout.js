import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../Css/Logout.css";

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.clear(); 
    sessionStorage.clear();
    const timer = setTimeout(() => {
      navigate("/"); }, 2000);
      return () => clearTimeout(timer);
       }, [navigate]);

  return (
    <motion.div className="logout-container" initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <motion.div className="logout-box"initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}transition={{ duration: 0.7 }}>
        <h2>Logging Out...</h2>
        <p>You will be redirected to the login page shortly.</p>
        <div className="spinner"></div>
      </motion.div>
    </motion.div>
  );
}
