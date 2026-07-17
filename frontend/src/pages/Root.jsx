import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const Root = () => {
    return (
        <div className="md:w-[90%] mx-auto">
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer> 
        </div>
    );
};

export default Root;