import React, { createContext, useContext, useState, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
    action: null,
  });

  const showSnackbar = useCallback(
    (message, severity = "info", action = null) => {
      setSnackbar({ open: true, message, severity, action });
    },
    []
  );

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000} // Increase duration for undo
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        action={snackbar.action}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{ width: "100%", display: "flex", alignItems: "center" }}
          action={snackbar.action} // Ensure action is passed to Alert for visibility
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
