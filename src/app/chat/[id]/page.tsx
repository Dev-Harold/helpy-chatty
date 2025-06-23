'use client'
import Navbar from '@/components/Navbar'
import { StreamChat } from 'stream-chat'
import type { DefaultGenerics, Channel as StreamChannel } from 'stream-chat'
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  ChannelHeader,
  MessageToSend,
} from "stream-chat-react"
import { chatSent, getNewTokenAndEnsureChannelIsCreated, State } from '../../actions/AI'
import "stream-chat-react/dist/css/v2/index.css"
import { useEffect, useState } from 'react'
import { CustomMessage } from '@/components/CustomMessage'
import Steps from '@/components/Steps'

const ANON_USER_ID = 'Helpy-Chatty-Anon-User';
// Stream chat configuration
const apiKey = process.env.NEXT_PUBLIC_GETSTREAM_APP_KEY as string
if (!apiKey) {
  throw new Error('GetStream API key not found. Please set NEXT_PUBLIC_GETSTREAM_APP_KEY in your environment variables.')
}

let chatClient: StreamChat | null = null;

export default function ChatPage(props: { params: Promise<{ id: string }> }) {
  const[id, setId] = useState<string |null>(null);
  const[channel, setChannel] = useState<StreamChannel | null>(null);
  const[state, setState] = useState<State>({
    stage: "reconnaissance",
    issue: {
      device: "Unknown",
      version: "Unknown",
      description: "Unknown"
    },
    stepGuide: {
      steps: [],
      currentStep: 0,
    }
  });

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
  const overrideSubmitHandler = async (message: MessageToSend<DefaultGenerics>) => {
    const messageToSend = {
      ...message,
      mentioned_users: message.mentioned_users?.map(user => user.id)
    };
    console.log("Sending message", messageToSend);
    channel.sendMessage(messageToSend);
    const result = await chatSent({
      messageId: message.id,
      channelId: id,
      text: message.text,
      userId: ANON_USER_ID,
    }, state );
    if (result.success && 'state' in result && result.state) {
      setState(result.state);
    }
  };
 
  return (
    <>
      <Navbar />
      <main className="pt-[30px] px-4 min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto h-[80vh] flex gap-4">
          {/* Chat Section - Now on the left */}
          <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
            <Chat client={chatClient}>
              <div className="flex h-full">
                <Channel channel={channel}>
                <Window>
          <ChannelHeader />
          <MessageList Message={CustomMessage} />
          <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
           </Window>
                </Channel>
              </div>
            </Chat>
          </div>
          
          {/* Steps Section - Now on the right */}
          <div className="w-80 flex-shrink-0">
            <Steps state={state} />
          </div>
        </div>
      </main>
    </>
  )
}
