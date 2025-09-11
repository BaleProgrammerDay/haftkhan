import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NotificationProvider } from "./context/Notification.tsx";
import Messanger from "./pages/khan-7/messenger/Messanger.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <NotificationProvider>
    <App />
    {/* <Messanger /> */}
  </NotificationProvider>
  // </React.StrictMode>
);
