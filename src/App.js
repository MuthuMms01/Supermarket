import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import AnimatedRoutes from "./AnimatedRoutes";
import "./App.css";

class App extends Component {
  state = { sidebarOpen: false };
  // Open sidebar when mouse enters left area
  handleMouseEnter = () => {
    this.setState({ sidebarOpen: true });
  };
  // Close sidebar when mouse leaves sidebar
  handleMouseLeave = () => {
    this.setState({ sidebarOpen: false });
  };
  render() {
    return (
      <Router>
        <div onMouseEnter={this.handleMouseEnter}onMouseLeave={this.handleMouseLeave}>
          <Sidebar isOpen={this.state.sidebarOpen} />
        </div>
        <div className="page12">
          <AnimatedRoutes />
        </div>
      </Router>
    );
  }
}

export default App;
