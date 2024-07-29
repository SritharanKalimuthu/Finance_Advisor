"use client"
import { Provider } from 'react-redux';
import { store } from '../app/store';
import ChatInterface from "./components/ChatInterface";
import Navbar from './components/Navbar';


export default function Home() {
  return (
    <Provider store={store}>
      <main>
        <Navbar/>
        <ChatInterface/>
      </main>
    </Provider>
  );
}
