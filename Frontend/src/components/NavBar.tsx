import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  const clickList = () => {
    localStorage.setItem("page", "list");
    console.log("Page set to:", localStorage.getItem("page"));
    navigate("/leave-list");
  };

  //logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employee_id");
    localStorage.removeItem("manager_id");
    localStorage.removeItem("employee_name");
    localStorage.removeItem("employee_role");
    navigate("/");
  };

  const employee_role = localStorage.getItem("employee_role");

  return (
    <header className="h-screen w-[5vw] bg-[#6a77f9] flex flex-col place-items-center justify-between py-10 text-white text-[25px]">
      <div className="flex flex-col gap-15 ">
        <div className={`rounded-[50%] px-4 py-2 border-box `} id="home">
          <i
            className="fa-solid fa-house-user cursor-pointer "
            onClick={() => {
              navigate("/home");
            }}
          ></i>
        </div>
        <div className={`rounded-[50%] px-2 py-1 border-box `} id="request">
          <i
            className="fa-solid fa-calendar-days cursor-pointer m-[10px]"
            onClick={() => {
              navigate("/leave-request");
            }}
          ></i>
        </div>
        <div className={`rounded-[50%] px-2 py-2 border-box text-center`} id="team">
          <i className="fa-solid fa-people-group cursor-pointer"  onClick={() => {
              navigate("/team");
            }}></i>
        </div>

        {employee_role === "Manager" ||
        employee_role === "HR" ||
        employee_role === "Director" ? (
          <div
            className={`rounded-[50%] px-2 py-1 border-box`}
            onClick={clickList}
            id="list"
          >
            <i className="fa-solid fa-bell cursor-pointer m-[10px]"></i>
          </div>
        ) : (
          <></>
        )}
      </div>
      <i
        className="fa-solid fa-arrow-right-from-bracket text-red-600 cursor-pointer"
        onClick={handleLogout}
      ></i>
    </header>
  );
}

export default NavBar;
