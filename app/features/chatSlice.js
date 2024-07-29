import { createSlice } from '@reduxjs/toolkit';
import gemini from '../assets/gemini.png';

const initialState = {
  showcard: true,
  query: '',
  typing: false,
  messages: [],
  showprompt:true,
  showclearcard:false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setshowCard: (state, action) => {
      state.showcard = action.payload;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setTyping: (state, action) => {
      state.typing = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessage: (state) =>{
      state.messages = initialState.messages;
    },
    resetQuery: (state) => {
      state.query = '';
    },
    setshowPrompt: (state, action) => {
      state.showprompt= action.payload;
    },
    setshowClearcard: (state, action) => {
      state.showclearcard = action.payload;
    },
  },
});

export const { setshowCard, setQuery, setTyping, addMessage, clearMessage, resetQuery, setshowPrompt, setshowClearcard } = chatSlice.actions;

export default chatSlice.reducer;
