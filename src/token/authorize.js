const fetch = require("node-fetch");

const { Observable } = require("rxjs/Observable");
require("rxjs/add/observable/fromPromise");

// function authorize() {
//   return Observable.fromPromise(
//     new Promise((resolve, reject) =>
//       oauth(
//         {
//           name: "github-pr-cli",
//           scopes: ["repo"],
//           prompt: {
//             username: "Enter Github username:",
//             password: "Enter Github password:",
//             code: "Enter two-factor authorisation code"
//           }
//         },
//         (err, token) => {
//           console.log(err, token);

//           return err ? reject(err) : resolve(token);
//         }
//       )
//     )
//   );
// }

module.exports = { authorize };
