import { io } from "socket.io-client";

// export const api_route = "http://localhost:8080";
export const api_route = "https://bracelet-se.vercel.app";

export const socket = io(api_route);
