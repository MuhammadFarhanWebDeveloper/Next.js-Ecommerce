// app/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import categoriesSlice from "./slices/categories";
import productsSlice from "./slices/products";
export function makeStore(preloadedState) {
  return configureStore({
    reducer: {
      user: userReducer,
      categories: categoriesSlice,
      products: productsSlice,
    },
    preloadedState,
  });
}
