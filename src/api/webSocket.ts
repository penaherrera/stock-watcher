import { useEffect, useRef } from "react";

const FINHUB_API_KEY = import.meta.env.VITE_FINHUB_API_KEY;

const webSocket = (symbol: string, onMessage: (data: any) => void) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const socket = new WebSocket(`wss://ws.finnhub.io?token=${FINHUB_API_KEY}`);

    socket.onopen = () => {
      console.log(`Connected to WebSocket for ${symbol}`);
      socket.send(JSON.stringify({ type: "subscribe", symbol: symbol }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log(`WebSocket for ${symbol} closed`);
    };

    socketRef.current = socket;

    // Cleanup on switch symbol
    return () => {
      if (socketRef.current) {
        socketRef.current.send(
          JSON.stringify({ type: "unsubscribe", symbol: symbol })
        );
        socketRef.current.close();
      }
    };
  }, [symbol]);

  return socketRef;
};

export default webSocket;
