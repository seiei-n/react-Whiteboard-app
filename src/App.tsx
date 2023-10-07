import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home } from "./layouts/pages/Home";
import { Login } from "./layouts/pages/Login";
import { Board } from "./layouts/pages/Board";

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home Page</Link>
                        </li>
                        <li>
                            <Link to="/login">Login Page</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/board/:slug" element={<Board />} />
                    <Route path="/board" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
