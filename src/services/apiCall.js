import axios from "axios";
export default axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
    }
});

// "Content-Type": "multipart/form-data",