import { useEffect, useRef, useState } from "react";

interface CanvasProps {
    canvasWidth: number;
    canvasHeight: number;
}

export const Canvas = ({ canvasWidth, canvasHeight }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [clickFlag, setClickFlag] = useState<boolean>(false);
    const [lastX, setLastX] = useState<number | null>(null);
    const [lastY, setLastY] = useState<number | null>(null);
    const [lastXbuf, setLastXbuf] = useState<number | null>(null);
    const [lastYbuf, setLastYbuf] = useState<number | null>(null);
    const [canvasData, setCanvasData] = useState<ImageData | null>(null);
    const [canvasBgColor, setCanvasBgColor] = useState<string>("white");
    const [canvasPenColor, setCanvasPenColor] = useState<string>("black");
    const [canvasProps, setCanvasProps] = useState<{
        width: number;
        height: number;
    }>({ width: 500, height: 500 });
    const [currentWebSocket, setCurrentWebSocket] = useState<WebSocket | null>(
        null
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        setCtx(context);
        canvasProps.width = canvasWidth;
        canvasProps.height = canvasHeight;

        //Initialize canvas
        setCanvasProps({ width: canvasWidth, height: canvasHeight });
        const initialCanvasData = context.getImageData(
            0,
            0,
            canvasWidth,
            canvasHeight
        );
        setCanvasData(initialCanvasData);

        // Canvas event listeners
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mouseout", handleMouseOut);

        // Initialize WebSocket
        const protocol = window.location.protocol;
        const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
        const hostname = window.location.host;
        const ws = new WebSocket(`${wsProtocol}//${hostname}/draw/websocket`);
        ws.addEventListener("open", handleWebSocketOpen);
        ws.addEventListener("message", handleWebSocketMessage);
        ws.addEventListener("close", handleWebSocketClose);
        ws.addEventListener("error", handleWebSocketError);

        return () => {

        };
    }, []);

    const handleWebSocketOpen = () => {
        setCurrentWebSocket(currentWebSocket);
    };
    const handleWebSocketMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.type === "draw") {
            drawFromServer(data);
        } else if (data.type === "clear") {
            clearCanvas(data);
        }
    };

    const handleWebSocketClose = (event: CloseEvent) => {
        console.log(
            "WebSocket closed, reconnecting:",
            event.code,
            event.reason
        );
        rejoinWebSocket();
    };

    const handleWebSocketError = (event: Event) => {
        console.log("WebSocket error, reconnecting:", event);
        rejoinWebSocket();
    };

    const rejoinWebSocket = async () => {
        // WebSocket reconnection logic
        const protocol = window.location.protocol;
        const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
        const hostname = window.location.host;
        const ws = new WebSocket(`${wsProtocol}//${hostname}/draw/websocket`);
        ws.addEventListener("open", handleWebSocketOpen);
        ws.addEventListener("message", handleWebSocketMessage);
        ws.addEventListener("close", handleWebSocketClose);
        ws.addEventListener("error", handleWebSocketError);
        setCurrentWebSocket(ws);
    };

    const drawFromServer = (data: { type: string; x: number; y: number }) => {
        // Drawing logic from server data
        if (data.type === "end") {
            setClickFlag(false);
            setLastXbuf(null);
            setLastYbuf(null);
            return;
        }
        if (!lastXbuf || !lastYbuf) {
            setLastXbuf(data.x);
            setLastYbuf(data.y);
            return;
        }
        if (!ctx) return;
        if (!canvasData) return;
        const pixels = canvasData.data;

        const x = data.x;
        const y = data.y;
        const dx = Math.abs(x - lastXbuf);
        const dy = Math.abs(y - lastYbuf);
        const sx = lastXbuf < x ? 1 : -1;
        const sy = lastYbuf < y ? 1 : -1;
        let err = dx - dy;

        const index = (lastXbuf + lastYbuf * canvasWidth) * 4;
        pixels[index + 0] = parseInt(canvasPenColor.substring(1, 3), 16);
        pixels[index + 1] = parseInt(canvasPenColor.substring(3, 5), 16);
        pixels[index + 2] = parseInt(canvasPenColor.substring(5, 7), 16);
        pixels[index + 3] = 255;
        if (lastXbuf === x && lastYbuf === y) {
            return;
        }
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            setLastXbuf(lastXbuf + sx);
        }
        if (e2 < dx) {
            err += dx;
            setLastYbuf(lastYbuf + sy);
        }

        setCanvasData(canvasData);
        ctx.putImageData(canvasData, 0, 0);
    };

    const draw = (data: { type: string; x: number; y: number }) => {
        // drawing from local data
        console.log(data);
        if (data.type === "end") {
            setClickFlag(false);
            setLastX(null);
            setLastY(null);
            return;
        }
        if (!lastX || !lastY) {
            setLastX(data.x);
            setLastY(data.y);
            return;
        }
        if (!ctx) return;
        if (!canvasData) return;
        const pixels = canvasData.data;

        const x = data.x;
        const y = data.y;
        const dx = Math.abs(x - lastX);
        const dy = Math.abs(y - lastY);
        const sx = lastX < x ? 1 : -1;
        const sy = lastY < y ? 1 : -1;
        let err = dx - dy;

        const index = (lastX + lastY * canvasWidth) * 4;
        pixels[index + 0] = parseInt(canvasPenColor.substring(1, 3), 16);
        pixels[index + 1] = parseInt(canvasPenColor.substring(3, 5), 16);
        pixels[index + 2] = parseInt(canvasPenColor.substring(5, 7), 16);
        pixels[index + 3] = 255;
        if (lastX === x && lastY === y) {
            return;
        }
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            setLastX(lastX + sx);
        }
        if (e2 < dx) {
            err += dx;
            setLastY(lastY + sy);
        }

        setCanvasData(canvasData);
        ctx.putImageData(canvasData, 0, 0);
    };


    const clearCanvas = (data = { type: "clear" }) => {
        // Clear canvas logic
        if (data.type !== "clear") {
            return;
        }
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        setCanvasProps({ width: canvasWidth, height: canvasHeight });
        const initialCanvasData = ctx.getImageData(
            0,
            0,
            canvasWidth,
            canvasHeight
        );
        setCanvasData(initialCanvasData);
        ctx.putImageData(initialCanvasData, 0, 0);
        setCanvasPenColor(canvasPenColor);
        setCanvasBgColor(canvasBgColor);
    };

    const handleClearButtonClick = () => {
        // Clear button click event
        if (!currentWebSocket) return;
        clearCanvas();
        currentWebSocket.send(JSON.stringify({ type: "clear" }));
    }

    const handleMouseDown = (event: MouseEvent) => {
        // Mouse down event
        if (!ctx) return;
        setClickFlag(true);
        setLastX(null);
        setLastY(null);
        const x = event.offsetX;
        const y = event.offsetY;
        draw({ type: "start", x: x, y: y });
    };

    const handleMouseMove = (event: MouseEvent) => {
        // Mouse move event
        console.log(clickFlag);
        if (!clickFlag) return;
        const x = event.offsetX;
        const y = event.offsetY;
        draw({ type: "move", x: x, y: y });
    }

    const handleMouseUp = (event: MouseEvent) => {
        // Mouse up event
        if (!clickFlag) return;
        const x = event.offsetX;
        const y = event.offsetY;
        draw({ type: "end", x: x, y: y });
        if (!currentWebSocket) return;
        currentWebSocket.send(JSON.stringify({ type: "end", x: x, y: y }));
    }

    const handleMouseOut = (event: MouseEvent) => {
        // Mouse out event
        if (!clickFlag) return;
        const x = event.offsetX;
        const y = event.offsetY;
        draw({ type: "end", x: x, y: y });
        if (!currentWebSocket) return;
        currentWebSocket.send(JSON.stringify({ type: "end", x: x, y: y }));
    }



    return (
        <>
            <div>
                <canvas
                    ref={canvasRef}
                    width="500"
                    height="500"
                    style={{ border: "1px solid black" }}
                ></canvas>
                <br />
                <button id="clear_button" onClick={handleClearButtonClick}>
                    Clear
                </button>
            </div>
        </>
    );
};

export default Canvas;
