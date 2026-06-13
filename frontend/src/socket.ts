import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from "./config";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
    });
  }
  return socket;
}

export function useSocket(
  onNewTip?: (tip: any) => void,
  onTipsConfirmed?: (tips: any[]) => void
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    if (onNewTip) {
      socket.on("tip:new", onNewTip);
    }

    if (onTipsConfirmed) {
      socket.on("tips:confirmed", onTipsConfirmed);
    }

    return () => {
      if (onNewTip) {
        socket.off("tip:new", onNewTip);
      }
      if (onTipsConfirmed) {
        socket.off("tips:confirmed", onTipsConfirmed);
      }
    };
  }, [onNewTip, onTipsConfirmed]);

  return socketRef.current;
}
