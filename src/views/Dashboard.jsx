import React from "react";
import { useNavigate } from "react-router-dom";
import usernamagement from "../assets/user-management.jpg";
import report from "../assets/report.jpg";
import data from "../assets/data.jpg";
import { Header } from "../components/Header";
import { Container, Stack } from "@mui/material";
import { BackButton } from "../components/BackButton";
const Dashboard = (props) => {
  const navigate = useNavigate();

  const moveT24DataFetch = () => {
    navigate("/T24DataFetch");
  };
  const moveToReportView = () => {
    navigate("/AnalyticsDashBoard");
  };
  const moveToUserMgmt = () => {
    navigate("/UserManagement");
  };

  return (
    <Stack style={{ height: "100vh" }}>
      <Header />

      <Container sx={{ marginTop: 11, padding: 3 }}>
        <Stack gap={3}>
          <BackButton />
          <Stack direction={"row"} justifyContent={"center"}>
            <div className="card card-1">
              <div className="top">
                <img
                  src={data}
                  alt="Data Generator"
                  onClick={moveT24DataFetch}
                />
              </div>
              <div className="bottom">
                <p>Data Generator</p>
              </div>
            </div>

            <div className="card card-1">
              <div className="top">
                <img
                  src={report}
                  alt="Report Dashboard"
                  onClick={moveToReportView}
                />
              </div>
              <div className="bottom">
                <p>Report Dashboard</p>
              </div>
            </div>
            <div className="card card-1">
              <div className="top">
                <img
                  src={usernamagement}
                  alt="material ui"
                  onClick={moveToUserMgmt}
                />
              </div>
              <div className="bottom">
                <p>User Management</p>
              </div>
            </div>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default Dashboard;
