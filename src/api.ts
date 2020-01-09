import axios from "axios";
import {API_URL} from "@src/constants";

const validateStatus = (status: number) => (status >= 200 && status < 300) || status == 401;


export const login = async (values: { username: string, password: string }) =>
    await axios.post(`${API_URL}/login`, values, {method: "POST", validateStatus});

export const auth = async (token: string) =>
    await axios.get(`${API_URL}/auth`, {method: "GET", headers: {Authorization: token}});


export const checkUser = async (username: string) =>
    await axios.post(`${API_URL}/checkUser`, {username}, {method: "POST"});


export const registerReq = async (username: string) =>
    await axios.post(`${API_URL}/registerReq`, {username}, {method: "POST"});

