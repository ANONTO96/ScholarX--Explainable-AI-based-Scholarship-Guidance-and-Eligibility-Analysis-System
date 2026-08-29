import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollButtons from "../components/ReusableComp/ScrollButtons";


const Root = () => {
    return (
        <div className="bg-[#E5F1F7]">
            <ScrollRestoration></ScrollRestoration>
            <Navbar></Navbar>
            <Outlet></Outlet> 
        <Footer></Footer>
        <ScrollButtons></ScrollButtons>
        </div>
    );
};

export default Root;