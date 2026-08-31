import { useState } from "react";
import { ChatbotContext } from "./ChatbotContext";

const ChatbotProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openChatbot = () => {
        setIsOpen(true);
    };

    const closeChatbot = () => {
        setIsOpen(false);
    };

    return (
        <ChatbotContext.Provider
            value={{
                isOpen,
                openChatbot,
                closeChatbot,
            }}
        >
            {children}
        </ChatbotContext.Provider>
    );
};

export default ChatbotProvider;