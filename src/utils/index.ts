import { format, isToday, isThisWeek, differenceInHours, differenceInDays, isYesterday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { IPendingMessage } from '../types';
import axios from 'axios';

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

export function isPendingMessage(message: Message | IPendingMessage): message is IPendingMessage {
  return (message as IPendingMessage).attachmentProgress !== undefined; 
}

export const preloadImageWithProgress = async (url: string, onProgress: ({ conversationId, messageId, progress }) => void, onProgressVars: { conversationId: string, messageId: string }) => {
  const { conversationId, messageId } = onProgressVars;
  try {
    const response = await axios.get(url, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        const total = progressEvent.total;
        const loaded = progressEvent.loaded;
        const percentCompleted = Math.floor((loaded / total!) * 100);
        onProgress({ conversationId, messageId, progress: percentCompleted }); // Передаем процент загрузки в функцию обратного вызова
      },
    });

    // Создаем URL для изображения после завершения загрузки
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error);
    throw error;
  }
};

export const preloadPreview = async (url: string) => {
  try {
    const response = await axios.get(url, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error);
    throw error;
  }
};
