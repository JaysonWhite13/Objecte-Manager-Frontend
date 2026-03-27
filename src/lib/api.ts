// src/lib/api.ts
import axios from "axios";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // ← dynamique selon l'env
});


export const getObjects = () => api.get("/objects");
export const getObject = (id: string) => api.get(`/objects/${id}`);
export const createObject = (data: FormData) => api.post("/objects", data); 
export const deleteObject = (id: string) => api.delete(`/objects/${id}`);