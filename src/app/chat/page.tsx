'use client'
import Navbar from '@/components/Navbar'
import { User, ChannelSort, ChannelFilters, ChannelOptions } from 'stream-chat'
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
  ChannelHeader,
  MessageToSend,
  useChannelActionContext,
} from "stream-chat-react"
import { chatSent } from '../actions/AI'
import "stream-chat-react/dist/css/v2/index.css"

// Stream chat configuration
const apiKey = process.env.NEXT_PUBLIC_GETSTREAM_APP_KEY as string
if (!apiKey) {
  throw new Error('GetStream API key not found. Please set NEXT_PUBLIC_GETSTREAM_APP_KEY in your environment variables.')
}
const userId = 'test-user'
const userName = 'Anakin Skywalker'
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdC11c2VyIn0.M4BmkB9_r0VEl3MwkTEoCOhGFWqBabsQOFGu6VBzIaI'

const user: User = {
  id: userId,
  name: userName,
  image: 'https://vignette.wikia.nocookie.net/starwars/images/6/6f/Anakin_Skywalker_RotS.png',
}

const sort: ChannelSort = { last_message_at: -1 }
const filters: ChannelFilters = {
  type: 'messaging',
  members: { $in: [userId] },
}
const options: ChannelOptions = {
  limit: 10,
}
const ChannelInner: React.FC = () => {
  const { sendMessage } = useChannelActionContext();
  const overrideSubmitHandler = (message: MessageToSend, cid: string) => {
    sendMessage(message);
    chatSent({
      messageId: message.id,
      channelId: cid,
      text: message.text,
      userId: userId,
    });
  };


  return (
    <>
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
      </Window>
      <Thread />
    </>
  );
};

export default function ChatPage() {
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: user,
  })

  if (!client) return <div>Loading chat client...</div>


  return (
    <>
      <Navbar />
      <main className="pt-[30px] px-4 min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden">
          <Chat client={client}>
            <div className="flex h-full">
              <div className="w-1/4 border-r border-gray-200">
                <ChannelList 
                  filters={filters} 
                  sort={sort} 
                  options={options}
                />
              </div>
              <div className="flex-1">
                <Channel>
                  <ChannelInner />
                  <Thread />
                </Channel>
              </div>
            </div>
          </Chat>
        </div>
      </main>
    </>
  )
}
