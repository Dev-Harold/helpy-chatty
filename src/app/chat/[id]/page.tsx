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
import { useSearchParams, usePathname } from 'next/navigation'

const ANON_USER_ID = 'Helpy-Chatty-Anon-User';

// LocalStorage utility functions
const getStateKey = (channelId: string) => `helpy_chatty_state_${channelId}`;

const saveChatState = (channelId: string, state: State) => {
  try {
    const stateKey = getStateKey(channelId);
    const stateData = {
      ...state,
      lastUpdated: Date.now()
    };
    localStorage.setItem(stateKey, JSON.stringify(stateData));
    console.log('State saved to localStorage:', stateData);
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

const loadChatState = (channelId: string): State | null => {
  try {
    const stateKey = getStateKey(channelId);
    const savedState = localStorage.getItem(stateKey);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      console.log('State loaded from localStorage:', parsedState);
      return parsedState;
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }
  return null;
};

// Utility function to clear state (for future use)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const clearChatState = (channelId: string) => {
  try {
    const stateKey = getStateKey(channelId);
    localStorage.removeItem(stateKey);
    console.log('State cleared from localStorage for channel:', channelId);
  } catch (error) {
    console.error('Failed to clear state from localStorage:', error);
  }
};



// Default state
const getDefaultState = (): State => ({
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

// Stream chat configuration
const apiKey = process.env.NEXT_PUBLIC_GETSTREAM_APP_KEY as string
if (!apiKey) {
  throw new Error('GetStream API key not found. Please set NEXT_PUBLIC_GETSTREAM_APP_KEY in your environment variables.')
}

let chatClient: StreamChat | null = null;

export default function ChatPage(props: { params: Promise<{ id: string }> }) {
  const[id, setId] = useState<string |null>(null);
  const[channel, setChannel] = useState<StreamChannel | null>(null);
  const[showStepsOverlay, setShowStepsOverlay] = useState(false);
  const[initialMessageSent, setInitialMessageSent] = useState(false);
  const[isLoadingState, setIsLoadingState] = useState(true);
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const[state, setState] = useState<State>(getDefaultState());

  if (!chatClient) {
    chatClient = StreamChat.getInstance(apiKey);
  }

  // Load state from localStorage when component mounts
  useEffect(() => {
    const loadState = async () => {
      const resolvedParams = await props.params;
      const channelId = resolvedParams.id;
      
      const savedState = loadChatState(channelId);
      if (savedState) {
        setState(savedState);
        console.log('Restored state from localStorage:', savedState);
      } else {
        console.log('No saved state found, using default state');
      }
      setIsLoadingState(false);
    };
    
    loadState();
  }, [props.params]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (id && !isLoadingState) {
      saveChatState(id, state);
    }
  }, [state, id, isLoadingState]);

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
        
        // Send initial message if provided in URL
        const initialMessage = searchParams.get('message');
        if (initialMessage && !initialMessageSent) {
          const decodedMessage = decodeURIComponent(initialMessage);
          console.log('Sending initial message:', decodedMessage);
          
          // Send the message through the channel
          await messageChannel.sendMessage({
            text: decodedMessage,
            user_id: ANON_USER_ID,
          });
          
          // Process the message through AI
          const result = await chatSent({
            messageId: undefined,
            channelId: id,
            text: decodedMessage,
            userId: ANON_USER_ID,
          }, state);
          
          if (result.success && 'state' in result && result.state) {
            setState(result.state);
          }
          
          setInitialMessageSent(true);
          
          // Update URL to remove the message parameter using history API
          const newSearchParams = new URLSearchParams(searchParams.toString());
          newSearchParams.delete('message');
          const newUrl = newSearchParams.toString() ? `${pathname}?${newSearchParams.toString()}` : pathname;
          window.history.replaceState({}, '', newUrl);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    }
    if (!channel) {
      initializeChat();
    }
  }, [id, channel, initialMessageSent, state]);

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

  // Auto-show steps overlay when step-by-step mode is activated
  useEffect(() => {
    if (state.stepGuide.steps.length > 0) {
      setShowStepsOverlay(true);
    }
  }, [state]);
  

  if (!id || !channel || isLoadingState) {
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

  const showSteps = state.stage === "step-by-step" && state.stepGuide.steps.length > 0;
 
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="p-4 bg-gray-100 flex flex-grow">
        <div className="max-w-7xl mx-auto w-full flex flex-col custom-breakpoint:flex-row gap-4 flex-grow">
          {/* Chat Section */}
          <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden relative min-h-0">
            {/* Mobile Steps Toggle Button - Only visible on mobile */}
            {state.stage === "step-by-step" && state.stepGuide.steps.length > 0 && (
              <button
                onClick={() => setShowStepsOverlay(!showStepsOverlay)}
                className="custom-breakpoint:hidden absolute top-4 right-4 z-10 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                {showStepsOverlay ? 'Hide Steps' : 'Show Steps'}
              </button>
            )}
            
            <Chat client={chatClient}>
              <div className="flex h-full">
                <Channel channel={channel}>
                <Window>
          <ChannelHeader />
          <MessageList Message={CustomMessage} />
          <MessageInput grow overrideSubmitHandler={overrideSubmitHandler} />
           </Window>
                </Channel>
              </div>
            </Chat>
          </div>
          
          {/* Steps Section - Responsive Layout */}
          {showSteps && (
            <>
              {/* Mobile Overlay */}
              <div className={`custom-breakpoint:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
                showStepsOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <div className="absolute inset-4 bg-white rounded-lg shadow-xl overflow-hidden">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Step-by-step Guide</h2>
                    <button
                      onClick={() => setShowStepsOverlay(false)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Return to Chat
                    </button>
                  </div>
                  <div className="h-[calc(100%-4rem)] overflow-y-auto">
                    <Steps state={state} />
                  </div>
                </div>
              </div>
              
              {/* Desktop Sidebar */}
              <div className="hidden custom-breakpoint:block w-80 flex-shrink-0 bg-white rounded-lg shadow-lg overflow-hidden pt-4">
              <h2 className="text-xl font-semibold text-gray-800 text-center">Step-by-step Guide</h2>
              <p className="text-gray-600 mt-4 text-lg text-center mb-8">Please follow the steps below</p>
                <Steps state={state} />
              </div>
            </>
          )}
          {
            !showSteps && (
              <div className="hidden custom-breakpoint:block w-80 flex-shrink-0 bg-white rounded-lg shadow-lg overflow-hidden pt-4">
              <h2 className="text-xl font-semibold text-gray-800 text-center">Step-by-step Guide</h2>
              <p className="text-gray-600 mt-4 text-lg text-center">Your step-by-step guide will appear here after a few questions</p>
            </div>
            )}
        </div>
      </main>
    </div>
  )
}
