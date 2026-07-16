
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { BrowserRouter } from "react-router-dom";
// import { store } from "./redux/store.js";
// import { Provider } from "react-redux";
// import { Toaster } from "react-hot-toast";


// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <Provider store={store}>
//       <BrowserRouter>
//         <App />
//         <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
//       </BrowserRouter>
//     </Provider>
//   </StrictMode>
// );



import React, { StrictMode} from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import "./chartConfig.js";
import whyDidYouRenderModule from "@welldone-software/why-did-you-render";
const toastOptions = { duration: 3000 };
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext.jsx";

// why-did-you-render setup
if (import.meta.env.DEV) {
  whyDidYouRenderModule(React, { trackAllPureComponents: true,
   });
}
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <HelmetProvider>
          <BrowserRouter>
            <App />
            <Toaster position="top-right" toastOptions={toastOptions} />
          </BrowserRouter>
        </HelmetProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
