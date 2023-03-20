import {SETCURRENTVALUE} from '../constants/current'

const INITIAL_STATE = {
    current: 0
  }

  export default function current (state = INITIAL_STATE, action) {
    switch (action.type) {
      case SETCURRENTVALUE:
        return {
          current: action.current
        }
       default:
         return state
    }
  }
  