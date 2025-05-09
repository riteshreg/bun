import { Chat } from "~/routes";

const ChatCard: React.FC<{
    chat: Chat;
}> = (props) => {
    return (
        <div className="p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer rounded-lg">
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {props.chat.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {props.chat.username}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{props.chat.message}</p>
                </div>
                <div className="text-xs text-gray-400">
                    {new Date(props.chat.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChatCard;
