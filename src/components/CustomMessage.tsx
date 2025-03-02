import { MessageSimple, useMessageContext } from 'stream-chat-react';
import { MessageUIComponentProps } from 'stream-chat-react';
import { useEffect, useRef } from 'react';
import { BOT_USER_ID } from '@/types/constants';

export const CustomMessage = (props: MessageUIComponentProps) => {
  const { message } = useMessageContext();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  // Set up ResizeObserver to detect height changes
  useEffect(() => {
    if (!messageRef.current || message.user?.id !== BOT_USER_ID) {
      return;
    }
    
    const resizeObserver = new ResizeObserver(() => {
      // When the message div changes size, scroll to the bottom
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Start observing the message element
    resizeObserver.observe(messageRef.current);

    setTimeout(() => {
      resizeObserver.disconnect();
    }, 30000);
    
    return () => {
      // Clean up the observer when component unmounts
      resizeObserver.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div ref={messageRef}>
        <MessageSimple
          {...props}
          isMessageAIGenerated={() => message.user?.id === BOT_USER_ID}
        />
      </div>
      <div ref={messageEndRef} />
    </>
  );
}; 