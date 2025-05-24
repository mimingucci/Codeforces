import { User } from 'features/user/type';

export enum ContestType {
  SYSTEM = 'SYSTEM',
  ICPC = 'ICPC',
  GYM = 'GYM',
  NORMAL = 'NORMAL',
}

export interface ContestCreate {
  name: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
  authors: string[];
  coordinators: string[];
  testers: string[];
}

export interface ContestUpdate {
  name?: string;
  startTime?: string;
  endTime?: string;
  enabled?: boolean;
  authors?: string[];
  coordinators?: string[];
  testers?: string[];
  type?: ContestType;
}

export interface Contest {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
  authors: string[];
  coordinators: string[];
  testers: string[];
  type: ContestType;
  createdBy: string;
}

export interface ContestStaffMember extends User {
  role: 'AUTHOR' | 'COORDINATOR' | 'TESTER';
}
