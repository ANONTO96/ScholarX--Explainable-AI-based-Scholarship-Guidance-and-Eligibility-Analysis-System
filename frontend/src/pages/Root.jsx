import { Outlet } from "react-router";


const Root = () => {
    return (
        <div>
            this is root page
            <Outlet></Outlet> 
        </div>
    );
};

export default Root;