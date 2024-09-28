import React from 'react';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import Navbar from '@/components/Navbar/navbar';

import { ArrowBigRight } from 'lucide-react';
import ProjectCards from '@/components/Home/pastTasks';
import TaskSuggestions from '@/components/Home/suggestedTasks';
export default function IndexPage() {
  return (
    <React.Fragment>
      <Navbar />
    <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">

    
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Improving a Delta at a Time</h1>
        
        <div className="flex mb-8">
          <Input 
            className="flex-grow bg-gray-800 text-white border-none"
            placeholder="What task do you want to work on?"
          />
          <Button className="ml-2 bg-purple-600 hover:bg-purple-500">
            <ArrowBigRight className='w-5 h-5'/>
          </Button>
        </div>

        <TaskSuggestions />
        <ProjectCards />
      </div>
    </div>
    </React.Fragment>
  );
}