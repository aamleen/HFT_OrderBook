import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_NAME } from "../constants";
import "../styles/LoginForm.css"
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
    const [username, setUsernameInput] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";
    const otherName = method === "login" ? "Register" : "Login";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            // if button
            const res = await api.post(route, { username, password })
                if (method === "login") {
                    localStorage.setItem(ACCESS_TOKEN, res.data.access);
                    localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                    localStorage.setItem(USER_NAME, username);
                    navigate("/")
                } else {
                    navigate("/login")
                }
        }      
        catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error || 'Login failed. Please try again.');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setLoading(false)
        }
    };

   

    return (
        <div>
        {error && (
            <div className="alert alert-warning" role="alert">
                <strong>Warning!</strong> {error}
            </div>
        )}
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Username"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>
            <button className="btn btn-secondary" type="submit" onClick={() => navigate(`/${otherName}`)}>
                {otherName}
            </button>
        </form>
        </div>
    );
}

export default Form