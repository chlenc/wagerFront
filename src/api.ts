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


export const checkHash = async (hash: string) =>
    await axios.post(`${API_URL}/checkHash`, {hash}, {method: "POST"});


export const register = async (hash: string, password: string, seed: string) =>
    await axios.post(`${API_URL}/register`, {hash, password, seed}, {method: "POST"});


export const getEvents = async () => await axios.get(`${API_URL}/events`);

