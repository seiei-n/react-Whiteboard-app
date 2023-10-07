import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const Board = () => {
    const { slug } = useParams();

    // slugがなかったらホームに飛ばす
    if (slug === undefined) {
        window.location.href = "/";
    }

    const username = localStorage.getItem("username");
    console.log("Username: " + username);
    console.log("Room: " + slug);

    useEffect(() => {}, [slug]);

    

    return (
        <>
            <h1>Jam Board</h1>
            <h2>Room: {slug}</h2>
            <canvas id="canvas" width="800" height="600"></canvas>
        </>
    );
};
export default Board;
