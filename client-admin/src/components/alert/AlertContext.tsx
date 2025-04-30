import React, { useState, useContext, createContext } from "react";

import { Alert, Snackbar, AlertTitle } from "@mui/material";

import { AlertContextType, AlertProps } from "./type";

const AlertContext = createContext<AlertContextType>({
  alert: null,
  setAlert: () => {},
});

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<AlertProps | null>(null);

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
      {alert && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={() => setAlert(null)}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
        >
          <Alert severity={alert.type} onClose={() => setAlert(null)} sx={{ width: "100%" }}>
            <AlertTitle>{alert.title}</AlertTitle>
            {alert.context}
          </Alert>
        </Snackbar>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
