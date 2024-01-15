import { Backdrop, CircularProgress } from "@mui/material";
import { ReactElement } from "react";

interface FullScreenLoaderProps {
  loading: boolean;
}

export const FullScreenLoader = ({
  loading,
}: FullScreenLoaderProps): ReactElement => {
  return (
    <Backdrop
      sx={{ color: "#0519fa", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
