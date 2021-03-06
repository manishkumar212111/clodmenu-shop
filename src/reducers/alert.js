import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function AlertReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [payload];
    case REMOVE_ALERT:
      return (state = []);
    default:
      return state;
  }
}
