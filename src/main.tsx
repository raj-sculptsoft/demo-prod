import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import Providers from "./components/core/providers.tsx";
import Sidebar from "./components/layout/sidebar.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import "./index.css";

// Renders the app inside the root element
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <Providers>
      <Toaster /> {/* Displays toast notifications */}
      <Sidebar />
      <main className="w-full px-3">
        <App />
      </main>
    </Providers>
  </BrowserRouter>,
  // </StrictMode>,
);
