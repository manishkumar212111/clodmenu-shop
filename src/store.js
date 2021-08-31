import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import  rootReducer  from './reducers';

const initialState = {};
const middleware = [thunk];
var appliedMiddleware = applyMiddleware(...middleware);

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // dev code
  const composeEnhancers = composeWithDevTools({ 
    trace: true, 
    traceLimit: 25 
  });
  appliedMiddleware = composeEnhancers(appliedMiddleware)
} else {
  // production code
}


const store = createStore(
  rootReducer,
  initialState,
  appliedMiddleware,
);

export default store;
