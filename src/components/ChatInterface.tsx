'use client'

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
} from "stream-chat-react"
import "stream-chat-react/dist/css/v2/index.css"

// Stream chat configuration
const apiKey = 'saqx9aqwu678'
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

export default function ChatInterface() {
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: user,
  })

  if (!client) return <div>Loading chat client...</div>

  const handleMessage = async (message: { text: string }) => {
    try {
      // Call the server action to log the message
      const response = await fetch('/api/log-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.text, userId }),
      })
      
      if (!response.ok) {
        console.error('Failed to log message')
      }
    } catch (error) {
      console.error('Error logging message:', error)
    }
    
    return message // Return the message to allow Stream Chat to continue processing
  }

  return (
    <div className="h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden">
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
              <Window>
                <MessageList />
                <MessageInput 
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  overrideSubmitHandler={async (message, _channelCid) => {
                    if (message.text) {
                      await handleMessage({ text: message.text })
                    }
                  }}
                />
              </Window>
              <Thread />
            </Channel>
          </div>
        </div>
      </Chat>
    </div>
  )
}