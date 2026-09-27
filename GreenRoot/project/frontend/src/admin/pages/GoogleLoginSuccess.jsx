import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "@/Common/authSession";

const GoogleLoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser().then((user) => {
      if (!user) {
        navigate("/auth/login?error=google_failed");
        return;
      }

      switch (user.role) {
        case "admin":
          navigate(`/admin/${user.userId}/dashboard`);
          break;
        case "farmer":
          navigate(`/farmer/${user.userId}/dashboard`);
          break;
        case "seller":
          navigate(`/seller/${user.userId}/home`);
          break;
        case "researcher":
          navigate(`/researcher`);
          break;
        case "deliveryPerson":
          navigate(`/diliveryGuy/dash`);
          break;
        default:
          navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Signing you in with Google...</p>
    </div>
  );
};

export default GoogleLoginSuccess;
