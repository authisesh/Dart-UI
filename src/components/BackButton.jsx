import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
  const navigate = useNavigate();
  return (
    <IconButton
      sx={{ width: "min-content" }}
      onClick={() => {
        navigate(-1);
      }}
    >
      <ArrowBack />
    </IconButton>
  );
};
