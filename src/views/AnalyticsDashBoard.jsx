import React, { useState, useEffect } from "react";
import { Pie, Doughnut, Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";
import { DataGrid } from "@mui/x-data-grid";
import { Select, MenuItem, Container, Stack, Typography } from "@mui/material";
import { Header } from "../components/Header";
import { Config } from "../config";
import { useAuthContext } from "../contexts/AuthContext";
import { BackButton } from "../components/BackButton";
import * as XLSX from "xlsx";

const AnalyticsDashBoard = () => {
  const [tableCount, setTableCount] = useState([]);
  const [fileTableName, setFileTableName] = useState("");
  const [tableRecords, settableRecords] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [notAllowed, setNotAllowed] = useState(null);
  const { authUser } = useAuthContext();

  const [selectedDownloadOption, setSelectedDownloadOption] = useState("Select an option");

  const [tableData, setTableData] = useState({
    labels: [],
    datasets: [
      {
        label: "T24 Tabel Datas",
        data: [],
      },
    ],
    options: {},
  });

  useEffect(() => {
    const API_URL = `${Config.VITE_API_URL}/tabledata`;

    axios
      .get(API_URL)
      .then((response) => {
        console.log("response Table:", JSON.stringify(response.data));
        const data = response.data.tableDataList;

        setTableCount(data);

        // Update tableData here after receiving the data
        setTableData({
          labels: data.map((item) => item.tableName),
          datasets: [
            {
              label: "T24 Table Data",
              data: data.map((item) => item.dataCount),
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [refresh]);

  const handleChartClick = (event, chartElements, tableName) => {
    if (
      authUser.roleID != 1 &&
      (!authUser.tables ||
        !JSON.parse(authUser.tables).includes(tableName.replaceAll("_", ".")))
    ) {
      setNotAllowed(true);
      return;
    }
    setFileTableName(tableName);
    setNotAllowed(false);
    if (chartElements.length > 0) {
      const clickedElementIndex = chartElements[0]._index;
      const label = tableData.labels[clickedElementIndex];
      console.log("Clicked on:", label);
      console.log("Table Name:", tableName); // Access tableName here

      const API_URL =
        `${Config.VITE_API_URL}/top10results?tableName=` + tableName;

      axios
        .get(API_URL)
        .then((response) => {
          console.log("response Table:", JSON.stringify(response.data));
          const data = response.data;
          console.log(JSON.stringify(data));
          settableRecords(data);
          console.log("........." + tableRecords);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  const options = ["Excel", "CSV"];
  const handleChange = (event) => {
    setSelectedDownloadOption(event.target.value);
    if (event.target.value == "Excel") {
      exportToExcel(tableRecords, fileTableName);
    } else if (event.target.value == "CSV") {
      downloadCSV(tableRecords, fileTableName + ".csv");
    }
  };
  function convertToCSV(data) {
    // Extract column headers from the first object in the data array
    const headers = Object.keys(data[0]);

    // Convert the data to CSV format
    const csv = [
      headers.join(","),
      ...data.map((row) => headers.map((field) => row[field]).join(",")),
    ].join("\n");

    return csv;
  }
  function downloadCSV(data, filename) {
    const csv = convertToCSV(data);

    // Create a blob with the CSV data
    const blob = new Blob([csv], { type: "text/csv" });

    // Create a download link
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;

    // Trigger the download
    a.click();
  }
  function exportToExcel(data, filename) {
    // Create a new worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Save the workbook to a file
    XLSX.writeFile(wb, filename + ".xlsx");
  }

  const columns =
    tableRecords.length > 0
      ? Object.keys(tableRecords[0]).map((key) => ({
          field: key,
          headerName: key,
          width: 150,
          editable: true,
        }))
      : [];

  const rows =
    tableRecords.length > 0
      ? tableRecords.map((item, index) => ({
          id: index + 1,
          ...item, // Spread the object's properties into the row object
        }))
      : [];

  return (
    <Stack style={{ height: "100vh" }} gap={3}>
      <Header />

      <Container sx={{ marginTop: 11, padding: 3 }}>
        <Stack gap={3}>
          <BackButton />
          <Stack alignItems={"center"}>
            <Typography variant="h5">Analytics DashBoard</Typography>
          </Stack>
          <Stack direction={"row"} justifyContent={"center"}>
            <Stack style={{ width: 400, height: 400 }} gap={0}>
              <Pie
                data={tableData}
                options={{
                  onClick: (event, chartElements) =>
                    handleChartClick(
                      event,
                      chartElements,
                      tableData.labels[chartElements[0].index]
                    ),
                }}
              />
            </Stack>
            <Stack style={{ width: 400, height: 400 }} gap={2}>
              <Doughnut
                data={tableData}
                options={{
                  onClick: (event, chartElements) =>
                    handleChartClick(
                      event,
                      chartElements,
                      tableData.labels[chartElements[0].index]
                    ),
                }}
              />
            </Stack>
          </Stack>

          <Stack direction={"row"} justifyContent={"center"} gap={2}>
            <Stack style={{ width: 400 }}>
              <Bar
                data={tableData}
                options={{
                  onClick: (event, chartElements) =>
                    handleChartClick(
                      event,
                      chartElements,
                      tableData.labels[chartElements[0].index]
                    ),
                }}
              />
            </Stack>
            <Stack style={{ width: 400 }} justifyContent={"center"}>
              <DataGrid
                rows={tableData.labels.map((label, index) => {
                  return {
                    id: index,
                    "Table name": label,
                    "Data count": JSON.stringify(
                      tableData.datasets[0].data[index]
                    ),
                  };
                })}
                columns={[
                  { field: "Table name", flex: 1 },
                  { field: "Data count", flex: 1 },
                ]}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                sx={{
                  ".MuiDataGrid-columnHeaders *": {
                    backgroundColor: "#bccdfc",
                  },
                  "& .MuiDataGrid-row:nth-child(even)": {
                    backgroundColor: "#eeeeee",
                  },
                }}
                showColumnVerticalBorder
                showCellVerticalBorder
              />
            </Stack>
          </Stack>
          <Stack
            style={{ marginLeft: "740px" }}
            justifyContent={"right"}
            alignItems={"right"}
          >
            <p nowrap>
              <b>Export to :</b>

              <Select
                name="options"
                onChange={handleChange}
                value={selectedDownloadOption}
                style={{
                  height: "30px",
                  padding: "5px",
                  fontSize: "14px",
                  width: "170px",
                  border: "3px solid #A6CBF3",
                }}
              >
                <MenuItem value="Select an option" >Select an option</MenuItem>
                {options.map((option) => (
                  <MenuItem value={option}>{option}</MenuItem>
                ))}
              </Select>
            </p>
          </Stack>
          <Stack justifyContent={"center"} alignItems={"center"}>
          <Stack> <h4>{fileTableName} </h4> <br/></Stack>
            <Stack sx={{ height: 400, width: "70%" }} justifyContent={"center"}>
              {notAllowed ? (
                <div class="alert error">
                  <input type="checkbox" id="alert1" />

                  <p class="inner">
                    <strong>Access Restricted</strong>
                  </p>
                </div>
              ) : (
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  disableRowSelectionOnClick
                  sx={{
                    ".MuiDataGrid-columnHeaders *": {
                      backgroundColor: "#bccdfc",
                    },
                    "& .MuiDataGrid-row:nth-child(even)": {
                      backgroundColor: "#eeeeee",
                    },
                  }}
                />
              )}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default AnalyticsDashBoard;
