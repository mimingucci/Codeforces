export interface UserNotificationMessage {
  userId: string;
  recipient: string;
  templateName: string;
  subject: string;
  data: Record<string, any>;
}

export interface ContestNotificationMessage {
  contestId: string;
  contestName: string;
  startTime: string;
  endTime: string;
  participants: string[];
}

export interface SystemNotificationMessage {
  type: string;
  message: string;
  targets: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}