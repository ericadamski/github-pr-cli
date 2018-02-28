const path = require("path");
const blessed = require("blessed");

let bar;

const EOL = "\r\n";

module.exports = function installCommandBar(parent) {
  bar = blessed.terminal({
    parent,
    cursor: "block",
    cursorBlink: true,
    screenKeys: false,
    left: 0,
    top: "60%",
    width: "100%",
    height: "40%",
    border: "line",
    scrollable: true,
    style: {
      fg: "default",
      bg: "default",
      focus: {
        border: {
          fg: "green"
        }
      }
    }
  });

  bar.on("click", bar.focus.bind(bar));

  bar.pty.write(
    `node ${path.join(__dirname, "..", "commands", "index.js")} ${EOL}`
  );

  bar.focus();
};
