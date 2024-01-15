import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AnalyticsDashBoard from "./AnalyticsDashBoard";
import T24DataFetch from "./T24DataFetch";
import UserManagement from "./UserManagement";

import "../css/App.css";
import { LoadingProvider } from "../contexts/LoadingContext";
import { AuthProvider } from "../contexts/AuthContext";

const App = () => {
  return (
    <React.Fragment>

      <LoadingProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/T24DataFetch" element={<T24DataFetch />} />
              <Route
                path="/AnalyticsDashBoard"
                element={<AnalyticsDashBoard />}
              />
              <Route
                path="/UserManagement"
                element={<UserManagement />}
              />
            </Routes>
          </Router>
        </AuthProvider>
      </LoadingProvider>
    </React.Fragment>
  );
};

export default App;
