import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Canvas from "../../components/Canvas";

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
            < Canvas width={500} height={500} username={username || ""} />
        </>
    );
};
export default Board;
