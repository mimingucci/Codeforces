export interface ProblemCreate {
  title: string;
  statement: string;
  solution: string;
  timeLimit: number;
  memoryLimit: number;
  rating: number;
  score: number;
  contest: string;
  tags: string[];
}

export interface ProblemUpdate {
  title?: string;
  statement?: string;
  solution?: string;
  timeLimit?: number;
  memoryLimit?: number;
  rating?: number;
  score?: number;
  contest?: string;
  tags?: string[];
}

export interface Problem {
  id: string;
  title: string;
  statement: string;
  solution: string;
  timeLimit: number;
  memoryLimit: number;
  rating: number;
  score: number;
  contest: string;
  tags: string[];
}
