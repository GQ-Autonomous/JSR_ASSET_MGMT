import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
}

const initialState: UserState = {
  id: 1,
  firstName: "sample",
  lastName: "cleaner",
  role: "cleaner",
  token: "token"
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    logout(state) {
      state.id = 0;
      state.firstName = "";
      state.lastName = "";
      state.role = "";
      state.token = "";
    }
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
