'use client'
import Navbar from '@/components/Navbar'
import { StreamChat } from 'stream-chat'
import type { Channel as StreamChannel } from 'stream-chat'
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
  ChannelHeader,
  MessageToSend,
  useChannelActionContext,
} from "stream-chat-react"
import { chatSent, getNewTokenAndEnsureChannelIsCreated } from '../../actions/AI'
import "stream-chat-react/dist/css/v2/index.css"
import { useEffect, useState } from 'react'

const ANON_USER_ID = 'Helpy-Chatty-Anon-User';
// Stream chat configuration
const apiKey = process.env.NEXT_PUBLIC_GETSTREAM_APP_KEY as string
if (!apiKey) {
  throw new Error('GetStream API key not found. Please set NEXT_PUBLIC_GETSTREAM_APP_KEY in your environment variables.')
}

let chatClient: StreamChat | null = null;

const ChannelInner: React.FC = () => {
  const { sendMessage } = useChannelActionContext();
  const overrideSubmitHandler = (message: MessageToSend, cid: string) => {
    sendMessage(message);
    chatSent({
      messageId: message.id,
      channelId: cid,
      text: message.text,
      userId: ANON_USER_ID,
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

export default function ChatPage(props: { params: Promise<{ id: string }> }) {
  const[id, setId] = useState<string |null>(null);
  const[channel, setChannel] = useState<StreamChannel | null>(null);
  if (!chatClient) {
    chatClient = StreamChat.getInstance(apiKey);
  }

  useEffect(() => {
    // Resolve the promise and set the id
    props.params.then((resolvedParams) => {
      setId(resolvedParams.id);
      console.log('Chat ID:', resolvedParams.id);
    });
  }, [props.params]);

  useEffect( () => {
    if (!id) {
      return;
    }
    async function initializeChat() {
      try {
        if (id === null) {
          return;
        }
        const { token } = await getNewTokenAndEnsureChannelIsCreated(id);
        chatClient!.connectUser({
          id: ANON_USER_ID,
          name: 'Anonymous User',
        }, token);
        const messageChannel = chatClient!.channel('messaging', id);
        await messageChannel.watch();
        setChannel(messageChannel);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    }
    if (!channel) {
      initializeChat();
    }
  }, [id, channel]);

  // Cleanup effect that only runs on unmount
  useEffect(() => {
    return () => {
      if (chatClient) {
        console.log('Disconnecting from chat');
        chatClient.disconnectUser().catch((error) => {
          console.error('Error disconnecting user:', error);
        });
        chatClient = null;
      }
    }
  }, []); // Empty dependency array means this only runs on mount/unmount
  

  if (!id || !channel) {
    return <div>Loading chat client...</div>;
  }

 
  return (
    <>
      <Navbar />
      <main className="pt-[30px] px-4 min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden">
          <Chat client={chatClient}>
            <div className="flex h-full">
              <Channel channel={channel}>
                <ChannelInner />
                <Thread />
              </Channel>
            </div>
          </Chat>
        </div>
      </main>
    </>
  )
}
