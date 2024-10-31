import { format, isToday, isThisWeek, differenceInHours, differenceInDays, isYesterday } from 'date-fns';
import { ru } from 'date-fns/locale';

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
