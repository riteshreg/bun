import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Textarea } from "~/components/ui/textarea";
import { SendHorizonalIcon } from "lucide-react";
import ChatCard from "~/components/ChatCard";

export type Chat = {
  date: string;
  id: number;
  message: string;
  username: string;
};

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001/chat?username=web");
    socketRef.current = socket;

    socket.onopen = () => {
      // toast.success("connected to a server successfully..")
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      const jsonData: Chat = JSON.parse(event.data);
      setMessages((prev) => [...prev, jsonData]);
    };

    socket.onclose = () => {
      setMessages([]);
      console.log("Disconnected");
    };

    return () => {
      socket.close(); // Clean up on unmount
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function handleMsgSend() {
    // checking if socketRef is available
    if (!socketRef.current) return;
    const msg = input.trim();
    // returning if msg is empty
    if (msg.length === 0) return;
    socketRef.current.send(msg);
    setInput("");
  }

  function scrollToBottom() {
    const el = containerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "instant" });
  }

  return (
    <div className="p-2">
      {/* center << */}
      <div className="max-w-3xl mx-auto h-[92vh] border-2 rounded-md">
        {/* message section << */}
        <div ref={containerRef} className="h-[88%] overflow-y-scroll py-2 px-4">
          {messages.map((msg) => (
            <ChatCard key={msg.id.toString()} chat={msg} />
          ))}
        </div>
        {/* message section >> */}

        {/* input section <<*/}
        <div className="px-4 flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="send a message"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault(); // 🔑 Prevent newline from being added
                handleMsgSend();
              }
            }}
            className="rounded-2xl min-h-10 max-h-14 overflow-y-hidden resize-none"
            maxLength={200}
          />

          <button
            onClick={handleMsgSend}
            className="cursor-pointer hover:bg-slate-100 p-2 rounded-sm"
          >
            <SendHorizonalIcon size={32} className="text-gray-700" />
          </button>
        </div>
        {/* input section >>*/}
      </div>
      {/* center >> */}
    </div>
  );
}
