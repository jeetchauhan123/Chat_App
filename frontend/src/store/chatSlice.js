import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    selectedUser: null,
    selectedConversationId: null,
    messages: []
  },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setSelectedConversationId: (state, action) => {
      state.selectedConversationId = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    }
  }
});

export const {
  setConversations,
  setSelectedUser,
  setSelectedConversationId,
  setMessages,
  addMessage
} = chatSlice.actions;

export default chatSlice.reducer;