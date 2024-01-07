#!/usr/bin/env node

//TOGGLED Command Line Interface. ZYMONO LICENSE
// Copyright (c) 2024 Zymono

const { program } = require("commander");
const fs = require("fs");
const https = require("https");
const inquirer = require("inquirer");
const temp = require("temp");

// Create a temporary directory
// temp.track();
// const tempDir = temp.mkdirSync();
const tempFilePath = '.toggled/temp.json';
try {
  const directoryPath = './.toggled';
  

  fs.mkdir(directoryPath, (err) => {
      if (err) {
          // console.error(`Error creating directory: ${err}`);
      } else {
          // console.log(`Directory created successfully at: ${directoryPath}`);
      }
  });
} catch {}

const auth = {};

// Function to read the JSON file and parse it
function readToggledJson() {
  try {
    // Read the contents of toggled.json synchronously
    const jsonData = fs.readFileSync("toggled.json", "utf-8");

    // Parse the JSON data into a JavaScript object
    const jsonObject = JSON.parse(jsonData);

    return jsonObject;
  } catch (error) {
    console.error("Error reading or parsing toggled.json:", error.message);
    return null;
  }
}

program
  .command("init <type>")
  .description("Initialize the toggled.json file")
  .action((type) => {
    const filePath = "toggled.json"; // Replace with your desired file path

    const fileContents = `{
  "name": "Toggled",
  "version": "1.0.0",
  "description": "Design something great.",
  "main": "index.js",
  "type": "${type}"
}
`;

    // Use fs.writeFile to create the file with the specified contents
    fs.writeFile(filePath, fileContents, (err) => {
      if (err) {
        console.error("Error creating file:", err);
      } else {
        console.log(`Successfully created toggled.json with type: ${type}`);
      }
    });
  });

program
  .command("package")
  .description("Publish a Toggled package to the Toggled Package Registry")
  .action(() => {
    try {
      const toggledData = readToggledJson();
      if (!fs.readFileSync(tempFilePath, "utf-8")) {
        console.log(
          "You must sign in to use this command. Sign in by running: toggled login.",
        );
      } else {
        if (toggledData.type !== "package") {
          console.log("ERROR: The specified project is not a package.");
        } else {
          console.log("Publishing package to the Toggled Package Registry...");

          const blocks = fs.readFileSync(toggledData.main, "utf-8");
          toggledData.code = blocks;
          toggledData.author = fs.readFileSync(tempFilePath, "utf-8");
          // Perform the necessary actions to publish the package to the Toggled Package Registry

          const data = JSON.stringify(toggledData);

          const options = {
            hostname: "toggled.tech",
            port: 443,
            path: "/api/v1/packages/publish",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": data.length,
            },
          };

          const req = https.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            res.setEncoding("utf8");
            res.on("data", (chunk) => {
              if (res.statusCode === 200 && !chunk.includes('You are not authorized')) {
                console.log(
                  "Sucessfully published package to the Toggled Package Registry.",
                );
              }
            });
          });

          req.on("error", (e) => {
            console.error(`Problem with request: ${e.message}`);
          });

          // Write data to request body
          req.write(data);
          req.end();
        }
      }
    } catch (error) {
      console.log(
        "You must sign in to use this command. Sign in by running: toggled login. " + error,
      );
    }
  });

program
  .command("login")
  .description("Login to the Toggled Package Registry")
  .action(() => {
    try {
      const data = JSON.stringify({});

      const options = {
        hostname:
          "toggled.tech",
        port: 443,
        path: "/api/v1/auth",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length,
        },
      };

      const req = https.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          if (res.statusCode === 200) {
            console.log(
              `Please sign into your Toggled account at ${
                JSON.parse(chunk).url
              }`,
            );
            const prompt = inquirer.createPromptModule();
            prompt([
              {
                type: "input",
                name: "auth",
                message: "Please enter the code you were given:",
              },
            ]).then((answers) => {
              const code = answers.auth;

              https
                .get(
                  `https://toggled.tech/api/v1/auth/${code}`,
                  (res) => {
                    let data = "";

                    res.on("data", (chunk) => {
                      data += chunk;
                    });

                    res.on("end", () => {
                      try {
                        const json = data;
                        if (!String(json).includes("firebase") && !String(json).includes("html")) {
                          const filePath = './.toggled/temp.json';;

                          // Create a file and write content to it
                          fs.writeFile(filePath, json, (err) => {
                              if (err) {
                                console.log("Authentication failed! " + err);
                              } else {
                                console.log("Authentication successful");
                              }
                          });
                        } else {
                          console.log("Authentication failed!");
                        }
                      } catch (e) {
                        console.error("Error parsing JSON:", e);
                      }
                    });
                  },
                )
                .on("error", (e) => {
                  console.error(`HTTPS GET request failed: ${e.message}`);
                });
            });
          }
        });
      });

      req.on("error", (e) => {
        console.error(`Problem with request: ${e.message}`);
      });

      // Write data to request body
      req.write(data);
      req.end();
    } catch (error) {
      console.error("There was an error:", error.message);
    }
  });

program.parse(process.argv);
