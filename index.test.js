const {
  init,
  state,
  setState,
  connect,
  forceUpdate,
  useConnect
} = require("./index");

init({
  name: "hossein",
  family: "mohammadi"
});
function printName() {
  console.log(state.name);
}
printName();
connect(
  printName,
  ["name", "family"]
);
setState({ name: "jone", family: "jakson" });

forceUpdate(["family"]);

function MyComponent(props) {
  //if first argumant is a function and runinng when state did update else component will be update
  useConnect(null, ["name"]);
  return state.name;
}
