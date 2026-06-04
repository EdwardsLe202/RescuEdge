"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ToastProvider.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastStyle={{
        backgroundColor: "#FFFFFF",
        color: "#1F2937",
        borderRadius: "12px",
        padding: "16px 20px",
        fontSize: "15px",
        fontWeight: "500",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    />
  );
}
