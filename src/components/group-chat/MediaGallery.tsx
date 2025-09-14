
import React, { useState } from "react";
import { GroupMessage } from "@/types/travel-group-types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { XIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

// Display all chat images in a grid
interface MediaGalleryProps {
  messages: GroupMessage[];
}

const MediaGallery = ({ messages }: MediaGalleryProps) => {
  const mediaMessages = messages.filter(msg => !!msg.media_url);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleClose = () => {
    setSelectedImageIndex(null);
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < mediaMessages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  if (mediaMessages.length === 0) {
    return (
      <div className="flex justify-center items-center py-12 text-gray-400">
        <span>No media files shared yet.</span>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-3 p-4">
        {mediaMessages.map((msg, index) => (
          <div 
            className="aspect-square w-full bg-gray-100 rounded-md overflow-hidden flex items-center justify-center cursor-pointer" 
            key={msg.id}
            onClick={() => handleImageClick(index)}
          >
            <img 
              src={msg.media_url} 
              alt="Chat Media" 
              className="object-cover w-full h-full" 
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <Dialog 
        open={selectedImageIndex !== null} 
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-black/90">
          {selectedImageIndex !== null && (
            <div className="relative flex items-center justify-center w-full h-full">
              <button 
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                onClick={handleClose}
              >
                <XIcon className="h-5 w-5" />
              </button>
              
              <button 
                className="absolute left-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                onClick={handlePrevious}
                disabled={selectedImageIndex === 0}
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              
              <img 
                src={mediaMessages[selectedImageIndex].media_url} 
                alt="Chat Media Full View" 
                className="max-h-[80vh] max-w-full object-contain"
              />
              
              <button 
                className="absolute right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                onClick={handleNext}
                disabled={selectedImageIndex === mediaMessages.length - 1}
              >
                <ArrowRightIcon className="h-5 w-5" />
              </button>
              
              <div className="absolute bottom-4 text-sm text-white/80">
                {selectedImageIndex + 1} / {mediaMessages.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaGallery;
