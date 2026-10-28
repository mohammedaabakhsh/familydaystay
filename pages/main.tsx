import React from "react";
import { createRoot } from "react-dom/client";
import Experience from "../app/experience";
import "../app/globals.css";
import "../app/app-design.css";

// The same application component used by the Sites/Vinext entry point.
createRoot(document.getElementById("root")!).render(<Experience />);
