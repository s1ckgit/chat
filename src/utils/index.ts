import { format, isToday, isThisWeek, differenceInHours, differenceInDays, isYesterday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { IPendingMessage } from '../types';
import axios, { AxiosResponse } from 'axios';

export const formatDate = (date: Date) => {
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

  // Парсим таймстамп из строки после двоеточия
  const timestamp = Number(input.split(':')[1]);
  const date = new Date(timestamp);

  const now = Date.now();
  const diffHours = differenceInHours(now, date);
  const diffDays = differenceInDays(now, date);

  if (diffHours < 1) {
    return 'last seen recently';
  } else if (diffHours < 24) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return 'yesterday';
  } else if (diffDays < 365) {
    return format(date, 'dd.MM');
  } else {
    return format(date, 'dd.MM.yyyy');
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
        gridTemplateColumns: '70% 30%',
      };

    case 3:
      return {
        ...baseStyle,
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto',
        '& > :nth-of-type(1)': {
          gridColumn: 'span 2',
        },
      };

    case 4:
    default:
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridAutoRows: 'minmax(100px, auto)',
        '& > :nth-of-type(1)': {
          gridColumn: 'span 2',
        },
      };
  }
};
