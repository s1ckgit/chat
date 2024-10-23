import { useEffect, useState } from "react";


interface IMessageTypingProps {
  name: string;
}

const MessageTyping = ({ name }: IMessageTypingProps) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length < 3) {
          return prev + '.';
        }
        return '';
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      печатает{dots}
    </>
  );
};

export default MessageTyping;
