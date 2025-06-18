
import LandingPage from "../components/LandingPage"
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePageProductedRoute from "./HomePageProductedRoute";
import LeaveRequestProductedRoute from "./LeaveRequestProductedRoute";
import AdminManagement from "../management/AdminManagement";
import HomeManagement from "../management/HomeManagement";
import LeaveRequestManagement from "../management/LeaveRequestManagement";
import LeaveList from "../pages/LeaveList";
import Team from "../pages/Team";
import History from "../pages/History";

const MainRoutes = {
  path: "/",
  element: <LandingPage />,
  children: [
    {
      path: "",
      element: <LoginPage />
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <AdminManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "/home",
      element: (<HomePageProductedRoute>
        <HomeManagement/>
      </HomePageProductedRoute>
      )
    },
    {
      path: "/leave-request",
      element: (<LeaveRequestProductedRoute>
        <LeaveRequestManagement/>
      </LeaveRequestProductedRoute>)
    },
    {
      path: "/leave-list",
      element: <LeaveList/>
    },
    {
      path:"/team",
      element: <Team/>
    },
    {
      path: "/history",
      element: <History/>
    }
    
  ]
};

export default MainRoutes;
