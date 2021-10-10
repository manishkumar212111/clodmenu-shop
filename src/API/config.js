import { API_BASE_URL } from "../config";

const IMAGE_URL = "https://ik.imagekit.io/i2wp0fsg8dx/";
const BASE_URL = API_BASE_URL || 'http://localhost:5000/' || 'https://afternoon-mesa-99102.herokuapp.com/';


const getImageURL = (imgName) => IMAGE_URL.concat(imgName);

const EndPoints = {
    ProductList: {
        url: "api/common/product"
    },
    Restaurant: {
        url: "api/common/restaurant"
    },
    Orders:{
        url: "api/common/order"
    },
    CreatePayment: {
        url: "api/payment/checkout"
    }
    
};

export { BASE_URL, EndPoints, getImageURL };