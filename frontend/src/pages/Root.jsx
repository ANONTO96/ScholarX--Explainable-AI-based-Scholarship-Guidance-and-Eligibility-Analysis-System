import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const Root = () => {
    return (
        <div className="bg-[#E5F1F7]">
            <ScrollRestoration></ScrollRestoration>
            <Navbar></Navbar>
            <Outlet></Outlet> 
        <Footer></Footer>
        </div>
    );
};

export default Root;