import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    selectedUser: null,
    selectedConversationId: null,
    messages: [],
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
      const incoming = action.payload;

      // 🔥 If message has clientTempId → replace temp
      if (incoming.clientTempId) {
        const index = state.messages.findIndex(
          (m) => m.tempId === incoming.clientTempId,
        );

        if (index !== -1) {
          state.messages[index] = {
            ...incoming,
            status: "sent",
          };
          return;
        }
      }

      // normal add
      state.messages.push(incoming);
    },
    updateSidebarFromSocket: (state, action) => {
      const { conversationId, lastMessage, lastMessageTime, otherUser } =
        action.payload;

      const convo = state.conversations.find(
        (c) => c.conversationId === conversationId,
      );

      if (convo) {
        convo.lastMessage = lastMessage;
        convo.lastMessageTime = lastMessageTime;

        // ✅ FIX: update user if missing
        if (!convo.otherUser && otherUser) {
          convo.otherUser = otherUser;
        }
      } else {
        // ✅ FULL OBJECT (IMPORTANT)
        state.conversations.unshift({
          conversationId,
          lastMessage,
          lastMessageTime,
          otherUser,
        });
      }

      // ✅ SORT
      state.conversations.sort(
        (a, b) =>
          new Date(b.lastMessageTime || b.createdAt) -
          new Date(a.lastMessageTime || a.createdAt),
      );
    },
    replaceTempMessage: (state, action) => {
      const { index, message } = action.payload;
      state.messages[index] = message;
    },
  },
});

export const {
  setConversations,
  setSelectedUser,
  setSelectedConversationId,
  setMessages,
  addMessage,
  updateSidebarFromSocket,
  replaceTempMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
