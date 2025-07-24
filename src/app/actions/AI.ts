'use server'

import { StreamChat } from "stream-chat"
import Anthropic from '@anthropic-ai/sdk';
import { MessageParam} from "@anthropic-ai/sdk/resources/index.mjs";
import { BOT_USER_ID, ANON_USER_ID } from "@/types/constants";

// Type definitions for Anthropic tool responses
type ToolResponse = {
  input: {
    device?: string;
    version?: string;
    description?: string;
    question?: string;
    goToStepByStep?: boolean;
    reason?: string;
    fitsUserIssue?: boolean;
    steps?: string[];
  };
};

type ChatMessage = {
  messageId: string | undefined
  channelId: string
  text: string | undefined
  userId: string
}
export type State = {
  stage: "reconnaissance" | "step-by-step",
  issue: {
    device: string,
    version: string,
    description: string
  }
  stepGuide: {
    steps: string[],
    currentStep: number,
  }
}
export async function chatSent(message: ChatMessage, state: State) {
  if(state.stage === "reconnaissance") {
    return chatSentReconnaissance(message, state);
  }
  else {
    const apiKey = process.env.NEXT_PUBLIC_GETSTREAM_APP_KEY!;
    const apiSecret = process.env.GETSTREAM_API_SECRET!;
    if (!apiKey || !apiSecret) {
      throw new Error('GetStream API key or secret not found');
    }
    // const streamClient = StreamChat.getInstance(apiKey, apiSecret);
    // const channel = streamClient.channel('messaging', message.channelId);
    return chatSentStepByStep(message, state);
  }
}
async function chatSentReconnaissance(message: ChatMessage, state: State): Promise<{success: boolean, state: State}> {
  try {
    // Log the message details server-side
    const apiKey = process.env.NEXT_PUBLIC_GETSTREAM_APP_KEY!;
    const apiSecret = process.env.GETSTREAM_API_SECRET!;
    if (!apiKey || !apiSecret) {
      throw new Error('GetStream API key or secret not found');
    }
    const streamClient = StreamChat.getInstance(apiKey, apiSecret);
    const channel = streamClient.channel('messaging', message.channelId);
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    const queryResult = await channel.query({
      messages: {
          limit: 50,  // number of messages to return 
      } 
    });
    const channelMessages = queryResult.messages;
    const messageHistory: MessageParam[] = [];
    for(let ctr = 0; ctr < channelMessages.length; ctr++) {
      const message = channelMessages[ctr];
      messageHistory.push({ role: message.user?.id === BOT_USER_ID ? 'assistant' : 'user', content: message.text || "" });
    }
    const messagesHistoryAsString = messageHistory.map(message => `${message.role}: ${message.content}`).join("\n");

      const systemPrompt = `You are a tech support agent for senior citizens. You are helpful and friendly and never give advice that could result in harm.
      You can only use the tool you are given to answer the task in prompt.`
      const tasksPrompt = `Your task is to understand from the conversation the specifics of what the user is having issues with.
      You must use 'store_issue_analysis' tool to store the device, version, and description of the issue. If you are uncertain of any of these, return "unknown".
      If the information is not sufficient, you must ask the user for more information.
      If you have enough information to provide a simple step-by-step solution to the user, you must set goToStepByStep to true.
      If you do not have enough information to provide a simple step-by-step solution to the user, you must set goToStepByStep to false.
      Never Repeat the same question to the user.
      Never ask the user technical questions that the average elderly person would not know the answer to.
      
      Here is the conversation history:
      MESSAGE HISTORY:
      ${messagesHistoryAsString}

      And you current understanding of the issue:
      CURRENT UNDERSTANDING:
    ${JSON.stringify(state)}`
    const initialMessage = await channel.sendMessage({
      text: "...",
    user_id: BOT_USER_ID,  
      is_ai_generated: true,
    });
    const jsonResponse = await anthropic.messages.create({
      model: "claude-3-7-sonnet-latest",
      max_tokens: 1024,
      tools: [{
        name: "store_issue_analysis",
        description: "Send device, version, and description of the issue of the user. If you are uncertain of any of these, return 'unknown'.",
        input_schema: {
          type: "object",
          properties: {
            device: {
              type: "string",
              description: "The type of device the user is having issues with"
            },
            version: {
              type: "string",
              description: "The version of the device the user is having issues with"
            },
            description: {
              type: "string",
              description: "The description of the issue the user is having"
            },
            question: {
              type: "string",
              description: "The next question to ask the user to help you understand the issue and get more information. If you have enough information to provide a simple step-by-step solution to the user and make goToStepByStep true, return something along the lines of 'Great! I have enough information to help you step by step. Let me prepare a guide for you.'"
            },
            goToStepByStep: {
              type: "boolean",
              description: "Indicate if you have enough information to provide a simple step-by-step solution to the user."
            },
            reason: {
              type: "string",
              description: "The justification for goToStepByStep"
            }
          },
          required: ["device", "version", "description", "question", "goToStepByStep", "reason"]
        }
      },  
    ],
      tool_choice: {"type": "tool", "name": "store_issue_analysis"},
      system: systemPrompt,
      messages: [{
        role: "user",
        content: tasksPrompt
      }]
  });
  const newState: State = {
    stage: "reconnaissance",
    issue: {
      device: (jsonResponse.content[0] as ToolResponse).input.device || "unknown",
      version: (jsonResponse.content[0] as ToolResponse).input.version || "unknown",
      description: (jsonResponse.content[0] as ToolResponse).input.description || "unknown"
    },
    stepGuide: {
      steps: [],
      currentStep: 0,
    }
  }
  if((jsonResponse.content[0] as ToolResponse).input.goToStepByStep) {
    newState.stage = "step-by-step";
    // Update the initial placeholder message to indicate we're transitioning to step-by-step
    await streamClient.partialUpdateMessage(initialMessage.message.id, 
      {
        set: {text: (jsonResponse.content[0] as ToolResponse).input.question || ""},
      },
      BOT_USER_ID,
    );
    return await chatSentStepByStep(message, newState);
  }
  else {
  console.log(jsonResponse.content[0], newState);
    const response = (jsonResponse.content[0] as ToolResponse).input.question || "";
    await streamClient.partialUpdateMessage(initialMessage.message.id, 
      {
        set: {text: response},
      },
      BOT_USER_ID,
    );
    console.log(response);
    return {success:true, state:newState};
  }
  //   for await (const chunk of response) {
  //     switch (chunk.type) {
  //       case 'message_start':
  //         console.log('Message started');
  //         break;
  //       case 'content_block_start':
  //         console.log('Content block started');
  //         break;
  //       case 'content_block_delta':
  //         if(chunk.delta.type === 'text_delta') {
  //           fullResponse += chunk.delta.text;
  //           await streamClient.partialUpdateMessage(initialMessage.message.id, 
  //             {
  //               set: {text: fullResponse},
  //             },
  //             BOT_USER_ID,
  //           );
  //         }
  //         break;
  //       case 'content_block_stop':
  //         console.log('Content block ended');
  //         break;
  //       case 'message_delta':
  //         console.log('Message metadata updated:', chunk.delta);
  //         break;
  //       case 'message_stop':
  //         console.log('Message completed');
  //         break;
  //     }
  //   }
  //   return { success: true };
  // } catch (error) {
  //   console.error('Error logging message:', error)
  //   return { success: false, error };
  // }
  return { success: true, state: newState };
} catch (error) {
  console.error('Error logging message:', error)
  return { success: false, state: state };
}
}
async function chatSentStepByStep(message: ChatMessage, state: State) {
  const apiKey = process.env.NEXT_PUBLIC_GETSTREAM_APP_KEY!;
  const apiSecret = process.env.GETSTREAM_API_SECRET!;
  if (!apiKey || !apiSecret) {
    throw new Error('GetStream API key or secret not found');
  }
  const streamClient = StreamChat.getInstance(apiKey, apiSecret);
  const channel = streamClient.channel('messaging', message.channelId);
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  const queryResult = await channel.query({
    messages: {
        limit: 50,  // number of messages to return 
    } 
  });
  const channelMessages = queryResult.messages;
  const messageHistory: MessageParam[] = [];
  for(let ctr = 0; ctr < channelMessages.length; ctr++) {
    const message = channelMessages[ctr];
    messageHistory.push({ role: message.user?.id === BOT_USER_ID ? 'assistant' : 'user', content: message.text || "" });
  }
  const messagesHistoryAsString = messageHistory.map(message => `${message.role}: ${message.content}`).join("\n");
    const systemPrompt = `You are a tech support agent for senior citizens. You are helpful and friendly and never give advice that could result in harm. 
    Based off of your current understanding, you are to guide the user through a step-by-step guide on how to solve their issue.
    You must use 'step_by_step_instructions' tool to provide step by step instructions.`
    const tasksPrompt = `Your task is to guide the user through a step-by-step guide on how to solve their issue.
    Do not include any other text or formatting in the steps.
    You must use 'step_by_step_instructions' tool to provide step by step instructions.
    You MUST include the step number in the step by step instructions.
    Here is the conversation history:
    MESSAGE HISTORY:
    ${messagesHistoryAsString}

    And you current understanding of the issue:
    CURRENT UNDERSTANDING:
    ${JSON.stringify(state)}`
    const jsonResponse = await anthropic.messages.create({
      model: "claude-3-7-sonnet-latest",
      max_tokens: 1024,
      tools: [{
        name: "step_by_step_instructions",
        description: "Provide step by step instructions to the user to solve their issue.",
        input_schema: {
          type: "object",
          properties: {
            steps: {
              type: "array",
              description: "The step by step instructions to the user to solve their issue. Format in numerial order.",
              items: {
                type: "string",
                description: "single instruction to the user to solve their issue. Do not include any other text, nor any numbers for formatting."
              }
            },
            fitsUserIssue: {
              type: "boolean",
              description: "Indicate if the step by step instructions fit the user's issue. If user provides a different issue than established, return false."
            }
          },
          required: ["steps", "fitsUserIssue"]
        }
      }],
      tool_choice: {"type": "tool", "name": "step_by_step_instructions"},
      system: systemPrompt,
      messages: [{
        role: "user",
        content: tasksPrompt
      }]
    });
  console.log(jsonResponse.content[0], state);
  if((jsonResponse.content[0] as ToolResponse).input.fitsUserIssue) {
    const newState: State = {
      stage: "step-by-step",
      issue: {
        device: state.issue.device,
        version: state.issue.version,
        description: state.issue.description
      },
      stepGuide: {
        steps: (jsonResponse.content[0] as ToolResponse).input.steps || [],
        currentStep: 1,
      }
    }
  return {success:true, state: newState};
  }
  else {
    const newState: State = {
      stage: "reconnaissance",
      issue: {
        device: state.issue.device,
        version: state.issue.version,
        description: state.issue.description
      },
      stepGuide: {
        steps: [],
        currentStep: 0,
      }
    }
    return chatSentReconnaissance(message, newState);
  }
}
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
  await streamClient.upsertUser({
    id: BOT_USER_ID,
    role: 'user',
    name: "Bot User",
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
        members: [ANON_USER_ID, BOT_USER_ID],
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