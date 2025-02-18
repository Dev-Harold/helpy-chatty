'use server'

import { StreamChat } from "stream-chat"

type ChatMessage = {
  messageId: string | undefined
  channelId: string
  text: string | undefined
  userId: string
}

export async function chatSent(message: ChatMessage) {
  try {
    // Log the message details server-side
    console.log(`
      Message ID: ${message.messageId}
      Channel ID: ${message.channelId}
      User ID: ${message.userId}
      Text: ${message.text}
    `);
    
    return { success: true };
  } catch (error) {
    console.error('Error logging message:', error)
    return { success: false, error };
  }
}

const ANON_USER_ID = 'Helpy-Chatty-Anon-User';

export async function getNewTokenAndEnsureChannelIsCreated(channelId: string) {
  const apiKey = process.env.NEXT_PUBLIC_GETSTREAM_APP_KEY!;
  const apiSecret = process.env.GETSTREAM_API_SECRET!;
  if (!apiKey || !apiSecret) {
    throw new Error('GetStream API key or secret not found');
  }
  const streamClient = StreamChat.getInstance(apiKey, apiSecret);
  console.log('Getting new token for channel:', channelId);
  //To Do: Add a user id for authenticated user. 
  await streamClient.upsertUser({
    id: ANON_USER_ID,
    role: 'user',
    name: "Anonymous User",
  });
  const token = streamClient.createToken(ANON_USER_ID, 24*60*60);
  console.log('Token created:', token);

  // Query for existing channel
  const filter = { id: channelId, type: 'messaging' };
  const channels = await streamClient.queryChannels(filter, {}, { watch: false, state: false });
  
  if (channels.length === 0) {
    try {
      //To Do: Add a bot user id so that it is in the channel and can chat. 
      const channel = streamClient.channel('messaging', channelId, {
        members: [ANON_USER_ID],
        created_by_id: ANON_USER_ID,
        name: 'Helping Channel',
      });
      await channel.create();
      console.log('New channel created:', channel.cid);
    } catch (error) {
      console.log('Error creating channel:', error instanceof Error ? error.message : 'unknown error');
    }
  } else {
    console.log('Using existing channel:', channelId);
  }
  
  return { token };
}