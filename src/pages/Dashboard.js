import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css"; // Import the new CSS file
 
const Dashboard = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!collapsed) {
      const timeout = setTimeout(() => {
        setCollapsed(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, []);
 
  const navigateToRoot = () => {
    navigate("/");
  };
 
  return (
<div className="dashboard-wrapper">
<Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onLogout={onLogout} />
 
      <main className="dashboard-main">
        {/* Welcome Section */}
<motion.div
          className="welcome-section"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
>
<motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
>
            Welcome to Your Dashboard, Traveler! 🛫
</motion.h1>
 
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
>
            Ready to explore the skies? Your next adventure is just a click away.
</motion.p>
 
          {/* Button to navigate to root path */}
<motion.button
            className="navigate-button" // Added class for styling
            onClick={navigateToRoot}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
>
            🏠 Go to Homepage
</motion.button>
</motion.div>
</main>
</div>
  );
};
 
export default Dashboard;