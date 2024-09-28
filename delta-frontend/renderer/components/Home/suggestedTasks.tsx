import React from 'react';
import { Button } from "@/components/ui/button";

const allSuggestions = [
  "Draft a follow-up email about the last project meeting",
  "Update your to-do list for the upcoming week",
  "Review project documentation",
  "Prepare presentation slides for the next team meeting",
  "Conduct a code review for a colleague's recent pull request",
  "Research and document best practices for API security",
  "Set up a development environment for the new project",
  "Create user stories for the upcoming sprint",
  "Optimize database queries for better performance",
  "Write unit tests for the recently implemented feature"
];

export default function TaskSuggestions() {

  function getSuggestions(){
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  const displayedSuggestions = getSuggestions()

  return (
    <div className="flex space-x-4 mb-8 justify-center">
      {displayedSuggestions.map((task, index) => (
        <Button 
  key={index} 
  variant="outline" 
  className="justify-start text-left h-auto py-2 px-4 bg-gray-800 hover:bg-gray-700 hover:text-purple-300 border-gray-700 text-sm"
>
  {task}
</Button>
      ))}
    </div>
  );
}