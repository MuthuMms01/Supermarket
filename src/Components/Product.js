import React, { Component } from "react";
import axios from "axios";
import "../Css/Product.css";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],staffs: [],
      showAddForm: false, showEditForm: false,
      newProductID: "", newProductName: "", newProductPrice: "", newAddedBy: "",
      filterText: "", editItem: null,
      currentPage: 1, itemsPerPage: 8,
    };
    this.productApi = "https://localhost:7234/api/Sales/Product";
    this.staffApi = "https://localhost:7234/api/staff/Role";
  }

  componentDidMount() {
    this.loadStaffs();
    this.loadProducts();
  }

  loadProducts = () => {
    axios .get(this.productApi)
      .then((res) => {
        const productsArray = Array.isArray(res.data.$values) ? res.data.$values : [];
        this.setState({ products: productsArray });
      })
      .catch((err) => console.error(err));
  };

  loadStaffs = () => {
    axios .get(this.staffApi)
      .then((res) => {
        const staffsArray = Array.isArray(res.data.$values) ? res.data.$values : [];
        this.setState({ staffs: staffsArray });
      })
      .catch((err) => console.error(err));
  };

  handleAddProduct = () => {
    const data = {
      productName: this.state.newProductName,
      productPrice: this.state.newProductPrice,
      addedBy: this.state.newAddedBy,
    };
    axios.post(this.productApi, data).then(() => {
      alert("Product added successfully");
      this.setState({
        showAddForm: false,
        newProductName: "",newProductPrice: "", newAddedBy: "",
      });
      this.loadProducts();
      });
    };

  handleEditProduct = () => {
    const id = this.state.editItem.productID;
    axios.put(`${this.productApi}?id=${id}`, this.state.editItem).then(() => {
      alert("Product updated successfully");
      this.setState({ showEditForm: false, editItem: null });
      this.loadProducts();
    });
  };

  deleteProduct = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    axios.delete(`${this.productApi}?id=${id}`).then(() => {
      alert("Product deleted successfully");
      this.loadProducts();
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

    return (
      <div style={{ width: "87%", margin: "auto", marginTop: "40px", marginLeft: "140px" }}>
        <div style={{ marginTop: 20, padding: 20, border: "4px solid #ccc", borderRadius: 10 }}>
          <h2 className="title">Product Management</h2>
          <div className="actions">
            <input type="text" placeholder="Filter by Product Name or ID"
              value={filterText}onChange={(e) => this.setState({ filterText: e.target.value, currentPage: 1 })}/>
            <button className="delete2" onClick={() => this.setState({ showAddForm: true })}>AddProduct</button>
          </div>
          {/* Product Table */}
          <table className="staff-table">
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Price (₹)</th>
                <th>Added By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: "center" }}>
              {currentProducts.map((s, index) => (
                <tr key={index}>
                  <td>{s.productID}</td>
                  <td>{s.productName}</td>
                  <td>{s.productPrice}</td>
                  <td>{s.addedby}</td>
                  <td>
                    <button className="edit-btn"onClick={() => this.setState({ showEditForm: true, editItem: s })}>Edit</button>
                    <button className="delete1" onClick={() => this.deleteProduct(s.productID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
         <div style={{marginTop: "15px",display: "flex",justifyContent: "space-between",alignItems: "center"}}>
            <div style={{ display: "flex", alignItems: "left" }}> Showing {currentProducts.length} out of {filteredProduct.length} entries</div>
            <div style={{ textAlign: "center" }}>
            <button onClick={() => this.setState({ currentPage: currentPage - 1 })}
              disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {Math.ceil(filteredProduct.length / itemsPerPage)}</span>
            <button onClick={() => this.setState({ currentPage: currentPage + 1 })}
              disabled={indexOfLastItem >= filteredProduct.length}>Next</button>
          </div>
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
