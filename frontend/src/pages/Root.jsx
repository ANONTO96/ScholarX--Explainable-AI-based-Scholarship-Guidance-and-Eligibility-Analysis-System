import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScholarXChatbot from "../components/ScholarXChatbot";


const Root = () => {
    return (
        <div className="bg-[#E5F1F7]">

            <Navbar></Navbar>
            <main>
                <Outlet></Outlet>
            </main>
            <Footer></Footer>

            {/* Global UI */}
            <ScrollRestoration></ScrollRestoration>
            <ScholarXChatbot></ScholarXChatbot>
        </div>
    );
};

export default Root;