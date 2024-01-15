import { AppBar, Button, Toolbar, useScrollTrigger } from "@mui/material";
import React, { useEffect } from "react";
import leftImage from "../assets/logo-final@2x.png";
import { useAuthContext } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
    if(!authUser && location.pathname != '/'){
      navigate('/');
    }
 }, [authUser]);

  return (
    <ElevationScroll>
      <AppBar position="fixed" sx={{ backgroundColor: "#eff3f3" }}>
        <Toolbar sx={{ paddingY: 2, paddingX: "20%" }}>
          <img src={leftImage} style={{ width: 100 }} />
          {authUser && (
            <Button
              style={{ marginLeft: "auto" }}
              onClick={() => setAuthUser(null)}
            >
              log out
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
};

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}
