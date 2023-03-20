import { SETCURRENTVALUE } from "../constants/current";

export const setCurrentValue = (value) => {
  return {
    type: SETCURRENTVALUE,
  };
};
