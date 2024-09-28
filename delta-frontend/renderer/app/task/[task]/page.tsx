import { ChatWrapper } from "@/components/Chat/ChatWrapper";
import Navbar from "@/components/Navbar/navbar";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import React from "react";

interface PageProps {
  params: {
    task: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const sessionCookie = cookies().get("sessionId")?.value;
  const taskId = params.task;

  const sessionId = `${taskId}--${sessionCookie}`;

  const isAlreadyIndexed = await redis.sismember("indexed-tasks", taskId);

  const initialMessages = await ragChat.history.getMessages({ amount: 10, sessionId });

  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: "html",
      source: taskId,
      config: { chunkOverlap: 50, chunkSize: 200 },
    });

    await redis.sadd("indexed-tasks", taskId);
  }

  return (
  <React.Fragment>
    <div className="absolute h-full w-full">
    <Navbar/>
  
  <div className="grid grid-cols-5 gap-1 relative h-full w-full top-0">
    {/* Task History Section */}
    
    <div className="bg-zinc-800 col-span-1 border-r border-gray-300 p-12 text-white">
      <h2 className="text-lg font-semibold mb-12">Task History</h2>
      <ul className="flex flex-col space-y-4">
        {/* Replace with actual task history data */}
        <li className="hover:bg-zinc-900 p-6">Life Changing Medicine</li>
        <li className="hover:bg-zinc-900 p-6">AGI - Weekend Build</li>
        <li className="hover:bg-zinc-900 p-6">Dyson Sphere</li>
      </ul>
    </div>

    {/* Chat Wrapper Section */}
    <div className="col-span-4">
      <ChatWrapper taskId={taskId} initialMessages={initialMessages} />
    </div>
  </div>
  </div>
  </React.Fragment>)
};

export default Page;