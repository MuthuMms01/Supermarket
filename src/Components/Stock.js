import React, { Component } from "react";
import axios from "axios";
import "../Css/Stock.css";

class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: [], products: [],staffs: [],
      showAddForm: false,showEditForm: false,
      newProductID: "",newQuantity: "",newAddedBy: "",
      filterText: "",
      currentPage: 1,itemsPerPage: 10,
      editItem: null
    };
    this.stockApi = "https://localhost:7234/api/Sales/Stock";
    this.productApi = "https://localhost:7234/api/Sales/Product";
    this.staffApi = "https://localhost:7234/api/staff/Role";
  }

  componentDidMount() {
    this.loadStock();
    this.loadStaffs();
    this.loadProducts();
  }

  loadStock = () => {
    axios.get(this.stockApi).then((res) => {
      const stocksArray = Array.isArray(res.data.$values) ? res.data.$values : [];
      this.setState({ stock: stocksArray });
    })
    .catch((err) => console.error(err));
  };

  loadProducts = () => {
  axios.get(this.productApi)
    .then((res) => {
      const productsArray = Array.isArray(res.data.$values) ? res.data.$values : [];
      this.setState({ products: productsArray });
    })
    .catch((err) => console.error(err));
  };
  loadStaffs = () => {
    axios.get(this.staffApi).then((res) => {
     const staffsArray = Array.isArray(res.data.$values) ? res.data.$values : [];
      this.setState({ staffs: staffsArray });
    })
    .catch((err) => console.error(err));
  };

  handleAddStock = () => {
    const data = {
      productID: this.state.newProductID,
      quantity: this.state.newQuantity,
      addedBy: this.state.newAddedBy
    };
    axios.post(this.stockApi, data).then(() => {
      alert("Stock Added successfully");
      this.setState({showAddForm: false, newProductID: "",newQuantity: "", newAddedBy: ""});    
      this.loadStock();
    });
  };

  handleEditStock = () => {
    const id = this.state.editItem.stockID;
    axios.put(`${this.stockApi}?id=${id}`, this.state.editItem).then(() => {
       alert("Stock details are Updated successfully");
      this.setState({ showEditForm: false, editItem: null });
      this.loadStock();
    });
  };

  deleteStock = (id) => {
    if (!window.confirm("Are you sure you want to delete this stock?")) return;
    axios.delete(`${this.stockApi}?id=${id}`).then(() => {
      alert("Stock deleted successfully");
      this.loadStock();
    });
  };

  render() {
   const { stock, products, staffs, showAddForm, showEditForm, editItem, filterText, currentPage,itemsPerPage } = this.state;
     //filter section
   const filteredStock = stock.filter((s) => {
    const filter = filterText.toLowerCase();
    const productName = s.productName ? s.productName.toLowerCase() : "";
    return productName.includes(filter) || s.productID.toString().includes(filter);
  });
  // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStocks = filteredStock.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div style={{ width: "87%", margin: "auto", marginTop: "40px",marginLeft:"140px" }}>
        <div style={{ marginTop: 20, padding: 20, border: "4px solid #ccc", borderRadius: 10 }}>
          <h2 className="title">Stock Management</h2>   
        <div className="actions">
          <input type="text"placeholder="Filter by Product Name or ID"value={this.state.filterText}
           onChange={(e) => this.setState({ filterText: e.target.value })}/>
          <button className="edit1-btn" onClick={() => this.setState({ showAddForm: true })}>AddStock</button>
        </div>
      
        <table className='staff-table'>
          <thead className='staff-table td'>
           <tr className='staff-table th' style={{ textAlign: "center" }} >
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
              <tr key={index}>
                <td>{s.stockID}</td>        
                <td>{s.productID}</td>      
                <td>{s.productName}</td> 
                <td>{s.quantity}</td>
                <td>{s.addedby}</td>
                <td>
                  <button className="edit-btn"onClick={() =>this.setState({ showEditForm: true, editItem: s })}>Edit</button>
                  <button className="delete1-btn"onClick={() => this.deleteStock(s.stockID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  {/* Pagination */}
<div style={{marginTop: "15px",display: "flex",justifyContent: "space-between",alignItems: "center"}}>
  {/* Showing entries */}
  <div> Showing {currentStocks.length} out of {filteredStock.length} entries</div>
  {/* Pagination controls */}
  <div style={{ display: "flex", alignItems: "center" }}>
    {/* Previous button */}
    <button onClick={() => this.setState({ currentPage: currentPage - 1 })}
      disabled={currentPage === 1}className="delete2">Previous </button>
    {/* Page numbers */}
    {Array.from({ length: Math.ceil(filteredStock.length / itemsPerPage) },(_, i) => i + 1).map((pageNumber) => (
      <button className="buttonStyle" key={pageNumber}onClick={() => this.setState({ currentPage: pageNumber })}
        style={{fontWeight: pageNumber === currentPage ? "bold" : "normal",
          backgroundColor: pageNumber === currentPage ? "#007bff" : "white",
          color: pageNumber === currentPage ? "white" : "black",borderRadius: "50%",width: "30px",height: "30px",margin: "0 5px",
        }}>{pageNumber}</button>
    ))}
    {/* Next button */}
    <button onClick={() => this.setState({ currentPage: currentPage + 1 })}
      disabled={currentPage === Math.ceil(filteredStock.length / itemsPerPage)}className="delete2">Next</button>
    </div>
   </div>;
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
