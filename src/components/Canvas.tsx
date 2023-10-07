import { useEffect, useRef, useState } from "react";

type CanvasProps = {
    width: number;
    height: number;
    username: string;
};


export const Canvas = ({ width, height }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        canvas.width = width * 2;
        canvas.height = height * 2;
        canvas.style.width = `${500}px`;
        canvas.style.height = `${500}px`;

        const context = canvas?.getContext("2d");
        if (!context) {
            return;
        }
        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 1;
        contextRef.current = context;
    }, []);


    const handleMouseDown = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current?.beginPath();
        contextRef.current?.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    }

    const handleMouseUp = () => {
        contextRef.current?.closePath();
        setIsDrawing(false);
    }

    const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!isDrawing) {
            return;
        }
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current?.lineTo(offsetX, offsetY);
        contextRef.current?.stroke();
    }

    const handleClearButtonClick = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const context = canvas?.getContext("2d");
        if (!context) {
            return;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    return (
        <>
            <div>
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={draw}
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
