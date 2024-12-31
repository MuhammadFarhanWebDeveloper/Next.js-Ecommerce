import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: null,
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    address: "",
    email: "",
    bio: null,
    isSeller: false,
    isAdmin: false,
    profilePicture: "",
    createdAt: "",
    updatedAt: "",
    seller: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
