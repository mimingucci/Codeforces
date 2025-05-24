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

export interface VerificationNotificationMessage {
  email: string;
  verificationCode: String;
}

export interface WelcomeNotificationMessage {
  email: string;
}

export interface ForgotPasswordNotificationMessage {
  email: string;
  forgotPasswordToken: string;
}

export interface PasswordChangedNotificationMessage {
  email: string,
  createdAt: number,
}