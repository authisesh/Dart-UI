import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../css/App.css";
// import "../css/Login.css";
import loginService from "../service/LoginService.tsx";

import {
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Header } from "../components/Header";
import { useAuthContext } from "../contexts/AuthContext";
const Login = () => {
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const handleUserName = (event) => setUserName(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);

  async function loginAction() {
    try {
      const logDetails = {
        username: userName,
        password: password,
      };
      setError("");

      console.log("In " + logDetails.username);
      if(logDetails.username == '' || logDetails.password == ''){
         setError("Login credentials should not be empty!");
         return;
      }
      if(logDetails.username.length <  5 || logDetails.password.length <  5){
       setError("credentials length should be greater then 6 Characters");
       return;
       }
      const loginStatus = await loginService(logDetails);
      console.log("Login Status >>>>>>>" + loginStatus.roleID);

      setAuthUser(loginStatus);
      if (loginStatus.roleID === 1) {
        navigate("/Dashboard");
      } else if (loginStatus.roleID == 2 || loginStatus.roleID == 3) {
        navigate("/AnalyticsDashBoard");
      }
    } catch (e) {
      setError(e.response.data);
    }
  }

  return (
    <Stack style={{ width: "100vw", height: "100vh" }}>
      <Header />

      <Stack
        flex={1}
        alignItems={"center"}
        justifyContent={"center"}
        sx={{ marginTop: 11, padding: 3 }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 500,
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
              <Typography variant="h1">Welcome to DART !! </Typography>
            </Stack>
            <Stack gap={2}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <OutlinedInput
                  type="text"
                  placeholder="Enter your username"
                  id="userName"
                  value={userName}
                  onChange={handleUserName}
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  }
                  style={{
                    borderRadius: 20,
                    backgroundColor: "white",
                  }}
                />
                <FormHelperText />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  id="password"
                  value={password}
                  onChange={handlePassword}
                  startAdornment={
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  }
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
                  style={{
                    borderRadius: 20,
                    backgroundColor: "white",
                  }}
                />
                <FormHelperText />
              </FormControl>
              <Stack direction={"row"} alignItems={"center"}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="keep me logged in"
                />
                <Link
                  href="#"
                  style={{ marginLeft: "auto", textDecoration: "none" }}
                >
                  forgot password
                </Link>
              </Stack>
              <Button
                variant="contained"
                color="success"
                onClick={loginAction}
                style={{
                  padding: 15,
                  borderRadius: 20,
                }}
              >
                Login
              </Button>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Typography>Don't have account yet ?</Typography>
                <Link
                  href="#"
                  style={{ textDecoration: "none", marginLeft: 5 }}
                >
                  {" "}
                  Sign-Up
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
};

export default Login;
