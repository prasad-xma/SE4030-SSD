import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "@/Common/authSession";

const useAuth = (allowedRole) => {
    const navigate = useNavigate();

    useEffect(() => {
        fetchCurrentUser().then((user) => {
            if (!user || user.role !== allowedRole) {
                navigate("/auth/login");
            }
        });
    }, [navigate, allowedRole]);
};

export default useAuth;
