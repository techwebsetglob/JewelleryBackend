var figlet = require("figlet");

// Take user input from command line
// Example: node app.js OMEGA
let userInput = process.argv[2] || "Default";

figlet(userInput, function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});
