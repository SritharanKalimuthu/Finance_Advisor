"use client"
const { GoogleGenerativeAI } = require("@google/generative-ai");
import Markdown from 'react-markdown';
import Image from "next/image";
import Card from "./Card";
import Navbar from './Navbar';
import { useState, useEffect, useRef } from "react";
import user from '../assets/user.png';
import gemini from '../assets/gemini.png';
import loader from '../assets/loader.svg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Chat = () => {

    const apiKey = process.env.API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are finance advisor who is well known and most intelligent bot on all finance based question. You can answer all financial based question and give them better financial advices like an 60 year experienced finance advisor. But other than finance you know nothing,  if anyone one ask other topic than finance you should never answer any thing that irrelevant to the finance subject, all you have to say is i am an finance advisory bot please askme anything related to finance, i am happy to help you. This was your role.",
    });
    
    const generationConfig = {
      temperature: 0.8,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const [cardshow,setCardshow] = useState(true);
    const [query,setQuery]=useState('');
    const [typing,setTyping] = useState(false);

    const [messages,setMessages] = useState([{
        message:"Hello, I am Gemini. How can I assist you today?",
        sender:"Gemini AI",
        image:gemini
    }])

    const handleUserQuery = async(message)=>{
        if(query!=""){
            setCardshow(false)
            const newMessage = {
                message:message,
                sender:"You",
                image:user
            }

            const newMessages = [...messages,newMessage]

            setMessages(newMessages)
            setQuery('')
            setTyping(true)
            processBotResponse(newMessages)
        }
    }

    async function processBotResponse(chatMessages) {
        const chatSession = model.startChat({
          generationConfig,
        });
      
        const result = await chatSession.sendMessage(query);
        const response =result.response.text();
        setMessages([
            ...chatMessages,{
                message:response,
                sender:'Gemini AI',
                image:gemini
            }
        ])
        setTyping(false)
      }
    
    useEffect(()=> chatRef.current.scrollIntoView({behavior: "smooth", block:"end"}), [messages])
    const chatRef = useRef(null);
      

  return (
    <section>
        <Navbar/>
        <div className="flex justify-center my-4 mx-3">
            <div className="lg:w-1/2">
                <div className="pb-32" ref={chatRef}>
                    {cardshow? <Card/>:null}
                    {messages.map((message,i)=>{
                        return <div key={i}>
                                    <div className="flex items-start">
                                        <Image src={message.image} alt="" width={30} className="bg-black p-2 rounded-full mr-5"/>
                                        <div>
                                            <p className="uppercase text-slate-300 text-xs font-medium mb-2">{message.sender}</p>
                                            <Markdown className="text-md font-medium leading-7">{message.message}</Markdown>
                                        </div>
                                    </div>
                                    <hr className="w-5/6 opacity-10 m-auto my-4"></hr>
                                </div>
                    })}
                </div>
                <div className='mx-auto ml-3 w-full lg:w-1/2 fixed bottom-10'>
                    {typing?<div className='flex items-start mb-3'><Image src={loader} alt='' width={20}/><p className='ml-1 mt-1 text-xs uppercase text-slate-200 font-semibold'>Gemini is typing...</p></div>:null}
                    <form className="flex">
                        <input name="query" className="w-3/4 lg:w-5/6 px-5 py-4 border-none outline-none bg-black rounded-md font-semibold text-sm" placeholder="Ask me something..." value={query} onChange={(e)=>{setQuery(e.target.value)}}/>
                        <button type="submit" onClick={(e)=>{e.preventDefault();handleUserQuery(query)}}><FontAwesomeIcon icon={faPaperPlane} className="text-slate-400 bg-black p-2 rounded-full ml-4"/></button>
                    </form>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Chat
