// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/objects", // ton backend NestJS
});

export const getObjects = () => api.get("/");
export const getObject = (id: string) => api.get(`/${id}`);
export const createObject = (data: FormData) =>
  api.post("/", data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteObject = (id: string) => api.delete(`/${id}`);