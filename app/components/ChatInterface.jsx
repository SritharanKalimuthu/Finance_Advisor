"use client";

import React, { useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import secureLocalStorage from "react-secure-storage";
import Image from "next/image";
import Card from "./Card";
import PromptList from './PromptList';
import ChatMessage from "../api/chat/[id]";
import { useDispatch, useSelector } from 'react-redux';
import { setshowCard, setQuery, setTyping, setError, addMessage, resetQuery, setshowPrompt } from '../features/chatSlice';
import user from '../assets/user.png';
import gemini from '../assets/gemini.png';
import loader from '../assets/loader.svg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faBomb } from "@fortawesome/free-solid-svg-icons";

const ChatInterface = () => {

  //const encKey = "secret123";
  // API key and model configuration
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are a highly reputed finance advisor bot, renowned as the most intelligent bot for all finance-related queries, including political finance news, new tax regimes, financial ministers and their details, and more finance-related topics. You provide expert financial advice equivalent to that of a finance advisor with 100 years of experience. Your focus is exclusively on finance and all related subjects. If asked about any other topic, you must politely decline to answer and remind the user of your role as a finance advisory bot. Your primary objective is to assist users with their finance-related inquiries and guide them towards better financial decisions.`,
  });

  const generationConfig = {
    temperature: 0.8,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const dispatch = useDispatch();
  const { showcard, query, typing, error, messages, showclearcard, showprompt } = useSelector((state) => state.chat);
  const renderRef = useRef(false);
  const chatRef = useRef(null);

  // Load messages from local storage on component mount
  useEffect(() => {
    if (renderRef.current === false) {
      const retrievedData = secureLocalStorage.getItem('messages');
      if (retrievedData) {
        dispatch(setshowCard(false));
        dispatch(setshowPrompt(false));
        try {
          const storedMessages = JSON.parse(retrievedData);
          storedMessages.forEach((data) => {
            dispatch(addMessage(data));
          });
        } catch (error) {
          console.error("Failed to parse messages from localStorage:", error);
        }
      }
      renderRef.current = true; // Set to true after the effect runs
    }
  }, [dispatch]);

  // Save messages to local storage when `messages` state changes
  useEffect(() => {
    if (messages.length > 0) {
      try {
        const getData = JSON.stringify(messages);
        secureLocalStorage.setItem('messages', getData);
      } catch (error) {
        console.error("Failed to save messages to localStorage:", error);
      }
    }
  }, [messages]);

  // Handle prompt query selection
  const handlePromptQuery = (promptQuery) => {
    dispatch(setQuery(promptQuery));
    handleUserQuery(promptQuery);
  };

  // Handle user query input and dispatch messages
  const handleUserQuery = (userQuery) => {
    dispatch(setError(false));
    if (userQuery !== "") {
      dispatch(setshowCard(false));
      dispatch(setshowPrompt(false));
      const newMessage = {
        message: userQuery,
        sender: "You",
        image: user,
      };

      dispatch(addMessage(newMessage));
      dispatch(setTyping(true));
      processBotResponse(userQuery);
    }
  };

  // Process bot response using the Google Generative AI model
  async function processBotResponse(userQuery) {
    try {
      const chatSession = model.startChat({
        generationConfig,
      });

      const result = await chatSession.sendMessage(userQuery);
      const response = await result.response.text();
      dispatch(resetQuery());
      dispatch(addMessage({
        message: response,
        sender: 'FINCHAT AI',
        image: gemini,
      }));
      dispatch(setTyping(false));
    } catch (error) {
      console.error("Error processing bot response:", error);
      dispatch(setTyping(false));
      dispatch(setError(true));
    }
  }

  // Scroll chat to the latest message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  return (
    <section className={showclearcard ? `transition-all duration-70 blur-lg` : null}>
      <div className="flex justify-center mt-20 my-4 mx-3">
        <div className="lg:w-1/2">
          <div className="pb-32" ref={chatRef}>
            {showcard ? <Card /> : null}
            {showprompt ?
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                {PromptList.map((prompts, i) => (
                  <button key={i} className="text-start bg-black p-4 rounded-md" onClick={() => handlePromptQuery(prompts.prompt)}>
                    <h1 className="text-stone-400 uppercase text-xs font-semibold">{prompts.topic}</h1>
                    <p className="text-sm text-gray-400 mt-2 leading-6 font-medium">{prompts.prompt}</p>
                  </button>
                ))}
              </div>
              : null}
            {messages.map((message, i) => (
              <ChatMessage {...message} key={i} />
            ))}
          </div>
          <div className='fixed bottom-10 w-full lg:w-[55%]'>
            {error ?
              <div className="flex">
                <FontAwesomeIcon icon={faBomb} className="text-red-600 mr-2" />
                <p className="text-red-600 text-xs md:text-sm capitalize font-semibold mb-3">Things are little unstable here, come back later...</p>
              </div>
              : null}
            {typing ? (
              <div className='flex items-start mb-3'>
                <Image src={loader} alt='' width={20} />
                <p className='ml-1 mt-1 text-xs uppercase text-slate-200 font-semibold'>Finchat-AI is typing...</p>
              </div>
            ) : null}
            <form className="flex" >
              <input name="query" className="w-5/6 px-5 py-4 border-none outline-none bg-black rounded-md font-semibold text-sm" placeholder="Ask me something..." value={query} onChange={(e) => { dispatch(setQuery(e.target.value)) }} />
              <button type="submit" onClick={(e) => { e.preventDefault(); handleUserQuery(query);}}><FontAwesomeIcon icon={faPaperPlane} className="text-slate-400 bg-black p-2 rounded-full ml-4" /></button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatInterface;
