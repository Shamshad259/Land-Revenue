import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedComponent = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must log in first!");
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div>
            <h1>Protected Component</h1>
            <p>Welcome to the protected page!</p>
        </div>
    );
};

export default ProtectedComponent;
