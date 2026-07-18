import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const Root = () => {
    return (
        <div className="bg-[#E5F1F7]">
        <div className="md:w-[90%] mx-auto">
            <Navbar></Navbar>
            <Outlet></Outlet> 
        </div>
        <Footer></Footer>
        </div>
    );
};

export default Root;