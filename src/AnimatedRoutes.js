import React, { createRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Product from "./Components/Product";
import Sale from "./Components/Sale";
import Stock from "./Components/Stock";
import Dashboard from "./Components/Dashboard";
import Logout from "./Components/Logout";
import StaffCreate from "./Components/StaffCreate";
import StaffUpdate from "./Components/StaffUpdate";
import SaleDetails from "./Components/SaleDetails";

const Page = ({ title }) => (
  <div className="page-content">
    <h1>{title}</h1>
    <p>Welcome to the {title} page!</p>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  // Create a ref for CSSTransition
  const nodeRef = createRef();

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.pathname}
        classNames="fade"
        timeout={400}
        nodeRef={nodeRef} // Use nodeRef
      >
        <div ref={nodeRef}>
          <Routes location={location}>
            <Route path="/product" element={<Product />} />
            <Route path="/sale" element={<Sale />} />
            <Route path="/saledetails" element={<SaleDetails />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staffcreate" element={<StaffCreate />} />
            <Route path="/staffupdate" element={<StaffUpdate />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default AnimatedRoutes;
