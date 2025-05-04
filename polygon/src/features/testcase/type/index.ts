export interface TestcaseCreate {
  input: string;
  output: string;
  problem: string;
}

export interface TestcaseCreateBatch {
  data: TestcaseCreate[];
  problem: string;
}

export interface Testcase {
  input: string;
  output: string;
  id: string;
  problem: string;
}
