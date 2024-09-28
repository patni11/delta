"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

export default function ProjectCards() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const initialProjects = [
      {
        title: "Build Next.js Web Application",
        description: "Continue developing your Next.js web application by following the predefined steps. Begin with the frontend setup.",
        timeAgo: "over 4 minutes ago"
      },
      {
        title: "Build a Chat LLM Project",
        description: "This task involves learning TypeScript by developing a chat-based LLM (Language Model) project. Start with the basics.",
        timeAgo: "over 29 minutes ago"
      },
      {
        title: "Build a Next.js Chat Application",
        description: "Develop a chat application using Next.js to explore AI integration. Start by setting up a new Next.js project and planning the features.",
        timeAgo: "over 1 hour ago"
      }
    ];
    setProjects(initialProjects);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {projects.map((project, index) => (
        <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors">
          <CardContent className="pt-6 cursor-pointer">
            <h3 className="font-semibold mb-2 text-purple-300">{project.title}</h3>
            <p className="text-sm text-gray-300 line-clamp-3">
              {project.description}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {project.timeAgo}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}