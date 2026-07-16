import { Outlet } from "react-router";
import Navbar from "../components/Navbar";


const Root = () => {
    return (
        <div className="md:w-[90%] mx-auto">
            <Navbar></Navbar>
            <Outlet></Outlet> 
        </div>
    );
};

export default Root;