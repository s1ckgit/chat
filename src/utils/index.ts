import { format, isToday, isThisWeek, differenceInHours, differenceInDays, isYesterday } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Socket } from 'socket.io-client';
import { ExternalToast, toast } from 'sonner';

export function trimTrailingWhitespace(text: string): string {
  return text.replace(/[\s\n\r]+$/g, '');
}

export const setupSocketsErrorHandler = (sockets: Socket[]) => {
  const handleError = (error: { error: { message: string } }) => {
    toast.error(error.error.message, defaultToastConfig);
  };

  sockets.forEach((socket) => {
    socket.off('error', handleError);
    socket.on('error', handleError);
  });

  return () => {
    sockets.forEach((socket) => {
      socket.off('error', handleError);
    });
  };
};

export const onAuthSuccess = (data: { id: string; }) => {
  localStorage.setItem('id', data.id);
  window.location.reload();
};

export const scrollChat = (chatWindowElement: HTMLDivElement, messageId: string | null, smooth?: boolean) => {
  if(!messageId) {
    chatWindowElement.scrollTop = chatWindowElement.scrollHeight;
    return;
  }

  const messageElement = chatWindowElement.querySelector(`[data-message-id="${messageId}"]`);

  if(!messageElement) {
    requestAnimationFrame(() => {
      chatWindowElement.scrollTop = chatWindowElement.scrollHeight;
    });
    return;
  }

  requestAnimationFrame(() => {
    messageElement.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'center' });
  });

};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const enableSocketEventListeners = (socket: Socket, config: {eventName: string; eventCallback: (vars: any) => void}[]) => {
  config.forEach((event) => {
    socket.off(event.eventName, event.eventCallback);
    socket.on(event.eventName, event.eventCallback);
  });

  return () => {
    config.forEach((event) => {
      socket.off(event.eventName, event.eventCallback);
    });
  };
};

export const formatDate = (date: string) => {
  if(isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isThisWeek(date, { weekStartsOn: 1 })) {
    return format(date, 'EEE', { locale: ru });
  } else {
    return format(date, 'dd.MM.yyyy');
  }
};

export const formatStatus = (input: string): string => {
  if (input === 'online') return input;

  const timestamp = Number(input.split(':')[1]);
  const date = new Date(timestamp);

  const now = Date.now();
  const diffHours = differenceInHours(now, date);
  const diffDays = differenceInDays(now, date);

  if (diffHours < 1) {
    return 'был в сети недавно';
  } else if (diffHours < 24) {
    return `был в сети сегодня в ${format(date, 'HH:mm')}`;
  } else if (isYesterday(date)) {
    return 'был в сети вчера';
  } else if (diffDays < 365) {
    return `был в сети ${format(date, 'dd.MM')}`;
  } else {
    return `был в сети ${format(date, 'dd.MM.yyyy')}`;
  }
};

export const preloadImages = async (urls: string[]) => {
  return new Promise((resolve) => {
    const isLoaded = [];

    urls.forEach(url => {
      const img = new Image();
      img.src = url;

      const onComplete = () => {
        isLoaded.push(url);
        if (isLoaded.length === urls.length) {
          resolve(true);
        }
      };

      img.onload = onComplete;
      img.onerror = onComplete;
    });
  });
};

export const buildGridForAttachments = (count: number) => {
  if(count > 9 || count < 1) return {};

  const baseStyle = {
    display: 'grid',
    gap: 1,
    borderRadius: '24px',
    overflow: 'hidden',
  };

  switch(count) {
    case 1:
      return {
        ...baseStyle,
        gridTemplateColumns: '1fr',
      };
      
    case 2:
      return {
        ...baseStyle,
        gridTemplateColumns: '60% 40%',
      };

    case 3:
      return {
        ...baseStyle,
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'auto auto',
        '& > :nth-of-type(1)': {
          gridColumn: 'span 2',
        },
      };

    case 4:
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: 'minmax(150px, auto)',
        '& > :nth-of-type(1)': {
          gridColumn: 'span 3'
        }
      };
    case 5: 
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: 'minmax(150px, auto)',
        '& > :nth-of-type(1)': {
          gridColumn: 'span 2',
        },
      };
    case 6: 
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: 'minmax(250px, auto)'
      };
    case 7: 
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: 'minmax(150px, auto)',
        '&  > :nth-of-type(1)': {
          gridColumn: 'span 3'
        }
      };
    case 8: 
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: 'minmax(150px, auto)',
        '& > :nth-of-type(1)': {
          gridColumn: 'span 2'
        }
      };
    case 9: 
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: 'minmax(150px, auto)',
      };
  }
};

export const buildGridForAttachmentsModal = (count: number) => {
  const baseStyle = {
    display: 'grid',
    gap: 1,
    borderRadius: '16px',
    overflow: 'hidden',
    maxHeight: '400px',
    width: '320px',
  };

  switch (count) {
    case 1:
      return {
        ...baseStyle,
        gridTemplateColumns: '1fr',
      };

    case 2:
      return {
        ...baseStyle,
        gridTemplateColumns: '60% 40%',
      };

    case 3:
      return {
        ...baseStyle,
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '200px 1fr',
        '& > :nth-of-type(1)': {
          gridColumn: 'span 2',
        }
      };

    case 4:
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
      };

    case 5:
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: '25% 25% 50%',
        '& > :nth-of-type(1)': {
          gridColumn: 'span 2',
          order: '1'
        }
      };
    case 6:
      return {
        ...baseStyle,
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'repeat(3, 33.3%)',
      };

    case 7:
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 33.3%)',
        '& > :nth-of-type(1)': {
          gridColumn: 'span 3',
          order: '1'
        }
      };
    case 8:
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 33.3%)',
        '& > :nth-of-type(1)': {
          gridColumn: 'span 2'
        }
      };
    case 9:
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: 'minmax(100px, 1fr)',
      };

    default:
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: 'minmax(100px, 1fr)',
      };
  }
};

export const defaultToastConfig: ExternalToast = {
  closeButton: true,
  duration: 3000
};
