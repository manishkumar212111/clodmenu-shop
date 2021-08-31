import Home from "./components/pages/Home"
import Detail from "./components/pages/Detail"


const Route = [
    {
        path: "/:restaurantId",
        component: Home,
        exact: true,
    },
    // {
    //     path: "/:userName/:productId",
    //     component: Detail,
    //     exact: true,
    // },    
];

export default Route
