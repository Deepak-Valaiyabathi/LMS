
import { Navigate } from "react-router-dom";
import { ReactNode} from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function HomePageProductedRoute({ children }: ProtectedRouteProps)  {
 
    const token = localStorage.getItem("token");

  return token ? (
    <div>{children}</div>
  ) : (
    <Navigate replace to="/" />
  );
}