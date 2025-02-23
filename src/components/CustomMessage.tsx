import { MessageSimple } from 'stream-chat-react';
import { MessageUIComponentProps } from 'stream-chat-react';

export const CustomMessage = (props: MessageUIComponentProps) => {
    //TO DO: Implement meassage streaming.
    /*
        const { message, renderText } = useMessageContext();
    return <StreamedMessageText message={message} renderText={renderText}/>
    */
  return (
    <MessageSimple
      {...props}
    />
  );
}; 