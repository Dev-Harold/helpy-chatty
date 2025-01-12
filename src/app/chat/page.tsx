'use client'
import Navbar from '@/components/Navbar'
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
const apiKey = 'saqx9aqwu678';
const userId = 'test-user';
//const userName = 'Anakin Skywalker';
//FIXME: get user token from backend
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdC11c2VyIn0.M4BmkB9_r0VEl3MwkTEoCOhGFWqBabsQOFGu6VBzIaI';

  const filters = { members: { $in: [userId] }, type: "messaging" };
  const options = { presence: true, state: true };
  // const sort = { last_message_at: -1 };

export default function ChatPage() {
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: { id: userId },
  });

  if (!client) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <main className="pt-[30px] px-4 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto h-[80vh]">
      <Chat client={client}>
      <ChannelList filters={filters} options={options} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
        </div>
      </main>
    </>
  )
}
