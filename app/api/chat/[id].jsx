"use client";

import React from 'react';
import Image from "next/image";
import Markdown from 'react-markdown';

const ChatMessage = ({ message, sender, image }) => {
  return (
    <section>
      <div className="flex items-start">
        <Image src={image} alt="" width={30} className="bg-black p-2 rounded-full mr-5" />
        <div>
          <p className="uppercase text-slate-300 text-xs font-medium mb-2">{sender}</p>
          <Markdown className="text-sm md:text-md font-medium leading-7">{message}</Markdown>
        </div>
      </div>
      <hr className="w-5/6 opacity-10 m-auto my-4"></hr>
    </section>
  );
};

export default ChatMessage;
