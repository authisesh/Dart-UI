import React from "react";

import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";

import {
  Paper,
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
  Typography,
} from "@mui/material";

export const Table = ({ rows, deleteRow, editRow }) => {
  console.log("Inside Table : ", rows);
  return (
    <Stack width={"100%"} maxWidth={1024} marginX={"auto"} gap={2}>
      <Stack alignItems={"center"}>
        <Typography variant="h5">User Management</Typography>
      </Stack>

      <Stack>
        <TableContainer component={Paper} sx={{ maxWidth: 1200 }}>
          <MUITable sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow style={{ backgroundColor: "#bccdfc" }}>
                <TableCell style={{ fontSize: "1.5em" }}>Name</TableCell>
                <TableCell className="expand" style={{ fontSize: "1.5em" }}>
                  Role
                </TableCell>
                <TableCell style={{ fontSize: "1.5em" }}>
                  Created Date
                </TableCell>
                <TableCell style={{ fontSize: "1.5em" }}>Tables</TableCell>
                <TableCell style={{ fontSize: "1.5em" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => {
                // const statusText =
                //   row.status.charAt(0).toUpperCase() + row.status.slice(1);

                return (
                  <TableRow key={idx}>
                    <TableCell>{row.userName}</TableCell>
                    <TableCell className="expand">
                      {roles.find((role) => role.id == row.roleID).role}
                    </TableCell>
                    <TableCell>{row.createdDate}</TableCell>
                    <TableCell>
                      {row.roleID == 1 ? (
                        <span>All Access Granted</span>
                      ) : row.tables ? (
                        row.tables.map((table, index) => (
                          <span key={index}>
                            {table}
                            <br />
                          </span>
                        ))
                      ) : (
                        // Optionally, provide a message or placeholder when row.tables is null
                        <span>No tables available</span>
                      )}
                    </TableCell>
                    <TableCell className="fit">
                      <Stack direction={"row"} gap={1}>
                        <IconButton onClick={() => deleteRow(row.id)}>
                          <BsFillTrashFill size={18} />
                        </IconButton>
                        <IconButton onClick={() => editRow(idx)}>
                          <BsFillPencilFill size={18} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </MUITable>
        </TableContainer>
      </Stack>
    </Stack>
  );
};

export const roles = [
  {
    id: 1,
    role: "Admin",
  },
  {
    id: 2,
    role: "FYN_MGR",
  },
  {
    id: 3,
    role: "TSY_MGR",
  },
];
