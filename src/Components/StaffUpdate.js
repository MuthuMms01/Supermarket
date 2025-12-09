import React, { Component } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { saveAs } from "file-saver";
import "../Css/StaffDetails.css"; 

class StudentDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staffs: [],
      loading: false,
      error: "",
      message: "",
      editStaff: null,      
      selectedImage: null, // file for upload
      previewImage: null,  // preview     
    };
     
  }

  componentDidMount() {
    this.fetchAllStaffs();
  }

  fetchAllStaffs = () => {
  this.setState({ loading: true, error: "", message: "" });

  fetch("https://localhost:7234/api/staff")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch staff");
      return res.json();
    })
    .then((data) => {
      // If the API returns an array, use it. If wrapped in $values, extract it.
      const staffsArray = Array.isArray(data) ? data : (data.$values || []);
      this.setState({ staffs: staffsArray });
    })
    .catch((err) => this.setState({ error: err.message || err }))
    .finally(() => this.setState({ loading: false }));
};

  editStaffDetails = (staff) => {
    this.setState({ 
      editStaff: { ...staff }, 
      previewImage: staff.imagepath ? `https://localhost:7234${staff.imagepath}` : null
     }); };

  handleChange = (e) => {
    const { name, value } = e.target;
   this.setState((prevState) => ({
      editStaff: { ...prevState.editStaff, [name]: value, },
    }));
  };

  handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({
       selectedImage: file,
        previewImage: URL.createObjectURL(file),
      });
    }
  };

  handleUpdate = async (e) => {
  e.preventDefault();
  const { editStaff, selectedImage } = this.state;

  const formData = new FormData();
  formData.append("staffid", editStaff.staffid);
  formData.append("staffname", editStaff.staffname);
  formData.append("email", editStaff.email);
  formData.append("mobileno", editStaff.mobileno);
  formData.append("password", editStaff.password);
  formData.append("dob", editStaff.dob);
  formData.append("joindate", editStaff.joindate);
  formData.append("role", editStaff.role);
  formData.append("blood", editStaff.blood);
  formData.append("address", editStaff.address);
  formData.append("gender", editStaff.gender);
  if (selectedImage) {
    formData.append("image", selectedImage);
  }

  try {
    const res = await fetch(`https://localhost:7234/api/staff/${editStaff.staffid}`, {
      method: "PUT",
      body: formData // send FormData directly
      // Do NOT set Content-Type here! Browser will set multipart/form-data automatically
    });

    if (res.ok) {
      const data = await res.json();
      alert("Staff updated successfully!");
      this.setState({
        message: "Staff updated successfully!",
        editStaff: null,
        selectedImage: null,
        previewImage: null
      }, this.fetchAllStaffs);
    } else {
      const errorText = await res.text();
      alert("Failed to update staff details: " + errorText);
    }
  } catch (error) {
    console.error(error);
  }
};


  formatDate = (dateString) => {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`; // for input[type=date] value
  };

  deleteStaff = (staffid) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;
    fetch(`https://localhost:7234/api/staff/${staffid}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok)
        throw new Error("Delete failed");
        this.setState({ message: "Staff deleted successfully!" });
        this.fetchAllStaffs();
      })
      .catch(() => {
        this.setState({ message: "Failed to delete staff" });
        this.fetchAllStaffs();
      });
  };

  exportToExcel = () => {
    const { staffs } = this.state;
    if (staffs.length === 0) return alert("No data to export!");
    const header = ["Staffid", "Name", "Email", "Mobile", "DOB", "JoiningDate"];
    const data = staffs.map((s) => [
      s.staffid,
      s.staffname,
      s.email,
      s.mobileno,
      this.formatDate(s.dob),
      this.formatDate(s.joindate),
    ]);
    const sheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "StaffDetails");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "StaffDetails.xlsx");
  };

  render() {
    const { staffs, loading, error, message, editStaff, previewImage } = this.state;

    return (
      <div style={{ width: "89%", margin: "auto", marginTop: "40px",marginLeft:"120px" }}>
        <div style={{ marginTop: 20, padding: 20, border: "4px solid #ccc", borderRadius: 10 }}>
          <h2 className="title">Staff Details</h2>
          <div className="actions">
            <button className="btn primary" onClick={this.fetchAllStaffs}>🔄 Refresh</button>
            <button className="btn danger" onClick={this.exportToExcel}>📤Export to Excel</button>
          </div>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
          <table className='staff-table'>
          <thead className='staff-table td'>
           <tr className='staff-table th'  >
           
              <th>S.No</th>
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>DOB</th>
              <th>Joining Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((s, index) => (
              <tr key={s.staffid}>
                <td>{index + 1}</td>
                <td>
                  <img src={s.imagepath ? `https://localhost:7234${s.imagepath}` : "https://via.placeholder.com/50"}
                    alt={s.staffname}style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }}/>
                </td>
                <td>{s.staffid}</td>
                <td>{s.staffname}</td>
                <td>{s.email}</td>
                <td>{s.mobileno}</td>
                <td>{this.formatDate(s.dob)}</td>
                <td>{this.formatDate(s.joindate)}</td>
                <td>
                  <button className="edit-btn" onClick={() => this.editStaffDetails(s)} style={{ marginRight: 5 }}>✏️ Edit</button>
                  <button className="delete1"onClick={() => this.deleteStaff(s.staffid)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>

        {/* Edit Form */}
        {editStaff && (
          <div style={{ marginTop: 20, padding: 20, border: "4px solid #ccc", borderRadius: 10 }}>
            <h2 className="title">Edit Staff Details</h2>
               {loading && <p>Loading...</p>}
               {error && <p style={{ color: "red" }}>{error}</p>}
               {message && <p style={{ color: "green" }}>{message}</p>}
               <form onSubmit={this.handleUpdate}>
               {/* First row */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
             <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
               <label>Staff Name:</label>
               <input type="text" name="staffname" value={editStaff.staffname}onChange={this.handleChange} required />
             </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Email:</label>
              <input type="text" name="email" value={editStaff.email}onChange={this.handleChange} required />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Mobile No:</label>
              <input type="number" name="mobileno" value={editStaff.mobileno}onChange={this.handleChange} required />
            </div>
          </div>

           {/* Second row */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
               <label>Password:</label>
               <input type="text" name="password" value={editStaff.password}onChange={this.handleChange} required />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Gender:</label>
               <select name="gender" value={editStaff.gender} onChange={this.handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
               </select>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Role:</label>
              <select name="role" value={editStaff.role} onChange={this.handleChange}>
                <option value="">Select</option>
                <option value="0">Admin</option>
                 <option value="1">Manager</option>
                <option value="2">Staff</option>
              </select>
            </div>
          </div>
             {/* Third row */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Date Of Birth:</label>
              <input type="date" name="dob"value={this.formatDate(editStaff.dob)} onChange={this.handleChange} required/>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Date Of Joining:</label>
              <input type="date" name="joindate" value={this.formatDate(editStaff.joindate)} onChange={this.handleChange} required/>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Blood Group:</label>
              <select name="blood" value={editStaff.blood} onChange={this.handleChange}>
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
             <label>Staff Image:</label>
             <input type="file" accept="image/*" onChange={this.handleImageChange} />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Address:</label>
              <input type="text" name="address" value={editStaff.address}  onChange={this.handleChange} />
          </div>
          </div>
              {previewImage && <img src={previewImage} alt="Preview" style={{ width: 80, height: 80, marginTop: 10, borderRadius: "50%" }} />}
              <br />
              <button className="delete1" type="submit" >Update</button>
              <button className="edit-btn" type="button"  onClick={() => this.setState({ editStaff: null, selectedImage: null, previewImage: null })}>Cancel </button>
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default StudentDetails;
