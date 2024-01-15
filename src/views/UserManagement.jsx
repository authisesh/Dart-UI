import React, { useState, useEffect } from "react";
import { Button, Container, Stack } from "@mui/material";
import { Header } from "../components/Header";
import axios from "axios";
import { Config } from "../config";
import { Table } from "../components/Table";
import { Modal } from "../components/Modal";
import { BackButton } from "../components/BackButton";

const UserManagement = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [fromOptions, setFromOptions] = useState([]);
  const [rows, setRows] = useState([]);
  const [rowToEdit, setRowToEdit] = useState(null);

  const handleDeleteRow = (targetIndex) => {
    // setRows(rows.filter((_, idx) => idx !== targetIndex));

    const API_URL = `${Config.VITE_API_URL}/v1/user/deleteUser/${targetIndex}`;
    axios({
      method: "DELETE",
      url: API_URL,
    })
      .then((response) => {
        console.log("response ", JSON.stringify(response.data));
        setRows(rows.filter((row) => row.id !== targetIndex));
      })
      .catch((error) => {
        console.log("error >>>>>>>>>>>>>: " + error);
      });
  };

  const handleEditRow = (idx) => {
    setRowToEdit(idx);

    setModalOpen(true);
  };

  const handleSubmit = (newRow) => {
    // rowToEdit === null
    //   ? setRows((rows) => [...rows, newRow])
    //   : setRows((rows) =>
    //       rows.map((currRow, idx) => {
    //         if (idx !== rowToEdit) return currRow;

    //         return { newRow };
    //       })
    //     );

    let API_URL = `${Config.VITE_API_URL}/v1/user/addUser`;
    let onDone = null;
    let method = "POST";
    if (rowToEdit === null) {
      onDone = (newRow) => {
        setRows((rows) => [...rows, newRow]);
      };
    } else {
      API_URL = `${Config.VITE_API_URL}/v1/user/editUser`;
      method = "PUT";
      newRow = {
        userId: rowToEdit,
        ...newRow,
      };
      onDone = (newRow) => {
        setRows((rows) =>
          rows.map((currRow, idx) => {
            if (idx !== rowToEdit) return currRow;

            return newRow;
          })
        );
      };
    }

    axios({
      method,
      url: API_URL,
      headers: { "Access-Control-Allow-Origin": "*" },
      data: {
        ...newRow,
        tables: JSON.stringify(newRow.tables),
      },
    })
      .then((response) => {
        console.log("response >>>>>>>>>", JSON.stringify(response.data));
        onDone?.({
          ...response.data,
          tables: JSON.parse(response.data.tables),
        });
      })
      .catch((error) => {
        console.log("error >>>>>>>>>>>>>: " + error);
      });
  };

  useEffect(() => {
    const API_URL = `${Config.VITE_API_URL}/v1/user/loadUsers`;

    axios
      .get(API_URL)
      .then((response) => {
        console.log("response Table Load User:", JSON.stringify(response.data));
        const rows = response.data.map((data) => {
          return { ...data.body, tables: JSON.parse(data.body.tables) };
        });
        setRows(rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setRows([]);
  }, []);

  useEffect(() => {
    // async function fetchTableData() {
    const API_URL = `${Config.VITE_API_URL}/v1/user/loadTables`;

    // Call the API
    axios
      .get(API_URL)
      .then((response) => {
        const listArr = response.data.map((tab) => tab.body.tableName);
        setFromOptions(listArr);
      })
      .catch((error) => {
        //setAlloptions(response.data);
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Stack style={{ height: "100vh" }}>
      <Header />
      <Stack gap={3} paddingY={3} marginTop={11}>
        <Container>
          <Stack gap={3}>
            <BackButton />
            <Stack alignItems={"center"} gap={3}>
              <Table
                rows={rows}
                deleteRow={handleDeleteRow}
                editRow={handleEditRow}
              />
              <Button
                onClick={() => setModalOpen(true)}
                color="primary"
                variant="contained"
                sx={{ width: "min-content" }}
              >
                Add
              </Button>
              {modalOpen && (
                <Modal
                  open={modalOpen}
                  fromOptions={fromOptions}
                  closeModal={() => {
                    setModalOpen(false);
                    setRowToEdit(null);
                  }}
                  onSubmit={handleSubmit}
                  defaultValue={rowToEdit !== null && rows[rowToEdit]}
                />
              )}
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </Stack>
  );
};
export default UserManagement;
