import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  selectedUser: null,
  messages: []
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    }
  }
});

export const {
  setConversations,
  setSelectedUser,
  setMessages
} = chatSlice.actions;

export default chatSlice.reducer;