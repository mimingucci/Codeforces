const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

const dirPath = path.join(__dirname, "sources");

const client = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  Bucket: process.env.S3_BUCKET,
  region: process.env.S3_REGION,
});

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

const readFile = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
  };

  const command = new GetObjectCommand(params);
  const response = await client.send(command);

  const { Body } = response;

  return streamToString(Body);
};

const writeFile = async (format, content) => {
  let filepath = path.join(dirPath, `main.${format}`); // Adjust filepath to include the new folder
  if (format === "java") {
    filepath = path.join(dirPath, `Main.${format}`);
  }
  try {
    await fs.promises.writeFile(filepath, content); // Use fs.promises.writeFile to save the file asynchronously
    return true;
  } catch (error) {
    console.error("Error creating file:", error);
    return false;
  }
};

module.exports = {
  readFile,
  writeFile,
};
