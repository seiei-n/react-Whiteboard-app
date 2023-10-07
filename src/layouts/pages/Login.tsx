import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [username, setUsername] = useState("");
    const [roompass, setRoomPass] = useState("");

    const navigate = useNavigate();

    const handleEnterRoom = () => {
        console.log("Logging in...");
        localStorage.setItem("username", username);
        navigate("/board/" + roompass);
    };

    return (
        <>
            <h1>Login</h1>
            <form>
                <input
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Room Password"
                    onChange={(e) => setRoomPass(e.target.value)}
                />
                <button type="button" onClick={handleEnterRoom}>
                    Enter Room
                </button>
            </form>
        </>
    );
};
export default Login;
