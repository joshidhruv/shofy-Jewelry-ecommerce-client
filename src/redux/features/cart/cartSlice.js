import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: null,
  },
  reducers: {
    cartCreated: (state, action) => {
      console.log("Action:", action);
      console.log("Previous state:", state);

      state.cart = action.payload.cart;

      console.log("Updated state:", state);
    },
  },
});

export const { cartCreated } = cartSlice.actions;
export default cartSlice.reducer;
