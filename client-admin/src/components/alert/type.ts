export interface AlertProps {
  title: string;
  type: "success" | "info" | "warning" | "error";
  context: string;
}

export interface AlertContextType {
  alert: AlertProps | null;
  setAlert: (alert: AlertProps | null) => void;
}
