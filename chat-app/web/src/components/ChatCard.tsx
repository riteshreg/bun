import React from "react";
import { Chat } from "~/routes";

export const OtherChat: React.FC<{
  chat: Chat;
}> = ({ chat }) => {
  return (
    <div className="group relative mb-4 flex max-w-[85%]">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-lg transition-all duration-200 ease-out hover:shadow-md">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            {chat.username}
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {new Date(chat.date).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="mt-1 text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
          {chat.message}
        </p>

        {/* Chat bubble tip */}
        <div className="absolute -left-1.5 top-0 h-3 w-3 rotate-45 transform bg-white dark:bg-zinc-800" />
      </div>
    </div>
  );
};

export const MyChat: React.FC<{
  chat: Chat;
}> = ({ chat }) => {
  return (
    <div className="group relative mb-4 flex max-w-[85%] ml-auto justify-end">
      <div className="bg-purple-700 dark:bg-purple-800 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-lg transition-all duration-200 ease-out hover:shadow-md">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-purple-100 dark:text-purple-200">
            {chat.username}
          </span>
          <span className="text-xs text-purple-200 dark:text-purple-300">
            {new Date(chat.date).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="mt-1 text-purple-50 dark:text-purple-100 leading-relaxed break-words">
          {chat.message}
        </p>

        {/* Chat bubble tip */}
        <div className="absolute -right-1.5 top-0 h-3 w-3 rotate-45 transform bg-purple-600 dark:bg-purple-800" />
      </div>
    </div>
  );
};
