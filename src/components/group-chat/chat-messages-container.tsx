
import React, { useState } from "react";
import { GroupMessage } from "@/types/travel-group-types";
import ChatMessage from "./chat-message";
import { Loader2, GalleryHorizontal } from "lucide-react";
import MediaGallery from "./MediaGallery";

interface ChatMessagesContainerProps {
  messages: GroupMessage[];
  currentUserId?: string;
  getMemberName: (userId: string) => string;
  getMemberAvatar: (userId: string) => string;
  isLoading?: boolean;
}

const ChatMessagesContainer = ({ 
  messages,
  currentUserId,
  getMemberName,
  getMemberAvatar,
  isLoading
}: ChatMessagesContainerProps) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showGallery, setShowGallery] = useState(false);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showGallery]);

  // Group messages by date
  const messagesByDate = React.useMemo(() => {
    const grouped: Record<string, GroupMessage[]> = {};
    messages.forEach(message => {
      const date = new Date(message.created_at).toLocaleDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(message);
    });
    return grouped;
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-grow py-4 px-6 overflow-y-auto bg-gray-50 relative">
      <div className="absolute top-2 right-2 z-20">
        <button
          className={`flex gap-2 items-center px-3 py-1 rounded-full text-xs font-semibold border 
            ${showGallery ? 'bg-trypie-600 text-white' : 'bg-white text-trypie-600 border-trypie-600'} 
            transition-colors`}
          onClick={() => setShowGallery((prev) => !prev)}
        >
          <GalleryHorizontal className="h-4 w-4" />
          Media
        </button>
      </div>
      {showGallery ? (
        <MediaGallery messages={messages} />
      ) : isLoading ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-500">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(messagesByDate).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {date === new Date().toLocaleDateString() ? 'Today' : date}
                </div>
              </div>
              <div className="space-y-4">
                {dateMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    currentUserId={currentUserId}
                    memberName={getMemberName(message.user_id)}
                    memberAvatar={getMemberAvatar(message.user_id)}
                  />
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} id="messages-end" />
        </div>
      )}
    </div>
  );
};

export default ChatMessagesContainer;
