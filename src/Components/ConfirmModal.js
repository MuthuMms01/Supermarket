import React, { Component } from "react";

import "../Css/ConfirmModal.css";

class ConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      message: "",
      onConfirm: null,
      onCancel: null,
    };
  }

  // Show the confirm modal
  open = (message, onConfirm, onCancel) => {
    this.setState({ show: true, message, onConfirm, onCancel });
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
    const { show, message } = this.state;
    if (!show) return null;

    return (
      <div className="confirm-modal-overlay">
        <div className="confirm-modal-box">
          <p>{message}</p>
          <div >
            <button className="btn btn-confirm" onClick={this.handleConfirm}>
              Yes
            </button>
            <button className="btn btn-cancel" onClick={this.handleCancel}>
              No
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmModal;
