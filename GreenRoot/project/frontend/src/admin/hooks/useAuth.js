import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "@/Common/authSession";

const useAuth = (allowedRole) => {
    const navigate = useNavigate();

    useEffect(() => {
        // the backend validates the HttpOnly cookie and returns the user's role
        fetchCurrentUser().then((user) => {
            if (!user || user.role !== allowedRole) {
                navigate("/auth/login"); // Redirect if not logged in or role doesn't match
            }
        });
    }, [navigate, allowedRole]);
};

export default useAuth;
