import { useState } from "react";
import StoryCard from "./StoriesCard";
import StoryText from "./StoriesText";
import { stories } from "./Data";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Stories() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleStories = 4;
  const totalStories = stories.length;

  const nextStory = () => {
    if (currentIndex < totalStories - visibleStories) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Destacados del mes</h2>

      <div className="relative flex items-center">
        {currentIndex > 0 && (
          <button
            onClick={prevStory}
            className="absolute left-0 z-10 p-2"
            aria-label="Historia anterior"
          >
            <FaChevronLeft size={30} className="text-gray-400 hover:text-gray-600 transition-opacity duration-200" />
          </button>
        )}

        <div className="flex space-x-4 overflow-hidden">
          {stories.slice(currentIndex, currentIndex + visibleStories).map((story) => (
            <div key={story.id} className="flex flex-col items-center min-w-[120px]">
              <StoryCard src={story.storyImage} />
              <StoryText name={story.name} />
            </div>
          ))}
        </div>

        {currentIndex < totalStories - visibleStories && (
          <button
            onClick={nextStory}
            className="absolute right-0 z-10 p-2"
            aria-label="Siguiente historia"
          >
            <FaChevronRight size={30} className="text-gray-400 hover:text-gray-600 transition-opacity duration-200" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Stories;
