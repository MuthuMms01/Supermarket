import React, { Component } from "react";
import axios from "axios";
import "../Css/Product.css";
import CenteredAlert  from "./StylishAlertManager";
import ConfirmModal from "./ConfirmModal";
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from "@mui/material/Pagination";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],staffs: [],
      showAddForm: false, showEditForm: false,
      newProductID: "", newProductName: "", newProductPrice: "", newAddedBy: "",
      filterText: "", editItem: null,
      currentPage: 1, itemsPerPage: 10,
      show: false,
      message: "",
      onConfirm: null,
      onCancel: null
    };
    this.alertRef = React.createRef();
    this.confirmRef = React.createRef();
  }
open = (message, onConfirm, onCancel) => {
    this.setState({ show: true, message, onConfirm, onCancel });
  };
  componentDidMount() {
    this.loadStaffs();
    this.loadProducts();
  }

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

  handleAddProduct = () => {
    const data = {
      productName: this.state.newProductName,
      productPrice: this.state.newProductPrice,
      addedBy: this.state.newAddedBy,
    };
    axios.post("http://localhost:1514/api/Sales/Product", data)
    .then((response) => {
      this.alertRef.current.showAlert(response.data.message, "success");
         this.setState({
        showAddForm: false,
        newProductName: "",newProductPrice: "", newAddedBy: "",
      })
      this.loadProducts();
      })     
      .catch((error) => {
       this.alertRef.current.showAlert("Already this product is available", "error");
    });  
      this.setState({ showAddForm: false });
    };
  

  handleEditProduct = () => {
    const id = this.state.editItem.productID;
    axios.put(`http://localhost:1514/api/Sales/Product?id=${id}`, this.state.editItem)
    .then((response) => {
    this.alertRef.current.showAlert(response.data.message, "success");
      this.setState({ showEditForm: false, editItem: null });
      this.loadProducts();
    })
    .catch(() => {
          this.alertRef.current.showAlert("Failed to Update Product","error");
        });
  };

  deleteProduct = (id) => {
     this.confirmRef.current.open("Are you sure you want to delete this Product?",() => {
    axios.delete(`http://localhost:1514/api/Sales/Product?id=${id}`)
    .then((response) => {
      this.alertRef.current.showAlert("Product Deleted Successfully", "success");
      this.loadProducts();
    })
     .catch(() => {
          this.alertRef.current.showAlert("Failed to delete Product","error");
        });
  })
     };
handleConfirm = () => {
    this.setState({ show: false }, () => {
      if (this.state.onConfirm) this.state.onConfirm();
    });
  };
handlePageChange = (event, value) => {
  this.setState({ currentPage: value });
};
  handleCancel = () => {
    this.setState({ show: false }, () => {
      if (this.state.onCancel) this.state.onCancel();
    });
  };
  render() {
    const {products,staffs,showAddForm,showEditForm,editItem,filterText,currentPage,itemsPerPage} = this.state;
    // Filter products
    const filteredProduct = products.filter((s) => {
      const filter = filterText.toLowerCase();
      const productName = s.productName ? s.productName.toLowerCase() : "";
      return productName.includes(filter) || s.productID.toString().includes(filter);
    });
    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProduct.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProduct.length / itemsPerPage);
    return (
      <div style={{ width: "65%",  marginTop: "40px", marginLeft: "300px" }}>
        <div style={{ marginTop: 20, padding: 20, border: "4px solid #ccc", borderRadius: 10 }}>
          <h2 className="title">Product Management</h2>
          
           <CenteredAlert ref={this.alertRef} />
            <ConfirmModal ref={ this.confirmRef}/>
              <table >
         <tr>
          <td align="right" style={{ whiteSpace: "nowrap" }}>
           <input type="text" placeholder="Filter by Product Name or ID" value={filterText}
            onChange={(e) =>this.setState({ filterText: e.target.value, currentPage: 1 })}style={{width:"20px", marginRight: "222px" }}/>
            <Button variant="contained"size="small"color="secondary" onClick={() => this.setState({ showAddForm: true })}>Add Product</Button>
          </td>
         </tr>
       </table>    
          {/* Product Table */}
          <table className="staff-table">
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>S.No</th>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Price (₹)</th>
                <th>Added By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: "center" }}>
              {currentProducts.map((s, index) => (
                <tr key={s.productID}>
            <td>{index + 1}</td>
                  <td>{s.productID}</td>
                  <td>{s.productName}</td>
                  <td>{s.productPrice}</td>
                  <td>{s.addedby}</td>
                  <td>
                    <Button color="warning" onClick={() => this.setState({ showEditForm: true, editItem: s })}style={{ marginRight:-25 }} startIcon={<EditIcon />}/>
                    <Button color="danger" onClick={() => this.deleteProduct(s.productID)} startIcon={<DeleteIcon />}/>
                 </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
           <div style={{marginTop: "15px",display: "flex",justifyContent: "space-between",alignItems: "center"}}>
          Showing {currentProducts.length} out of {filteredProduct.length} entries
        <Pagination count={totalPages} page={currentPage} onChange={this.handlePageChange}
         color="secondary" sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}/>
       </div>
         
          {/* Add Product Modal */}
          {showAddForm && (
            <div className="modal">
              <div className="modal-content">
                <h3 className="title">Add Product</h3>
                <label>Product Name:</label>
                <input type="text"value={this.state.newProductName}
                  onChange={(e) => this.setState({ newProductName: e.target.value })}/>
                <label>Product Price:</label>
                <input type="number" value={this.state.newProductPrice}
                  onChange={(e) => this.setState({ newProductPrice: e.target.value })}/>
                <label>Staff Name:</label>
                <select value={this.state.newAddedBy}onChange={(e) => this.setState({ newAddedBy: e.target.value })}>
                  <option value="">Select Staff</option>
                  {staffs.map((s) => (
                    <option key={s.staffid} value={s.staffid}>{s.staffname}</option>
                  ))}
                </select>
                <div className="modal-actions">
                  <button className="delete2" onClick={this.handleAddProduct}>Add</button>
                  <button className="edit-btn" onClick={() => this.setState({ showAddForm: false })}>Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Product Modal */}
          {showEditForm && editItem && (
            <div className="modal">
              <div className="modal-content">
                <h3 className="title">Edit Product</h3>
                <label>Product Name:</label>
                <input type="text"value={editItem.productName}
                  onChange={(e) =>this.setState({ editItem: { ...editItem, productName: e.target.value } })}/>
                <label>Product Price:</label>
                <input type="text"value={editItem.productPrice}
                  onChange={(e) =>this.setState({ editItem: { ...editItem, productPrice: e.target.value } })}/>
                <label>Staff:</label>
                <select value={editItem.addedBy}
                  onChange={(e) =>this.setState({ editItem: { ...editItem, addedBy: e.target.value } })}>
                  {staffs.map((p) => (
                    <option key={p.staffid} value={p.staffid}>{p.staffname}</option>
                  ))}
                </select>
                <div className="modal-actions">
                  <button className="delete2" onClick={this.handleEditProduct}>Update</button>
                  <button className="edit-btn" onClick={() => this.setState({ showEditForm: false })}>Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Product;
