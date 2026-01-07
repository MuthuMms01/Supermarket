import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import "../Css/Dash.css"; 
import axios from "axios";
import { saveAs } from "file-saver";
import Button from '@mui/material/Button';
import Pagination from "@mui/material/Pagination";
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import CenteredAlert  from "./StylishAlertManager";
import ConfirmModal from "./ConfirmModal";

import "../Css/StaffDetails.css"; 

class StaffUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staffs: [],loading: false,error: "",message: "",editStaff: null,filterText: "",
      currentPage: 1,itemsPerPage: 10, selectedImage: null,previewImage: null,
      show: false,onConfirm: null, onCancel: null
    };
      this.alertRef = React.createRef();
      this.confirmRef = React.createRef();
  }
  open = (message, onConfirm, onCancel) => {
    this.setState({ show: true, message, onConfirm, onCancel });
  };

  componentDidMount() {
    this.fetchAllStaffs();
  }

  handlePageChange = (event, value) => {
  this.setState({ currentPage: value });
  };

  fetchAllStaffs = () => {
  this.setState({ loading: true, error: "", message: "" });
  fetch("http://localhost:1514/api/staff", {method: "GET"})
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch staff");
      return res.json();
    })
    .then((data) => {
      const staffsArray = Array.isArray(data) ? data : (data.$values || []);
      this.setState({ staffs: staffsArray });
    })
    .catch((err) => this.setState({ error: err.message || err }))
    .finally(() => this.setState({ loading: false }));
  };

  editStaffDetails = (staff) => {
    this.setState({ 
      editStaff: { ...staff }, 
      previewImage: staff.imagepath ? `http://localhost:1514${staff.imagepath}` : null
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
      this.setState({selectedImage: file,previewImage: URL.createObjectURL(file)});
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
      const res = await fetch(`http://localhost:1514/api/staff/${editStaff.staffid}`, {
      method: "PUT",body: formData});
    if (res.ok) {
      this.alertRef.current.showAlert("Staff data's updated successfully!", "success");
      this.setState({
      editStaff: null,selectedImage: null,previewImage: null}, this.fetchAllStaffs);
    } else {
      const errorText = await res.text();
      this.alertRef.current.showAlert("Failed to update staff details: " + errorText);
    }
  } catch (error) {
  }
};

formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy}`; 
};

  deleteStaff = (staffid) => {
    this.confirmRef.current.open("Are you sure you want to delete this Staff?",() => {
    axios.delete(`http://localhost:1514/api/staff/${staffid}`, {method: "DELETE"})
    .then((response) => {
     this.alertRef.current.showAlert("Staff data deleted successfully!", "success");
     this.fetchAllStaffs();
    })
     .catch(() => {
        this.alertRef.current.showAlert("Failed to delete staff");
        this.fetchAllStaffs();
      });
    })
 };

  exportToExcel = () => {
    const { staffs } = this.state;
    if (staffs.length === 0) return alert("No data to export!");
    const header = ["Staffid", "Name", "Email", "Mobile", "DOB", "JoiningDate"];
    const data = staffs.map((s) => [
      s.staffid,s.staffname,s.email,s.mobileno,this.formatDate(s.dob),this.formatDate(s.joindate)]);
    const sheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "StaffDetails");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "StaffDetails.xlsx");
  };

  render() {
    const { staffs, loading, error, message, editStaff, currentPage,itemsPerPage,previewImage,filterText } = this.state;
    const filteredStaff = staffs.filter((s) => {
    const filter = filterText.toLowerCase();
    const staffname = s.staffname ? s.staffname.toLowerCase() : "";
    return staffname.includes(filter) || s.staffid.toString().includes(filter)|| s.mobileno.toString().includes(filter);
    });
      // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStaffs = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  return (
    <div style={{ width: "75%", margin: "auto", marginTop: "40px",marginLeft:"250px" }}>
      <div style={{ marginTop: 20, padding: 20, border: "4px solid #ccc", borderRadius: 10 }}>
        <h2 className="title">Staff Details</h2>
          <CenteredAlert ref={this.alertRef} />
          <ConfirmModal ref={ this.confirmRef}/>
        {/* Employees table here */}
        <table >
         <tr>
          <td align="right" style={{ whiteSpace: "nowrap" }}>
           <input type="text" placeholder="Filter by Name or ID" value={filterText}
            onChange={(e) =>this.setState({ filterText: e.target.value, currentPage: 1 })}style={{width:"30px", marginRight: "152px" }}/>
           <Button variant="contained"size="medium"color="secondary"onClick={this.fetchAllStaffs}startIcon={<RefreshIcon />}style={{ marginRight: "6px" }}/>
           <Button variant="contained"size="small"color="success"onClick={this.exportToExcel}startIcon={<DownloadIcon />}style={{ marginRight: "6px" }}>Excel</Button>
           <Button variant="contained"size="small"color="primary"component={Link} to="/StaffCreate">🧑‍💼 Create</Button>
          </td>
         </tr>
       </table>       
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        <table className='staff-table'>
        <thead className='staff-table td'>
          <tr className='staff-table th'  > 
            <th>S.No</th><th>Image</th>
            <th>StaffID</th><th>Name</th><th>Email</th>
            <th>Mobile</th><th>DOB</th>
            <th>Joining Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {currentStaffs.map((s, index) => (
          <tr key={s.staffid}>
            <td>{index + 1}</td>
            <td><img src={s.imagepath ? `http://localhost:1514${s.imagepath}` : "https://via.placeholder.com/50"}
                alt={s.staffname}style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }}/></td>
            <td>{s.staffid}</td>
            <td>{s.staffname}</td>
            <td>{s.email}</td>
            <td>{s.mobileno}</td>
            <td>{this.formatDate(s.dob)}</td>
            <td>{this.formatDate(s.joindate)}</td>
            <td>
              <Button color="warning" onClick={() => this.editStaffDetails(s)}style={{ marginRight:-25 }} startIcon={<EditIcon />}/>
              <Button color="danger" onClick={() => this.deleteStaff(s.staffid)} startIcon={<DeleteIcon />}/> 
            </td>
          </tr>
        ))}
        </tbody>         
        </table>
        <div style={{marginTop: "15px",display: "flex",justifyContent: "space-between",alignItems: "center"}}>
          Showing {currentStaffs.length} out of {filteredStaff.length} entries
        <Pagination count={totalPages} page={currentPage} onChange={this.handlePageChange}
         color="secondary" sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}/>
       </div>
    </div>
        {/* Edit Form */}
    {editStaff && (
    <div className="modal1">
      <div className="modal-content1">
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
            <input type="text" name="mobileno" value={editStaff.mobileno} maxLength={10}onChange={this.handleChange} required />
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
              <option value="Male">Male</option><option value="Female">Female</option>
            </select>
          </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Role:</label>
              <select name="role" value={editStaff.role} onChange={this.handleChange}>
                <option value="">Select</option><option value="0">Admin</option>
                <option value="1">Manager</option><option value="2">Staff</option>
              </select>
            </div>
        </div>
       {/* Third row */}
        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label>Date Of Birth:</label>
            <input type="text" name="dob"value={this.formatDate(editStaff.dob)} onChange={this.handleChange} required/>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label>Date Of Joining:</label>
            <input type="text" name="joindate" value={this.formatDate(editStaff.joindate)} onChange={this.handleChange} required/>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label>Blood Group:</label>
            <select name="blood" value={editStaff.blood} onChange={this.handleChange}>
              <option value="">Select</option>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
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
        <div>
          {previewImage && <img src={previewImage} alt="Preview" style={{ width: 80, height: 80, marginTop: 10, borderRadius: "50%" }} />}
          <div style={{textAlign:"right" }}>
            <button className="delete1" type="submit" >Update</button>
            <button className="edit-btn" type="button"  onClick={() => this.setState({ editStaff: null, selectedImage: null, previewImage: null })}>Cancel </button>
          </div>
        </div>
      </form>
      </div>
    </div>
        )}
  </div>
    );
  }
}

export default StaffUpdate;
