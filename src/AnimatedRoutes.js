import React, {  useRef  } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Product from "./Components/Product";
import Sale from "./Components/Sale";
import Stock from "./Components/Stock";
import Dashboard from "./Components/Dashboard";
import Logout from "./Components/Logout";
import LoginPage from "./Components/Loginpage";
import StaffCreate from "./Components/StaffCreate";
import StaffUpdate from "./Components/StaffUpdate";
import SaleDetails from "./Components/SaleDetails";
const AnimatedRoutes = () => {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.pathname}
        classNames="fade"
        timeout={400}
        nodeRef={nodeRef}
        unmountOnExit
      >
        <div ref={nodeRef} className="route-wrapper">
          <Routes location={location}>
             <Route path="/" element={<LoginPage />} /> 
             <Route path="/product" element={<Product />} />
             <Route path="/logout" element={<Logout />} />
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