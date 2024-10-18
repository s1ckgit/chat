import { format, isToday, isThisWeek } from 'date-fns';
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
