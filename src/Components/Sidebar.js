import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../Css/Sidebar.css";
import Logo from "../Css/log.png";

class Sidebar extends Component {
render() {
  const { isOpen, toggle } = this.props;
 return (
  <div className={`sidebar ${isOpen ? "open" : ""}`}>
    <div className="sidebar-header">
      <img src={Logo} alt="Logo" className="sidebar-logo" style={{ width: 150, height: "auto" }}/>       
    </div>
      <ul className="sidebar-menu">
       <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>📊 Dashboard</NavLink></li>
       <li><NavLink to="/staffcreate" className={({ isActive }) => isActive ? "active" : ""}>🧑‍💼 StaffCreate</NavLink></li>
       <li><NavLink to="/staffupdate" className={({ isActive }) => isActive ? "active" : ""}>🧑‍💼 StaffUpdate</NavLink></li>
       <li><NavLink to="/product" className={({ isActive }) => isActive ? "active" : ""}>📤 Products</NavLink></li>
       <li><NavLink to="/stock" className={({ isActive }) => isActive ? "active" : ""}>🏷️ Stock</NavLink></li>
       <li><NavLink to="/sale" className={({ isActive }) => isActive ? "active" : ""}>🛒 Billing</NavLink></li>
       <li><NavLink to="/saledetails" className={({ isActive }) => isActive ? "active" : ""}>📋 SaleDetails</NavLink></li>
       <li><NavLink to="/logout" className={({ isActive }) => isActive ? "active" : ""}>⚙️ Logout</NavLink></li>
    
        </ul>
      </div>
    );
  }
}

export default Sidebar;
