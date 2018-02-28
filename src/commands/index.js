const vorpal = require("vorpal")();
const login = require("./login/login");
const list = require("./list/list");

vorpal
  .command("login", "Allow access to actually review your pull requests")
  .action((args, cb) => {
    login().subscribe(cb);
  });

vorpal
  .command(
    "list <repo>",
    "list all active pull requests on github for the specified repository"
  )
  .action((args, cb) => {
    list(args.repo).subscribe(cb);
  });

vorpal
  .command("clear", "Clear the current visible screen.")
  .action((args, cb) => {
    console.clear();
    cb();
  });

vorpal.delimiter("~>").show();
