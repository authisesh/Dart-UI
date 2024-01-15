import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/App.css";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import dataUpload from "../service/GenerateApiData.tsx";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  FormHelperText,
  FormLabel,
  Input,
  OutlinedInput,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import leftImage from "../assets/logo-final@2x.png";
import { East, West } from "@mui/icons-material";
import { Config } from "../config";
import { Header } from "../components/Header";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { useLoadingContext } from "../contexts/LoadingContext";
import { BackButton } from "../components/BackButton";
import { EventSelector } from "./T24DataFetch/components/EventSelector";

const T24DataFetch = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    // async function fetchTableData() {
    const API_URL = `${Config.VITE_API_URL}/v1/user/loadTables`;

    // Call the API
    axios
      .get(API_URL)
      .then((response) => {
        console.log(
          "response Table :",
          JSON.stringify(response.data[0].body.tableName)
        );

        const listArr = response.data.map((tab) => [tab.body.tableName]);
        console.log(">>>: " + listArr);
        setAlloptions(listArr);
      })
      .catch((error) => {
        //setAlloptions(response.data);
        console.error("Error fetching data:", error);
      });
    //}
    // fetchTableData();
  }, []);

  const [database, setDatabase] = useState("SQL Server");
  const [otherDatabase, setotherDatabase] = useState("Please Select");
  const [uploadStatus, setUploadStatus] = useState("");
  const [dburl, setdburl] = useState([]);

  const [allOptions, setAlloptions] = useState([]);

  const [fromOptions, setFromOptions] = useState([]);

  const [toOptions, setToOptions] = useState([]);
  const [selectedFromOptions, setSelectedFromOptions] = useState([]);
  const [selectedToOptions, setSelectedToOptions] = useState([]);
   const [error, setError] = useState("");


  const [changeButton, setChangeButton] = useState("DATABASE");
  const { setLoading } = useLoadingContext();
  const [schedulePopoverAnchorEle, setSchedulePopoverAnchorEle] = useState(null);

  const handleChange = (event) => {
    setDatabase(event.target.value);
    setdburl(event.target.value);
    setChangeButton("DATABASE");
  };

  const handleOtherDbChange = (event) => {
    setotherDatabase(event.target.value);
    setChangeButton("FILE");
  };

  async function fetchData() {
    setLoading(true);
    console.log(">>", toOptions);
    try {
      const dateToFetch = {
        tables: toOptions,
        dbConnectionURl: database,
      };

      console.log("In " + dateToFetch.tables);
      const uploadStatus = await dataUpload(dateToFetch);
      console.log("uploadStatus  >>>>>>>" + uploadStatus);
      if (uploadStatus === "SUCCESS") {
        setUploadStatus("Data Upload Success");
        console.log("hi Status >>>>>>>");

        setLoading(false);
      }
    } catch (e) {
      setUploadStatus("Error In Data Upload");
      console.log("Failure e >", e);
    }
  }
  // function downloadFile() {
  //   const API_URL = "http://localhost:8082/download-file?table=" + toOptions;

  //   // Call the API
  //   axios
  //     .get(API_URL)
  //     .then((response) => {
  //       console.log("response Table :", JSON.stringify(response.data));
  //       setAlloptions(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }
  function downloadFile() {
    // Assuming toOptions needs to be URL-encoded
    setError("");
    if(toOptions.length == 0){
         setError("Please select atleast one table!");
         return;
    }
    setLoading(true);
    const encodedToOptions = encodeURIComponent(toOptions);
    const API_URL = `${Config.VITE_API_URL}/download-file?table=${encodedToOptions}`;

    // Call the API
    axios
      .get(API_URL, { responseType: "blob" }) // Set responseType to 'blob' for binary data
      .then((response) => {
        // Handle the downloaded file data here, e.g., save it to a local file or display it
        console.log("File downloaded successfully:", response);

        // Example: Save the file using FileSaver.js
        import("file-saver").then((FileSaver) => {
          FileSaver.saveAs(response.data, toOptions+".xlsx");
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    setFromOptions(allOptions);
  }, [allOptions]);

  const analyticsDash = () => {
    navigate("/AnalyticsDashBoard");
  };

  return (
    <Stack style={{ height: "100vh" }}>
      <Header />

      <Container sx={{ marginTop: 11, padding: 3 }}>
        <BackButton />
        <Stack width={"100%"} maxWidth={1024} marginX={"auto"} gap={2}>
          <Stack alignItems={"center"}>
            <Typography variant="h5">Core Data Reader</Typography>
          </Stack>
          <Card
            style={{
              width: "100%",
              padding: "70px 50px",
              borderRadius: 50,
              backgroundColor: "#f2eeee",
            }}
          >
            <Stack gap={2}>
               <Stack>
                          {error !== "" && (
                            <div class="alert error">
                              <input type="checkbox" id="alert1" />
                              <label class="close" title="close" for="alert1">
                                <i class="icon-remove"></i>
                              </label>
                              <p class="inner">
                                <strong>Error!</strong> {error}
                              </p>
                            </div>
                          )}
                        </Stack>
              <Stack>
                <FormControl style={{ flex: 1 }}>
                  <FormLabel>Select Tables</FormLabel>
                  <Autocomplete
                    multiple
                    variant="outlined"
                    options={fromOptions}
                    value={toOptions}
                    onChange={(e, values) => {
                      setToOptions(values);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: 20,
                      fieldset: {
                        borderRadius: 20,
                      },
                    }}
                  />
                </FormControl>
              </Stack>

              <Stack direction={"row"} gap={3}>
                <FormControl style={{ flex: 1 }}>
                  <FormLabel>Database Type:</FormLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    variant="outlined"
                    value={database}
                    onChange={handleChange}
                    style={{
                      borderRadius: 20,
                      backgroundColor: "white",
                    }}
                  >
                    <MenuItem value="jdbc:h2:tcp://localhost:8021/mem:testdb;user=sa;password=">
                      H2
                    </MenuItem>
                    <MenuItem value="jdbc:sybase://localhost:5000/mydb">
                      Sybase
                    </MenuItem>
                    <MenuItem
                      value="jdbc:sqlserver://192.168.240.129:1433;databasename=TRRDB;user=eshuser;password=password;integratedSecurity=false;encrypt=false;trustServerCertificate=true;
"
                    >
                      SQL Server
                    </MenuItem>
                    <MenuItem value="jdbc:oracle:thin:@localhost:1521:xe">
                      Oracle
                    </MenuItem>
                  </Select>
                </FormControl>
                <FormControl style={{ flex: 1 }}>
                  <FormLabel>Other Type</FormLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    variant="outlined"
                    value={otherDatabase}
                    onChange={handleOtherDbChange}
                    style={{
                      borderRadius: 20,
                      backgroundColor: "white",
                    }}
                  >
                    <MenuItem value="Please Select">Please Select</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                  </Select>
                  <FormHelperText />
                </FormControl>
              </Stack>

              <Stack direction={"row"} gap={3}>
                <FormControl style={{ flex: 1 }}>
                  <FormLabel>Destination Database URL</FormLabel>
                  <OutlinedInput
                    type={"text"}
                    value={dburl}
                    style={{
                      borderRadius: 20,
                      backgroundColor: "white",
                    }}
                  />
                  <FormHelperText />
                </FormControl>
                <Box style={{ flex: 1 }}></Box>
              </Stack>

              <Stack direction={"row"} justifyContent={"space-evenly"}>
                {changeButton === "DATABASE" ? (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={fetchData}
                    style={{
                      borderRadius: 15,
                    }}
                  >
                    Generate API Data
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={downloadFile}
                    style={{
                      borderRadius: 15,
                    }}
                  >
                    Download {otherDatabase}
                  </Button>
                )}

                <Button
                  variant="contained"
                  color="success"
                  onClick={(e) => setSchedulePopoverAnchorEle(e.currentTarget)}
                  style={{
                    borderRadius: 15,
                  }}
                >
                  Schedule API Data
                </Button>
                <Popover
                  anchorEl={schedulePopoverAnchorEle}
                  onClose={(e) => setSchedulePopoverAnchorEle(null)}
                  open={schedulePopoverAnchorEle}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <EventSelector onSubmit={(data) => {
                    setSchedulePopoverAnchorEle(null);
                    console.log(data)
                    }}/>
                </Popover>
                <Button
                  variant="contained"
                  color="success"
                  onClick={analyticsDash}
                  style={{
                    borderRadius: 15,
                  }}
                >
                  View Analytics DashBoard
                </Button>
              </Stack>
            </Stack>

            <div>
            {uploadStatus !== "" && (
                            <div class="alert success">
                              <input type="checkbox" id="alert1" />
                              <label class="close" title="close" for="alert1">
                                <i class="icon-remove"></i>
                              </label>
                              <p class="inner">
                                <strong>Success!</strong> {uploadStatus}
                              </p>
                            </div>
                          )}
            </div>
          </Card>
        </Stack>
      </Container>
    </Stack>
  );
};

export default T24DataFetch;
