export enum ContestType {
  SYSTEM = 'SYSTEM',
  ICPC = 'ICPC',
  GYM = 'GYM',
  NORMAL = 'NORMAL',
}

export interface ContestCreate {
  name: string;
  startTime: Date;
  endTime: Date;
  enabled: boolean;
  authors: string[];
  coodinators: string[];
  testers: string[];
}

export interface ContestUpdate {
  name?: string;
  startTime?: Date;
  endTime?: Date;
  enabled?: boolean;
  authors?: string[];
  coodinators?: string[];
  testers?: string[];
}

export interface Contest {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  enabled: boolean;
  authors: string[];
  coodinators: string[];
  testers: string[];
  type: ContestType;
  createdBy: string;
}
