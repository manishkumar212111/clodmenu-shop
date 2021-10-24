import Home from "./components/pages/Home"
import Detail from "./components/pages/Detail"
import Cart from "./components/pages/cart";


const Route = [
    {
        path: "/",
        component: Home,
        exact: true,
    },
    {
        path: "/cart",
        component: Cart,
        exact: true,
    },
    {
        path: "/:restaurantId",
        component: Home,
        exact: true,
    },
    {
        path: "/:restaurantId/:clientId/:tableNo",
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
