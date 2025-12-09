import React, { Component } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../Css/Sale.css";

class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      saleItems: [],
      customerName: "",
      mobileNo:"",
      selectedProduct: "",
      quantity: "",
      totalAmount: 0,
      showInvoiceModal: false
    };
    this.productApi = "https://localhost:7234/api/Sales/Product";
    this.createInvoiceApi = "https://localhost:7234/api/Sales/Sales";
  }

  componentDidMount() {
    this.loadProducts();
   
  }

  loadProducts = () => {
  axios.get(this.productApi)
    .then((res) => {
      // Extract the $values array safely
      const productsArray = Array.isArray(res.data.$values) ? res.data.$values : [];
      this.setState({ products: productsArray });
    })
    .catch((err) => console.error(err));
};

   addItem = () => {
    const { selectedProduct, quantity, products, saleItems } = this.state;
    if (!selectedProduct || !quantity) return alert("Select product & quantity");
    const product = products.find((p) => p.productID == selectedProduct);
    const newItem = {
      productID: product.productID,
      productName: product.productName,
      productPrice: product.productPrice,
      quantity: parseInt(quantity),
      totalAmount: product.productPrice * quantity
    };
    const updated = [...saleItems, newItem];
    const totalAmount = updated.reduce((s, i) => s + i.totalAmount, 0);
    this.setState({saleItems: updated,totalAmount,selectedProduct: "", quantity: ""});
  };

  removeItem = (index) => {
    const updated = [...this.state.saleItems];
    updated.splice(index, 1);
    const totalAmount = updated.reduce((s, i) => s + i.totalAmount, 0);
    this.setState({ saleItems: updated, totalAmount });
  };

  saveInvoice = () => {
    if (this.state.saleItems.length === 0)
      return alert("Add items before saving");
    const data = {
      customerName: this.state.customerName,
      mobileNo:this.state.mobileNo,
      totalAmount:this.state.totalAmount,
      salesDetails: this.state.saleItems.map((i) => ({
        productID: i.productID,
        productPrice:i.productPrice,
        quantity: i.quantity,
        totalAmount:i.totalAmount,
        productName:i.productName    
      }))
    };
    axios.post(this.createInvoiceApi, data).then(() => {
      alert("Purchase Done!");
      this.setState({customerName: "",mobileNo:"",saleItems: [],totalAmount: 0});
      
    });
  };

 formatDate = (dateString) => {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`; // for input[type=date] value
  };
  render() {
    const {saleItems} = this.state;

    return (
        <div style={{ width: "87%", margin: "auto", marginTop: "40px",marginLeft:"140px" }}>
        <div style={{ marginTop: 20, padding: 20, border: "4px solid #ccc", borderRadius: 10 }}>
        <h2 className="title">🛒 MMS Supert Mart Billing</h2>
        {/* ADD INVOICE CARD */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Customer Name:</label>
              <input className="input-field" value={this.state.customerName} 
               onChange={(e) => this.setState({ customerName: e.target.value })}/> 
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Customer mobileNo:</label>
              <input className="input-field" value={this.state.mobileNo}
              onChange={(e) => this.setState({ mobileNo: e.target.value })}/>
            </div>      
          </div>    
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>  
              <label>Product:</label>
              <select className="input-field" value={this.state.selectedProduct} 
                 onChange={(e) => this.setState({ selectedProduct: e.target.value })}>
               <option value="">Select Product</option>
                 {Array.isArray(this.state.products) && this.state.products.map((p) => ( 
               <option key={p.productID} value={p.productID}>{p.productName} (₹{p.productPrice})
               </option>))}
              </select>
            </div>
     
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Quantity:</label>
              <input type="number" className="input-field" value={this.state.quantity}
              onChange={(e) => this.setState({ quantity: e.target.value })}/>          
            </div>
          </div>  
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <button className="delete-btn" onClick={this.addItem}>Add Product</button>
           </div>
           
          {/* Items Table */}
            <table className='staff-table' style={{marginTop:"20px"}}>
             <thead className='staff-table td'>
           <tr className='staff-table th' style={{ textAlign: "center" }} >
                <th>ProductId</th><th>Product Name</th><th>Quantity</th><th>ProductPrice</th><th>Amount</th><th></th>
              </tr>
            </thead>
             <tbody style={{ textAlign: "center" }}>
              {saleItems.map((i, idx) => (
                <tr key={idx}>
                  <td>{i.productID}</td>
                  <td>{i.productName}</td>
                  <td>{i.quantity}</td>
                  <td>₹{i.productPrice}</td>
                  <td>₹{i.totalAmount}</td>
                  <td><button className="delete-btn" onClick={() => this.removeItem(idx)}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
           <div className="action"> 
          <h3 className="title1">Total Amount:{this.state.totalAmount}</h3>
          <button className="save1-btn" onClick={this.saveInvoice}>Save Purchase</button>
          </div>
        </div>
 </div>
    );
  }
}

export default Sales;
