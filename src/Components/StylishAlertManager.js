import React, { Component } from "react";
import "../Css/AlertBox.css";

class StylishAlertManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      message: "",
      type: "success", // success, error, warning
    };

    this.icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
    };
  }

  // Call this to show the alert
  showAlert = (message, type = "success") => {
    this.setState({ show: true, message, type });

    // Auto-hide after 3 seconds
    setTimeout(() => this.setState({ show: false }), 3000);
  };

  closeAlert = () => {
    this.setState({ show: false });
  };

  render() {
    const { show, message, type } = this.state;

    if (!show) return null; // Don't render anything if not showing

    return (
      <div className="centered-alert-overlay">
        <div className={`centered-alert-box ${type}`}>
          <span className="icon">{this.icons[type]}</span>
          <span className="message">{message}</span>
          <button className="close-btn" onClick={this.closeAlert}>
            &times;
          </button>
        </div>
      </div>
    );
  }
}

export default StylishAlertManager;
