import React, { Component } from "react";
import axios from "axios";
import CenteredAlert  from "./StylishAlertManager";
import "../Css/Sale.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import 'bootstrap/dist/css/bootstrap.min.css';

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
       selectedInvoice: null,
      selectedInvoiceItems: [],   
      showInvoiceModal: false
    };
     this.alertRef = React.createRef();
  }

  componentDidMount() {
    this.loadProducts();
   
  }

   loadProducts = () => {
    axios.get("http://localhost:1514/api/Sales/Product1")
      .then(res => {
        this.setState({ products: res.data });
      })
      .catch(err => console.error(err));
  };

   addItem = () => {
  const { selectedProduct, quantity, products, saleItems } = this.state;

  if (!selectedProduct || !quantity) {
    this.alertRef.current.showAlert("Select product & quantity", "warning");
    return;
  }

  const product = products.find((p) => p.productID == selectedProduct);

  // Check if product already exists in saleItems
  const exists = saleItems.some((item) => item.productID == product.productID);
  if (exists) {
    this.alertRef.current.showAlert("Product already added!", "error");
    return;
  }

  const newItem = {
    productID: product.productID,
    productName: product.productName,
    productPrice: product.productPrice,
    quantity: parseInt(quantity),
    totalAmount: product.productPrice * quantity
  };

  const updated = [...saleItems, newItem];

  // Calculate total amount
  const totalAmount = updated.reduce((s, i) => s + i.totalAmount, 0);

  // Update state
  this.setState({
    saleItems: updated,
    totalAmount,
    selectedProduct: "",
    quantity: ""
  });
};

  removeItem = (index) => {
    const updated = [...this.state.saleItems];
    updated.splice(index, 1);
    const totalAmount = updated.reduce((s, i) => s + i.totalAmount, 0);
    this.setState({ saleItems: updated, totalAmount });
  };
