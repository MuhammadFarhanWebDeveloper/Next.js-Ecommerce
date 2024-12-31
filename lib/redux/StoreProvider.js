// app/components/StoreProvider.js
'use client';
import { Provider } from 'react-redux';
import { useRef } from 'react';
import { makeStore } from './store';
import { addUser } from './slices/user';

export default function StoreProvider({ initialUser, children }) {
  const storeRef = useRef(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeRef.current.dispatch(addUser(initialUser));
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
