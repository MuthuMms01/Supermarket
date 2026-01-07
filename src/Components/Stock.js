import React, { Component } from "react";
import axios from "axios";
import "../Css/Stock.css";
import CenteredAlert  from "./StylishAlertManager";
import ConfirmModal from "./ConfirmModal";
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from "@mui/material/Pagination";

class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: [], products: [],staffs: [],
      showAddForm: false,showEditForm: false,
      newProductID: "",newQuantity: "",newAddedBy: "",
      filterText: "",
      currentPage: 1,itemsPerPage: 10,
       show: false,
      message: "",
      onConfirm: null,
      onCancel: null,
      editItem: null
    };
    this.alertRef = React.createRef();
     this.confirmRef = React.createRef();
  }
open = (message, onConfirm, onCancel) => {
    this.setState({ show: true, message, onConfirm, onCancel });
  };
  componentDidMount() {
    this.loadStock();
    this.loadStaffs();
    this.loadProducts();
  }
handlePageChange = (event, value) => {
  this.setState({ currentPage: value });
};
  loadStock = () => {
    axios.get("http://localhost:1514/api/Sales/Stock")
    .then(res => {
        this.setState({ stock: res.data });
      })
      .catch(err => console.error(err));
  };

  loadProducts = () => {
    axios.get("http://localhost:1514/api/Sales/Product")
      .then(res => {
        this.setState({ products: res.data });
      })
      .catch(err => console.error(err));
  };

  loadStaffs = () => {
  axios.get("http://localhost:1514/api/staff/Role")
       .then(res => {
        this.setState({ staffs: res.data });
      })
      .catch(err => console.error(err));
  };

  handleAddStock = () => {
    const data = {
      productID: this.state.newProductID,
      quantity: this.state.newQuantity,
      addedBy: this.state.newAddedBy
    };
    axios.post("http://localhost:1514/api/Sales/Stock", data)
    .then((response) => {
      this.alertRef.current.showAlert(response.data.message, "success");
      this.setState({showAddForm: false, newProductID: "",newQuantity: "", newAddedBy: ""});    
      this.loadStock();
    })
    .catch((error) => {
    });  
      this.setState({ showAddForm: false });
    };
  

  handleEditStock = () => {
    const id = this.state.editItem.stockID;
    axios.put(`http://localhost:1514/api/Sales/Stock?id=${id}`, this.state.editItem).then(() => {
      this.alertRef.current.showAlert("Stock details are Updated successfully", "success");
      this.setState({ showEditForm: false, editItem: null });
      this.loadStock();
    });
  };

  deleteStock = (id) => {
  // Open stylish confirm modal instead of window.confirm
  this.confirmRef.current.open("Are you sure you want to delete this stock?",() => {
      // This function runs if user clicks "Yes"
      axios
        .delete(`http://localhost:1514/api/Sales/Stock?id=${id}`)
        .then(() => {
          // Show modern alert
          this.alertRef.current.showAlert(
            "Stock deleted successfully",
            "success"
          );
          // Reload stock list
          this.loadStock();
        })
        .catch(() => {
          this.alertRef.current.showAlert(
            "Failed to delete stock",
            "error"
          );
        });
    },
    () => {
      // Optional: user clicked "No"
      console.log("Delete cancelled");
    }
  );
};
handleConfirm = () => {
    this.setState({ show: false }, () => {
      if (this.state.onConfirm) this.state.onConfirm();
    });
  };

  handleCancel = () => {
    this.setState({ show: false }, () => {
      if (this.state.onCancel) this.state.onCancel();
    });
  };
  render() {
   const {show, message,stock, products, staffs, showAddForm, showEditForm, editItem, filterText, currentPage,itemsPerPage } = this.state;
     //filter section
   const filteredStock = stock.filter((s) => {
    const filter = filterText.toLowerCase();
    const productName = s.productName ? s.productName.toLowerCase() : "";
    return productName.includes(filter) || s.productID.toString().includes(filter);
   if (!show) return null;
  });
  // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStocks = filteredStock.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredStock.length / itemsPerPage);

    return (
      
        <div style={{ width: "65%", margin: "auto", marginTop: "40px",marginLeft:"300px" }}>
          
        <div style={{ marginTop: 20, padding: 20, border: "4px solid #ccc", borderRadius: 10 }}>
          <h2 className="title">Stock Management</h2>   
        <CenteredAlert ref={this.alertRef} />
        <ConfirmModal ref={ this.confirmRef}/>
 <table >
         <tr>
          <td align="right" style={{ whiteSpace: "nowrap" }}>
           <input type="text" placeholder="Filter by Product Name or ID" value={filterText}
            onChange={(e) =>this.setState({ filterText: e.target.value, currentPage: 1 })}style={{width:"20px", marginRight: "232px" }}/>
            <Button variant="contained"size="small"color="secondary" onClick={() => this.setState({ showAddForm: true })}>Add Stock</Button>
          </td>
         </tr>
       </table>          
        <table className='staff-table'>
          <thead className='staff-table td'>
           <tr className='staff-table th' style={{ textAlign: "center" }} >
            <th>S.No</th>
              <th>StockId</th>
              <th>ProductId</th>
              <th>ProdcutName</th>
              <th>Quantity</th>
              <th>Added By</th>
              <th>Actions</th>
            </tr>
          </thead>
         <tbody style={{ textAlign: "center" }}>
              {currentStocks.map((s, index) => (    
              <tr key={s.stockID}>
            <td>{index + 1}</td>
                <td>{s.stockID}</td>        
                <td>{s.productID}</td>      
                <td>{s.productName}</td> 
                <td>{s.quantity}</td>
                <td>{s.addedby}</td>
                  <td>
                    <Button color="warning" onClick={() => this.setState({ showEditForm: true, editItem: s })}style={{ marginRight:-25 }} startIcon={<EditIcon />}/>
                    <Button color="danger" onClick={() => this.deleteStock(s.stockID)} startIcon={<DeleteIcon />}/>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
  {/* Pagination */}
    <div style={{marginTop: "15px",display: "flex",justifyContent: "space-between",alignItems: "center"}}>
          Showing {currentStocks.length} out of {filteredStock.length} entries
        <Pagination count={totalPages} page={currentPage} onChange={this.handlePageChange}
         color="secondary" sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}/>
       </div>
         
        {/* ADD STOCK FORM */}
        {showAddForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add Stock</h3>
              <label>Product :</label>
              <select value={this.state.newProductID} onChange={(e) => this.setState({ newProductID: e.target.value })}>
                 <option value="">Select Product</option>
                {Array.isArray(this.state.products) &&
                   this.state.products.map((p) => (
                   <option key={p.productID} value={p.productID}>{p.productName} (₹{p.productPrice})</option>
                ))}
              </select>
              <label>Quantity</label>
              <input type="number" placeholder="Quantity" value={this.state.newQuantity}
                onChange={(e) => this.setState({ newQuantity: e.target.value })}/>
              <label>Staff :</label>
              <select value={this.state.newAddedBy} onChange={(e) => this.setState({ newAddedBy: e.target.value })}>
                <option value="">Select Staff</option>
                {staffs.map((s) => (<option key={s.staffid} value={s.staffid}>{s.staffname}</option>))}
              </select>
              <div className="modal-actions"> 
                <button className="delete2" onClick={this.handleAddStock}>Save </button>
                <button className="edit-btn"onClick={() => this.setState({ showAddForm: false })}>Close </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT STOCK FORM */}
        {showEditForm && editItem && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Stock</h3>
              <label>Product :</label>
                <select value={editItem.productID} onChange={(e) =>
                  this.setState({editItem: { ...editItem, productID: e.target.value } })}>
                {products.map((p) => ( <option key={p.productID} value={p.productID}>
                    {p.productName}</option>
                ))} </select>
                <label>Quantity :</label>
                <input type="number"value={editItem.quantity} onChange={(e) =>
                  this.setState({editItem: { ...editItem, quantity: e.target.value }}) }/>
                  <label>Staff :</label>
                <select value={editItem.addedBy} onChange={(e) =>this.setState({editItem: { ...editItem, addedBy: e.target.value } })}>
                {staffs.map((p) => (  
                  <option key={p.staffid} value={p.staffid}>
                    {p.staffname}</option>
                ))} </select>
              <div className="modal-actions">
                <button className="delete2" onClick={this.handleEditStock}>Update </button>
                <button className="edit-btn" onClick={() => this.setState({ showEditForm: false })}>Close </button>
              </div>
            </div>
          </div>
        )}
        
      </div>
      </div>
      
    );
  }
}

export default Stock;
