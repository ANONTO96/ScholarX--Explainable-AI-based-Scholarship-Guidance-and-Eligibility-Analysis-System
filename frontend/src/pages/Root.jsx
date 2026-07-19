import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const Root = () => {
    return (
        <div className="bg-[#E5F1F7]">
            <Navbar></Navbar>
            <Outlet></Outlet> 
        <Footer></Footer>
        </div>
    );
};

export default Root;