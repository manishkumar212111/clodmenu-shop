
const initialState = {
    orderDetail: false,
    order_detail_loading : false,
    orders: [],
    totalPages:1
  };
  
  export default function(state = initialState, action) {
    const { type , data } = action;
    switch ( type ) {
        case 'ORDER_DETAIL_LOADING' : 
            return {...state , order_detail_loading : data};
        case 'ORDER_DETAIL':
          return {...state ,orderError: null, orderDetail : data , order_detail_loading : false};
        case "ORDER_ERROR":
          return {...state, orderError :  data , orderDetail : false};
        
        default: return state;
    }
  }
  