import React, { Component } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReceiptIcon from '@mui/icons-material/Receipt';
import html2canvas from "html2canvas";
import "../Css/Saledetail.css";

class SaleDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      salesList: [],
      saleItems: [],
      customerName: "",
       filterText: "",
      mobileNo:"",
      selectedProduct: "",
      quantity: "",
      totalAmount: 0,
       selectedInvoice: null,
      selectedInvoiceItems: [], // ✅ initialize as array
      showInvoiceModal: false,
    };
    this.salesListApi = "http://localhost:1514/api/Sales/getall";
    this.createInvoiceApi = "http://localhost:1514/api/Sales/Sales";
    this.saleidApi="http://localhost:1514/api/Sales/Getsale?Salesid";
  }

  componentDidMount() {
    this.loadProducts();
    this.loadSales();
  }

    loadProducts = () => {
    axios.get("http://localhost:1514/api/Sales/Product")
      .then(res => {
        this.setState({ products: res.data });
      })
      .catch(err => console.error(err));
  };
  loadSales = () => {
    axios.get("http://localhost:1514/api/Sales/getall")
      .then(res => {
        this.setState({ salesList: res.data });
      })
      .catch(err => console.error(err));
  };
viewInvoice = (sale)  => {
    axios.get(`http://localhost:1514/api/Sales/Getsale?Salesid=${sale.salesID}`)
    .then(res => {
       const details = res.data.salesDetails;
       this.setState({
        selectedInvoiceItems:details,
        selectedInvoice: sale,
        showInvoiceModal: true
      });
      })
      .catch(err => console.error(err));
  };


  addItem = () => {
    const { selectedProduct, quantity, products, saleItems } = this.state;
    if (!selectedProduct || !quantity) return alert("Select product & quantity");
    const product = products.find((p) => p.productID == selectedProduct);
    const newItem = {
      productID: product.productID,
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

 formatDate = (dateString) => {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`; // for input[type=date] value
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
  formatDate = (dateString) => {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`; // for input[type=date] value
  };
deleteSale = (id) => {
    if (!window.confirm("Are you sure you want to delete this Sales?")) return;
    axios.delete(`http://localhost:1514/api/Sales/delete?id=${id}`).then(() => {
      alert("Sales deleted successfully");
      this.loadSales();
    });
  };
  render() {
    const {saleItems,salesList,selectedInvoice,showInvoiceModal,filterText} = this.state;
    const filteredStock = salesList.filter((s) => {
    const filter = filterText.toLowerCase();
    const customerName = s.customerName ? s.customerName.toLowerCase() : "";
    return customerName.includes(filter) || s.salesID.toString().includes(filter)|| s.totalAmount.toString().includes(filter);
  });
    return (
     <div style={{ width: "60%", margin: "auto", marginTop: "40px",marginLeft:"300px" }}>
        <div style={{ marginTop: 20, padding: 20, border: "4px solid #ccc", borderRadius: 10 }}>
        <h2 className="title"> Sales History</h2>
         <div className="actions">
          <input type="text"placeholder="Filter by Customer Name or ID"value={this.state.filterText}
         onChange={(e) => this.setState({ filterText: e.target.value })}/>
       
         </div>
       <table className='staff-table'>
          <thead className='staff-table td'>
            <tr className='staff-table th' style={{ textAlign: "center" }} >
              <th>S.No</th>
              <th>SalesID</th>
              <th>Customer Name</th>
              <th>Purchase Amount</th>
              <th>Purchase Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
              {filteredStock.map((s, index) => (      
                   <tr key={s.salesID}>
                     <td>{index + 1}</td>
                <td>{s.salesID}</td>
                <td>{s.customerName}</td>
                <td>₹{s.totalAmount}</td>
                <td>{this.formatDate(s.purchaseDate)}</td>
                <td>
                   <Button color="danger"size="large" onClick={() => this.viewInvoice(s)} startIcon={<ReceiptLongIcon  />}/>
                  <Button color="danger"size="laarge" onClick={() => this.deleteProduct(s.salesID)} startIcon={<DeleteIcon />}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* INVOICE MODAL */}
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
            </div>
            </div>
          </div>
        )}
      </div>
      </div>
    );
  }
}

export default SaleDetails;
