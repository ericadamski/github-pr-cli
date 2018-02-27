const blessed = require("blessed");
const installCommandBar = require("./src/ui/command-bar");

const screen = blessed.screen({
  fastCSR: true,
  autoPadding: true,
  terminal: "xterm-256color",
  dockBorders: true,
  fullUnicode: true
});

screen.title = "github-pr-cli";

const background = blessed.box({
  top: "center",
  left: "center",
  width: "100%",
  height: "100%",
  content: "hello",
  tag: true,
  style: {
    bg: "magenta"
  }
});

screen.append(background);

installCommandBar(background);

screen.key("q", () => process.exit(0));

screen.render();
