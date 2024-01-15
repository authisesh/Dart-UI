import axios from "axios";
import { Config } from "../config";


const DATA_UPLOAD_URL = `${Config.VITE_API_URL}/load-data`;

export default function dataUpload(dateToFetch: {tables: any}) {

    console.log(">>>>>>>>>>" + dateToFetch.tables);
    return axios({
        method: "GET",
        url: DATA_UPLOAD_URL + "?table=" + dateToFetch.tables,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },

    }).then(response => {
        console.log("Data Upload response ", JSON.stringify(response.data))
        return response.data;

    }).catch((error: { data: JSON }) => {
        console.log("Data Upload error >>>>>>>>>>>>>: " + error)
        throw error;
    });
}