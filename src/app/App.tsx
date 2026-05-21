import { RouterProvider } from "react-router-dom";
import { router } from "../app/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light" // ✅ white theme
        toastStyle={{
          backgroundColor: "#ffffff",
          color: "#111",
          borderRadius: "10px",
          border: "1px solid #eee"
        }}
      />
    </>
  );
}