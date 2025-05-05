import { format, formatDuration, intervalToDuration } from 'date-fns';

export const formatContestDate = (date: string) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm');
};

export const formatContestDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const duration = intervalToDuration({ start, end });

  return formatDuration(duration, {
    format: ['hours', 'minutes'],
    zero: true,
    delimiter: ':',
  });
};

export const isContestActive = (startTime: string, endTime: string) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  return now >= start && now < end;
};

export const isContestPast = (endTime: string) => {
  return new Date() > new Date(endTime);
};

export const convertUnixFormatToDate = (timestamp: string) => {
  // Split into seconds and nanoseconds
  const [seconds, nanos] = timestamp.split('.');
  // Convert seconds to milliseconds and create Date
  return new Date(parseInt(seconds) * 1000);
};
