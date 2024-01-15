import React, { useState } from "react";

import "../css/Modal.css";
import {
  Modal as MUIModal,
  FormControl,
  OutlinedInput,
  FormLabel,
  Stack,
  Button,
  MenuItem,
  Select,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Autocomplete,
  TextField,
  DialogActions,
  InputAdornment,
  IconButton,
  createFilterOptions,
} from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { roles } from "./Table";

export const Modal = ({
  open,
  closeModal,
  onSubmit,
  defaultValue,
  fromOptions = [],
}) => {
  const [formState, setFormState] = useState(
    defaultValue || {
      userName: "",
      password: "",
      roleID: "",
      tables: [],
    }
  );
  const [errors, setErrors] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    console.log(formState);
    if (formState.userName && formState.password && formState.roleID) {
      setErrors("");
      return true;
    } else {
      let errorFields = [];
      for (const [key, value] of Object.entries(formState)) {
        if (!value) {
          errorFields.push(key);
        }
      }
      setErrors(errorFields.join(", "));
      return false;
    }
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    if (!validateForm()) return;

    onSubmit(formState);
    closeModal();
  };

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      fullWidth
      sx={{ ".MuiPaper-root": { padding: 2 } }}
    >
      <DialogTitle>Manage User</DialogTitle>
      <DialogContent sx={{ width: "100%" }}>
        <Stack gap={2}>
          <FormControl>
            <FormLabel>UserName</FormLabel>
            <OutlinedInput
              name="userName"
              onChange={handleChange}
              value={formState.userName}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              name="password"
              value={formState.password}
              onChange={handleChange}
              endAdornment={
                <InputAdornment>
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>roleID</FormLabel>
            <Select
              name="roleID"
              onChange={handleChange}
              value={formState.roleID}
            >
              {roles.map((role) => (
                <MenuItem value={role.id}>{role.role}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Tables</FormLabel>
            <Autocomplete
              multiple
              variant="outlined"
              options={fromOptions}
              value={formState.tables ?? []}
              onChange={(e, tables) => {
                setFormState((state) => ({ ...state, tables }));
              }}
              renderInput={(params) => <TextField {...params} />}
              filterOptions={createFilterOptions({
                ignoreCase: true,
                matchFrom: "start",
                limit: 10000,
              })}
            />
          </FormControl>
          {errors && <div className="error">{`Please include: ${errors}`}</div>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack sx={{ width: "100%" }} alignItems={"center"}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ width: "min-content" }}
          >
            Submit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
