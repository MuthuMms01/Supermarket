import React, { Component } from "react";

class Header extends Component {
  state = { menuOpen: false };

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  closeMenu = () => {
    this.setState({ menuOpen: false });
  };

  render() {
    const { user, onLogout } = this.props;
    const { menuOpen } = this.state;

    return (
      <div style={styles.header}>
        
        {/* Avatar + Username */}
       <div style={styles.userSection} onClick={this.toggleMenu}>
  <img
    src={
      user?.imagepath
        ? `http://localhost:1514${user.imagepath}`
        : "https://i.pravatar.cc/40?u=" + user?.staffid
    }
    alt="user"
    style={styles.avatar}
  />
  <span style={styles.username}>{user?.staffname || "Loading..."}</span>
</div>
        {/* Dropdown */}
        {menuOpen && (
          <div style={styles.dropdown} onMouseLeave={this.closeMenu}>
            <div style={styles.dropdownHeader}>WELCOME!</div>

            <div style={styles.menuItem}>👤 My profile</div>
            <div style={styles.menuItem}>⚙️ Settings</div>
            <div style={styles.menuItem}>📅 Activity</div>
            <div style={styles.menuItem}>🛟 Support</div>

            <hr style={{ margin: "8px 0" }} />

            <div style={styles.menuItem} onClick={onLogout}>🚪 Logout</div>
          </div>
        )}

      </div>
    );
  }
}

const styles = {
  header: {
    width: "100%",
    height: "65px",
    background: "#1A73E8",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: "20px",
    position: "relative",
    color: "#fff",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    gap: "10px",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #fff",
  },
  username: {
    fontSize: "17px",
    fontWeight: "600",
  },
  dropdown: {
    position: "absolute",
    top: "65px",
    right: "20px",
    width: "220px",
    background: "#fff",
    color: "#000",
    borderRadius: "10px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.3)",
    padding: "10px",
    zIndex: 1000,
  },
  dropdownHeader: {
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#666",
  },
  menuItem: {
    padding: "10px",
    fontSize: "15px",
    cursor: "pointer",
    borderRadius: "6px",
  },
};

export default Header;
