
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const SuggestedPrompts = ({ onSelectPrompt }: SuggestedPromptsProps) => {
  const navigate = useNavigate();
  
  const prompts = [
    { text: "Create a group trip", directAction: () => navigate("/groups") },
    { text: "Plan a trip to Paris", directAction: null },
    { text: "Find budget-friendly destinations", directAction: null },
    { text: "Weekend getaway ideas", directAction: null },
    { text: "Family vacation spots", directAction: null },
    { text: "Travel tips for solo travelers", directAction: null }
  ];

  const handlePromptClick = (prompt: string, directAction: (() => void) | null) => {
    if (directAction) {
      directAction();
    } else {
      onSelectPrompt(prompt);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {prompts.map((prompt, index) => (
        <Button 
          key={index}
          variant="outline" 
          size="sm"
          className="bg-white text-trypie-700 border-trypie-200 hover:bg-trypie-50"
          onClick={() => handlePromptClick(prompt.text, prompt.directAction)}
        >
          {prompt.text}
        </Button>
      ))}
    </div>
  );
};
