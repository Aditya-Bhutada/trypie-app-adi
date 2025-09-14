
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GroupMessage } from "@/types/travel-group-types";
// Use date-fns + date-fns-tz to handle IST timezone
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

interface ChatMessageProps {
  message: GroupMessage;
  currentUserId?: string;
  memberName: string;
  memberAvatar: string;
}

const IST_TZ = 'Asia/Kolkata';

const ChatMessage = ({ message, currentUserId, memberName, memberAvatar }: ChatMessageProps) => {
  const isSender = message.user_id === currentUserId;

  const formatMentions = (text: string) => {
    const regex = /@([a-zA-Z0-9_]+)/g;
    return text.replace(regex, '<span class="text-blue-600 font-medium">$&</span>');
  };

  const formattedMessage = formatMentions(message.message);

  // Format created_at to IST and display like '2:30 PM'
  let formattedTime = "";
  try {
    formattedTime = formatInTimeZone(message.created_at, IST_TZ, 'h:mm a');
  } catch {
    formattedTime = format(new Date(message.created_at), 'h:mm a');
  }

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isSender && (
        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
          <AvatarImage src={memberAvatar} alt={memberName} />
          <AvatarFallback>{memberName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-[70%] ${isSender ? 'bg-trypie-600 text-white rounded-t-lg rounded-l-lg' : 'bg-gray-100 text-gray-800 rounded-t-lg rounded-r-lg'} px-4 py-2 shadow-sm`}
      >
        {!isSender && (
          <p className="text-xs font-semibold mb-1 text-trypie-800">{memberName}</p>
        )}

        <div
          dangerouslySetInnerHTML={{ __html: formattedMessage }}
          className="text-sm break-words"
        />

        {message.media_url && (
          <div className="mt-2">
            <img
              src={message.media_url}
              alt="Shared media"
              className="rounded-md max-h-60 w-full object-contain bg-white/10 backdrop-blur-sm"
              onLoad={() => {
                const messagesEnd = document.getElementById("messages-end");
                messagesEnd?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>
        )}

        <p className="text-xs opacity-70 text-right mt-1">
          {formattedTime} <span className="text-[10px] opacity-40">(IST)</span>
        </p>
      </div>

      {isSender && (
        <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
          <AvatarImage src={memberAvatar} alt={memberName} />
          <AvatarFallback>{memberName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
