import { Navigate, Outlet } from "react-router-dom";
import { useLoggedInUser } from "../hooks/useLoggInUser";

const PrivateRoute = () => {
  const { currentUser } = useLoggedInUser();
  console.log(currentUser);
  return currentUser ? <Outlet /> : <Navigate to="/api/login" />;
};

export default PrivateRoute;
