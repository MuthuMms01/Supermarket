import React, { Component } from 'react';
import "../Css/StaffCreate.css";
import CenteredAlert  from "./StylishAlertManager";
import ConfirmModal from "./ConfirmModal";

class StaffAdd extends Component {
  constructor(props) {
    super(props);
   this.state = {
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
    show: false,
      message: "",
      onConfirm: null,
      onCancel: null,
    image: null
  };
 this.alertRef = React.createRef();
     this.confirmRef = React.createRef();
}

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
      const res = await fetch("http://localhost:1514/api/staff", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
         this.alertRef.current.showAlert("Staff added successfully! ID: " + data.staffid, "success");
        this.setState({ staffname: "",email: "",mobileno: "",password: "",gender: "",
                     role: "",dob: "",joindate: "",blood: "",address: "", imagepath: "" });
      } 
      else {
        this.alertRef.current.showAlert("Failed to save staff details");
      }
    } catch (error) 
    {console.error(error);}
  };

  render() {
     const {error } = this.state;
    return (
         <div style={{ width: "85%", margin: "auto", marginLeft:"160px" }}>
        <div style={{ marginTop: 20, padding: 20, border: "4px solid #ccc", borderRadius: 10 }}>
        <form onSubmit={this.handleSubmit}>
            <CenteredAlert ref={this.alertRef} />
        <ConfirmModal ref={ this.confirmRef}/>
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
              <input type="text"className="input-field"value={this.state.mobileNo} maxLength={10}
              onChange={(e) => {const onlyNums = e.target.value.replace(/\D/g, ""); this.setState({ mobileNo: onlyNums });}}/>
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
          <div className="button-row"style={{ display: "flex",justifyContent: "flex-end" }}>
            <button className="delete1" type="submit">Save</button>
            <button className="edit-btn"  onClick={() => window.location.reload()}>Reset</button>
             <button className="delete-btn"  onClick={() => window.history.back()}>Back</button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

}
export default StaffAdd;
