'use server'

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
    `)
    
    return { success: true }
  } catch (error) {
    console.error('Error logging message:', error)
    return { success: false, error }
  }
}