downloadPDF = () => {
  const input = document.getElementById("invoicePDF");
  
  html2canvas(input, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate image dimensions to fit PDF width
    const imgWidth = pageWidth - 20; // margin 10mm each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 10; // top margin
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);

    pdf.save("Invoice.pdf");
  });
};
  saveInvoice = () => {
  if (this.state.saleItems.length === 0) {
    this.alertRef.current.showAlert("Items not included","warning");
    return;
  }

  const data = {
    customerName: this.state.customerName,
    mobileNo: this.state.mobileNo,
    totalAmount: this.state.totalAmount,
    salesDetails: this.state.saleItems.map(i => ({
      productID: i.productID,
      productPrice: i.productPrice,
      quantity: i.quantity,
      totalAmount: i.totalAmount,
      productName: i.productName || "", // add if you have this field
    })),
  };

  axios.post("http://localhost:1514/api/Sales/Sales", data)
    .then(response => {
      console.log("POST response:", response.data);
      const savedSale = response.data;
this.alertRef.current.showAlert("New SalesID:", savedSale.salesID);

// Correct:
axios.get(`http://localhost:1514/api/Sales/Getsale?Salesid=${savedSale.salesID}`)
        .then(res => {
          
          const details = res.data.salesDetails;
        
          this.setState({
            selectedInvoice: res.data,
            selectedInvoiceItems: details,
            showInvoiceModal: true,
            // Reset input fields
            customerName: "",
            mobileNo: "",
            saleItems: [],
            totalAmount: 0,
          });
          this.alertRef.current.showAlert("Purchase Done!!")
          this.loadSales();
        })
        .catch(err => {
        
        });
    })
    .catch(err => {
      this.alertRef.current.showAlert("Failed to save the purchase");
    });
};

 formatDate = (dateString) => {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`; // for input[type=date] value
  };
  render() {
    const {saleItems,selectedInvoice,showInvoiceModal} = this.state;

    return (
        <div style={{ width: "65%", margin: "auto", marginTop: "40px",marginLeft:"310px" }}>
        <div style={{ marginTop: 20, padding: 20, border: "4px solid #ccc", borderRadius: 10 }}>
        <h2 className="title">🛒 MMS Supert Mart Billing 🛒</h2>
         <CenteredAlert ref={this.alertRef} />
        {/* ADD INVOICE CARD */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Customer Name:</label>
              <input className="input-field" value={this.state.customerName} placeholder="Enter Customername"
               onChange={(e) => this.setState({ customerName: e.target.value })}/> 
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label>Customer mobileNo:</label>
              <input
  type="text"
  className="input-field"
  value={this.state.mobileNo}
  maxLength={10}
  onChange={(e) => {
    // Remove any non-digit character
    const onlyNums = e.target.value.replace(/\D/g, "");
    this.setState({ mobileNo: onlyNums });
  }}
  placeholder="Enter 10-digit mobile number"
/>
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
            <div className="button-row" style={{ display: "flex",justifyContent: "flex-end" }}>
            <button className="delete2" onClick={this.addItem} >Add Items</button>
            <button  className="edit-btn"  onClick={() => window.location.reload()}>Reset</button>
           </div>
            
          {/* Items Table */}
            <table className='staff-table' style={{marginTop:"20px"}}>
             <thead className='staff-table td'>
           <tr className='staff-table th' style={{ textAlign: "center" }} >
             <th>S.No</th>
                <th>ProductId</th><th>Product Name</th>
                <th>Quantity</th><th>ProductPrice</th>
                <th>Amount</th><th></th>
              </tr>
            </thead>
             <tbody style={{ textAlign: "center" }}>
  {saleItems.map((i, idx) => (
    <tr key={idx}>
      <td>{idx + 1}</td>  {/* <-- Serial number */}
      <td>{i.productID}</td>
      <td>{i.productName}</td>
      <td>{i.quantity}</td>
      <td>₹{i.productPrice}</td>
      <td>₹{i.totalAmount}</td>
      <td>
        <button className="delete-btn" onClick={() => this.removeItem(idx)}>X</button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
           <div className="action"> 
          <h4 className="title2" >Total Amount:{this.state.totalAmount}</h4>
          <button className="delete1-btn"  onClick={this.saveInvoice}>Save Purchase</button>
          </div>
        </div>
        {showInvoiceModal && (
          <div className="modal">
            <div className="modal-content"style={{ width: "auto", height: "auto" }}>
              <div id="invoicePDF" >
                 <div style={{ textAlign: "center", marginBottom: 20 }}>
                 <img src="/logo.jpg" alt="Company Logo"style={{ width: 150, height: "auto" }}/>
                  </div>
                 <h2 style={{ marginTop:"-32px", textAlign:"center" }}>🛒 MMS SuperMart 🛒</h2>
                  <p><b >InvoiceNo:</b> {selectedInvoice.salesID}</p>
                  <p><b >Customer Name:</b> {selectedInvoice.customerName}</p>
                  <p><b>Customer MobileNo:</b> {selectedInvoice.mobileNo}</p>
                   <p><b>Purchase Date:</b> {this.formatDate(selectedInvoice.purchaseDate)}</p>
                   <table className='staff-table'>
          <thead className='staff-table td'>
                    <tr style={{ textAlign: "center" }}>
                     <th style={{ border: "1px solid #ccc", padding: 8 }}>S.No</th>
                     <th style={{ border: "1px solid #ccc", padding: 8 }}>ProductName</th>
                     <th style={{ border: "1px solid #ccc", padding: 8 }}>Quantity</th>
                     <th style={{ border: "1px solid #ccc", padding: 8 }}>Price</th>
                     <th style={{ border: "1px solid #ccc", padding: 8 }}>Amount</th>
                    </tr>
                  </thead>
                 <tbody style={{ textAlign: "center" }}>
                    {this.state.selectedInvoiceItems.map((i, idx) => (
                    <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{i.productName}</td>
                    <td>{i.quantity}</td>
                    <td>₹{i.productPrice}</td>
                    <td>₹{i.totalAmount}</td>
                    </tr>))}
                 </tbody>
              </table>
              <h4 style={{ textAlign: "right" }}>TotalAmount: ₹ {selectedInvoice.totalAmount}</h4>
            
              </div>
             <div className="button-row">
              <button className="delete3" onClick={this.downloadPDF}>Print</button>
              <button className="delete1" onClick={() => this.setState({ showInvoiceModal: false })}>Close</button>
            </div> </div>
          </div>
        )}
 </div>
 
    );
     
  }
}

export default Sales;
