"use client"
import React, { useState, useCallback } from 'react';
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
  const [displayedSuggestions, setDisplayedSuggestions] = useState(() => {
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {displayedSuggestions.map((task, index) => (
        <Button 
  key={index} 
  variant="outline" 
  className="justify-start text-left h-auto py-2 px-4 bg-gray-800 hover:bg-gray-700 border-gray-700 text-sm"
>
  <span className="line-clamp-2">{task}</span>
</Button>
      ))}
    </div>
  );
}