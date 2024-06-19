const Queue = require("bull");
const Submission = require("./models/submission");
const Problem = require("./models/problem");
const { executeCpp } = require("./execute/cplusplus");
const { executeJava } = require("./execute/java");
const { executePy } = require("./execute/python");
const { executeJs } = require("./execute/java_script");
const { readFile, writeFile } = require("./execute/makeFile");
const submitQueue = new Queue("submissions-queue", {
  redis: { host: "redis", port: 6379 },
});

async function executeJob(data) {
  try {
    const userInput = data.input;
    const job = data.submit;
    if (job.language === "cpp" || job.language === "c") {
      return executeCpp(userInput || "");
    } else if (job.language === "java") {
      return executeJava(userInput || "");
    } else if (job.language === "python") {
      return executePy(userInput || "");
    } else {
      return executeJs(userInput || "");
    }
  } catch (error) {
    console.log(error);
  }
}

async function checkTestcases(job, testcases) {
  for (const testcase of testcases) {
    const output = await executeJob({ submit: job, input: testcase.input });
    if (output.trim() !== testcase.output.trim()) return false;
  }
  return true;
}

async function checkTestcases(job, testcases) {
  for (const testcase of testcases) {
    const output = await executeJob({ ...job, userInput: testcase.input });
    if (output.trim() !== testcase.output.trim()) return false;
  }
  return true;
}

async function processSubmission(job) {
  const problem = await Problem.findById(job.problem);
  if (!problem) throw new Error(`Cannot find problem with id ${job.problem}`);

  const startTime = new Date().getTime(); // Start time for execution
  let passed = await checkTestcases(job, problem.testcases);
  const endTime = new Date().getTime(); // End time for execution

  const executionTime = endTime - startTime; // Calculate execution time
  job.time = executionTime / 2;
  if (executionTime / 2 > problem.timelimit * 1000) {
    job.status = "Time Limit Exceed"; // Set verdict as TLE if execution time exceeds the limit
    job.time = executionTime / 2;
    passed = false;
  } else {
    job.status = passed ? "Accepted" : job.status || "Wrong Answer"; // Set verdict based on test case results
  }
  if (passed) {
    problem.submissions.push(job._id);
    await problem.save();
  }
}

async function processJob(jobId) {
  const job = await Submission.findById(jobId);
  if (!job) throw new Error(`Cannot find submission with id ${jobId}`);
  const rs = await readFile(job.code);
  const result = await writeFile(job.language, rs);
  job.status = "Running";
  await job.save();
  try {
    await processSubmission(job);
  } catch (err) {
    job.status = err.type;
    job.output = err.message;
  } finally {
    await job.save();
  }
}

submitQueue.process(5, async ({ id }) => {
  await processJob(id);
});

submitQueue.on("failed", (error) => {
  console.error(`Job ${error.data.id} failed: ${error.failedReason}`);
});

module.exports = {
  addSubmitToQueue: async (submitId) => {
    const submit = await Submission.findById(submitId);
    if (!submit) throw new Error(`Cannot find submission with id ${jobId}`);
    await submitQueue.add({ id: submitId });
  },
};
