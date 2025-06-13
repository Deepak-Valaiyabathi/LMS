
import { ChangeEvent, MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginPic from "../assets/login.jpg";
import Swal from "sweetalert2";



function LoginPage() {

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast: HTMLElement) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
  const navigate = useNavigate();
    type user = {
        email: string,
        password: string
    }

 const [userData, setUserData] = useState<user>({
    email: "",
    password:""
 })
 const changeHandle = (e:ChangeEvent<HTMLInputElement>)=>{
    e.preventDefault();
    const { name, value } = e.target;

  setUserData((prev) => ({
    ...prev,
    [name]: value, 
  }));
  
 }

 
 const clickHandle = async (e: MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    try{
        const response = await fetch('http://localhost:5000/api/login', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
            credentials: 'include' 
          });
          const result = await response.json();
          if (response.ok && result.token) {
            
            Toast.fire({
    icon: "success",
    title: "Login in successfully"
  });
            localStorage.setItem("token", result.token);
            localStorage.setItem("employee_id", result.id);
            localStorage.setItem("manager_id", result.manager_id);
            localStorage.setItem("employee_name", result.name);
            console.log('Server response:', result);
             localStorage.setItem("employee_role", result.role);
             
             navigate('/admin')
          } else {
            console.log("else: ",result);
            Toast.fire({
              icon: "error",
              title: result.message || 'Unknown error occurred'
            });
          }
      
        } catch (err) {
          console.error('Error submitting form:', err);
          alert('login failed.');
        }
      };
  return (
    <div className="h-screen w-[100vw] bg-white flex justify-evenly">
        <div>
            <div className="h-178 w-[50vw] place-items-center border-box px-5 py-5">
                <h1 className="text-[49px] mt-[70px]">Welcome</h1>
                <p className="text-[19px] text-gray-400">To keep connected with us login with your office email and password 🔔</p>
            <form className="h-70 w-100 mt-[60px] flex flex-col gap-5 place-items-center  rounded-lg px-2 hover:bg-whitesmoke-800">
                <div className="flex w-100 h-20 justify-evenly items-center bg-white rounded-lg">
                <i className="fa-regular fa-envelope text-[25px] m-[0] text-[#6a77f9]"></i>
                    <input type="email" name="email"  id="email" placeholder="Email Address" onChange={changeHandle} className="w-85 h-19 text-[19px] px-8 focus:border-none focus:outline-none"/>
                </div>
                <div className="flex w-100 h-20 justify-evenly items-center rounded-lg">
                <i className="fa-solid fa-lock text-[25px] m-[0] text-[#6a77f9]"></i>
                    <input type="password" name="password" id="password" placeholder="Password" onChange={changeHandle} className="w-85 h-19 text-[19px] px-8 focus:border-none focus:outline-none"/>
                </div>
                <button className="bg-[#6a77f9] text-white h-10 w-30 text-[20px] rounded-lg cursor-pointer" onClick={clickHandle}>Login</button>
            </form>
            </div>
            
        </div>
        <img src={loginPic} alt="login" className="w-[50vw]"/>

    </div>
  )
}

export default LoginPage