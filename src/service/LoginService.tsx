import axios from "axios";
import { Config } from "../config";


const LOGIN_URL = `${Config.VITE_API_URL}/v1/user/login`;
export default function loginService(logDetails:{username: string,password: string}) {

  console.log(">>>>>>>>>>" + logDetails.username);
  return axios({
    method: "POST",
    url: LOGIN_URL,
    headers: {

      "Access-Control-Allow-Origin": "*",
    },
    data: {
      userName: logDetails.username,
      password: logDetails.password,
    },
  }).then(response => {
    console.log("response ", JSON.stringify(response.data))
    return response.data;

  }).catch((error: { data: JSON }) => {
    console.log("error >>>>>>>>>>>>>: " + error)
    throw error;
  });
}