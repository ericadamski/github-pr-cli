const vorpal = require("vorpal")();

vorpal.command("comment", "Write a comment").action((args, cb) => {
  console.log(args);
  cb();
});

vorpal.delimiter("~>").show();

console.clear();
