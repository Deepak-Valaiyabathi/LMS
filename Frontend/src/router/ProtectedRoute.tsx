
import { Navigate } from "react-router-dom";
import { ReactNode} from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps)  {
 
    const employee_role = localStorage.getItem("employee_role");
    console.log(employee_role)
 
  return employee_role === "Admin" ? (
    <div>{children}</div>
  ) : (
    <div>
      <Navigate replace to ="/home" />
    </div>
  );
}