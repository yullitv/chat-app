import { createContext, useContext } from "react";

export const ToastContext = createContext({
  push: () => {},
});

// Хук, щоб зручно використовувати toast у будь-якому компоненті
export const useToast = () => useContext(ToastContext);
