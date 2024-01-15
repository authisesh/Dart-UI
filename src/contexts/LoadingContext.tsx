import React from "react";
import { FullScreenLoader } from "../components/FullScreenLoader";

interface ContextType {
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext = React.createContext<ContextType | undefined>({});

interface LoadingProviderProps {
  children: any;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [loading, setLoading] = React.useState(false);
  return (
    <LoadingContext.Provider value={{ setLoading }}>
      <FullScreenLoader loading={loading} />
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingContext = () => {
  const context = React.useContext(LoadingContext);
  return context;
};
