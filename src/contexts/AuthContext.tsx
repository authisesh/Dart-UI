import React from "react";

interface ContextType {
    setAuth?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = React.createContext<ContextType | undefined>({});

interface AuthProviderProps {
    children: any;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [authUser, setAuthUser] = React.useState({});

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = React.useContext(AuthContext);
    return context;
};
