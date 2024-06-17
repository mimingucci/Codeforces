const { spawn } = require("child_process");
const path = require("path");

const executeJs = (userInput) => {
  const folderpath = path.join(__dirname, "sources");
  const filepath = path.join(folderpath, "main.js");
  return new Promise((resolve, reject) => {
    const execute = spawn("node", [filepath], {
      input: userInput,
    });

    let output = "";
    let errorOutput = ""; // Variable to store error messages

    // Handling the output of the Python script
    execute.stdout.on("data", (data) => {
      output += data.toString();
    });

    // Handling error output
    execute.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    // Handle errors
    execute.on("error", (err) => {
      reject({ type: "r_error", message: err.message });
    });

    // Handle the child process exit
    execute.on("close", (code) => {
      if (code !== 0) {
        // Non-zero exit code indicates an error
        reject({
          type: "r_error",
          message: `Execution Failed:\n${
            errorOutput || "Unknown runtime error"
          }`,
        });
      } else {
        resolve(output); // Execution was successful, resolve with the output
      }
    });
  });
};

module.exports = {
  executeJs,
};
