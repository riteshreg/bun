import { createFileRoute } from "@tanstack/react-router";
import { SendHorizonalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { OtherChat, MyChat } from "~/components/ChatCard";
import { Textarea } from "~/components/ui/textarea";

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
  const containerYPositionRef = useRef<number>(0);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001/chat?username=web");
    socketRef.current = socket;

    socket.onopen = () => {
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

  // this effect will tract the scrollposition of the message div
  useEffect(() => {
    const el = containerRef.current;

    const handleScroll = () => {
      if (el) {
        const scrollTop = el.scrollTop;
        containerYPositionRef.current = scrollTop;
      }
    };

    if (el) {
      el.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (el) {
        el.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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
    if (!el) return;

    const currentPosition = containerYPositionRef.current

    const sub = (el.scrollHeight - 500) - currentPosition;

    // if the current position is at top which mean we want the position at bottom;
    if (currentPosition === 0) {
      el.scrollTo({ top: el.scrollHeight, behavior: "instant" });
    } else if (sub < 400) {
      el.scrollTo({ top: el.scrollHeight, behavior: "instant" });
    }

  }

  return (
    <div className="p-2">
      {/* center << */}
      <div className="max-w-3xl mx-auto h-[92vh] border-2 rounded-md">
        {/* message section << */}
        <div ref={containerRef} className="h-[88%] overflow-y-scroll py-2 px-4">
          {messages.map((msg) =>
            msg.username === "web" ? (
              <MyChat key={msg.id} chat={msg} />
            ) : (
              <OtherChat key={msg.id} chat={msg} />
            )
          )}
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
