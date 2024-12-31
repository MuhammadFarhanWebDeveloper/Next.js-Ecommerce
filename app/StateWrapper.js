"use client";
import { Provider } from "react-redux";
import { useRef } from "react";
import { makeStore } from "@/lib/redux/store";
import { addUser } from "@/lib/redux/slices/user";
import { addCategories } from "@/lib/redux/slices/categories";

export default function StoreProvider({ initialUser,initialCategories, children }) {
  const storeRef = useRef(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeRef.current.dispatch(addUser(initialUser));
    storeRef.current.dispatch(addCategories(initialCategories))
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
