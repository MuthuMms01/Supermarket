import React, { Component } from 'react';
import "../Css/StaffCreate.css";

class StaffAdd extends Component {
   state = {
    staffname: "",
    email: "",
    mobileno: "",
    password: "",
    gender: "",
    role: "",
    dob: "",
    joindate: "",
    blood: "",
    address: "",
    error:"",
    success:"",
    image: null
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFileChange = (e) => {
    this.setState({ image: e.target.files[0] });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("staffname", this.state.staffname);
    formData.append("email", this.state.email);
    formData.append("mobileno", this.state.mobileno);
    formData.append("password", this.state.password);
    formData.append("gender", this.state.gender);
    formData.append("dob", this.state.dob);
    formData.append("joindate", this.state.joindate);
    formData.append("role", this.state.role);
    formData.append("blood", this.state.blood);
    formData.append("address", this.state.address);
    if (this.state.image) formData.append("image", this.state.image);
    try {
      const res = await fetch("https://localhost:7234/api/staff", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        alert("Staff added successfully! ID: " + data.staffid);
        this.setState({ staffname: "",email: "",mobileno: "",password: "",gender: "",
                     role: "",dob: "",joindate: "",blood: "",address: "", imagepath: null });
      } 
      else {
        alert("Failed to save staff details");
      }
    } catch (error) 
    {console.error(error);}
  };

  render() {
     const {  error } = this.state;
    return (
         <div style={{ width: "87%", margin: "auto", marginTop: "40px",marginLeft:"140px" }}>
        <div style={{ marginTop: 20, padding: 20, border: "4px solid #ccc", borderRadius: 10 }}>
        <form onSubmit={this.handleSubmit}>
          <h2 className="title">Staff Creation</h2>
          {/* First row */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Staff Name:</label>
              <input type="text" name="staffname" value={this.state.staffname}onChange={this.handleChange} required />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Email:</label>
              <input type="text" name="email" value={this.state.email}onChange={this.handleChange} required />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Mobile No:</label>
              <input type="number" name="mobileno" value={this.state.mobileno}onChange={this.handleChange} required />
            </div>
          </div>

          {/* Second row */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
               <label>Password:</label>
               <input type="text" name="password" value={this.state.password}onChange={this.handleChange} required />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Gender:</label>
               <select name="gender" value={this.state.gender} onChange={this.handleChange}>
                 <option value="">Select</option>
                 <option value="Male">Male</option>
                 <option value="Female">Female</option>
            </select>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Role:</label>
              <select name="role" value={this.state.role} onChange={this.handleChange}>
                <option value="">Select</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
          </div>

          {/* Third row */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Date Of Birth:</label>
              <input type="date" name="dob"value={this.state.dob} onChange={this.handleChange} required/>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Date Of Joining:</label>
              <input type="date" name="joindate"value={this.state.joindate} onChange={this.handleChange} required/>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Blood Group:</label>
              <select name="blood" value={this.state.blood} onChange={this.handleChange}>
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
             <label>Address:</label>
             <textarea type="text" name="address" value={this.state.address} rows={4} onChange={this.handleChange} required />
          </div>
           <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
             <label>Upload imagepath:</label>
             <input type="file" name="image"  onChange={this.handleFileChange} />
           </div>
        </div>

          {/* Buttons */}
          <div className="button-row">
            <button className="btn primary" type="submit">Save</button>
            <button className="btn danger" type="button" onClick={() => window.location.reload()}>Reset</button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

}
export default StaffAdd;
