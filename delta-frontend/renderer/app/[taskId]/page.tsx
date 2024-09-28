import { ChatWrapper } from "@/components/Chat/ChatWrapper";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";

interface PageProps {
  params: {
    taskId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const sessionCookie = cookies().get("sessionId")?.value;
  const taskId = params.taskId;

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

  return <ChatWrapper taskId={taskId} initialMessages={initialMessages} />;
};

export default Page;