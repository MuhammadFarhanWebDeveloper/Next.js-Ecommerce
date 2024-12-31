import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    initializeProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    removeProduct: (state, action) => {
      const deletedProduct = action.payload;
      state.products = state.products.filter(
        (product) => product.id !== deletedProduct.id
      );
    },
    updateProduct: (state, action) => {
      const editedProduct = action.payload;
      const index = state.products.findIndex(
        (product) => product.id === editedProduct.id
      );
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...editedProduct };
      }
    },
  },
});

export const { addProduct, initializeProducts, removeProduct, updateProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
