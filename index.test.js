const { init, state, setState, connect } = require("./index");

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
