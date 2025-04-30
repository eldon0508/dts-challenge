import "src/global.css";

import { Router } from "src/routes/sections";

import { useScrollToTop } from "src/hooks/use-scroll-to-top";

import { ThemeProvider } from "src/theme/theme-provider";
import { AlertProvider } from "./components/alert/AlertContext";

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <AlertProvider>
        <Router />
      </AlertProvider>
    </ThemeProvider>
  );
}
