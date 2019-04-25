# react-rest-state

![alt text](https://raw.githubusercontent.com/hosseinmd/react-rest-state/master/react-rest-state.png)

[![NPM](https://nodei.co/npm/react-rest-state.png)](https://nodei.co/npm/react-rest-state/)

[![install size](https://packagephobia.now.sh/badge?p=react-rest-state)](https://packagephobia.now.sh/result?p=react-rest-state) [![dependencies](https://david-dm.org/hosseinmd/react-rest-state.svg)](https://david-dm.org/hosseinmd/react-rest-state.svg)

# react-rest-state

easy state managment with high performance

## install

```npm
npm i react-rest-state --save
```

## use

```javascript
import { init, state, setState, forceUpdate } from "react-rest-state";
...
init({
  name: "alli"
});
...
console.log(state.name)
```

### setState

```javascript
setState({ name: "mikel" });
```

or

```javascript
setState(prevState => {
  return { name: prevState.name + " mikel" };
});
```

callback

```javascript
setState({ name: "mikel" }, () => {
  console.log(state.name);
});
```

### connect

```javascript
import { connect, state, setState } from "react-rest-state";

class app extends React.Component {
  disconnect = connect(
    this,
    ["state1"]
  );
  render() {
    return (
      <View>
        <Text>{state.name}</Text>
        <Button
          title={"change"}
          onPress={() => {
            setState({ name: "jone" });
          }}
        />
      </View>
    );
  }
  componentWillUnmount() {
    this.disconnect();
  }
}
```

callback

```javascript
connect(
  this,
  ["name"],
  callbackFunc
);
```

connect function to states
run function when states did update

```javascript
connect(() => {
  console.log(state.name);
}, ["name"]);
```

### forceUpdate

```javascript
forceUpdate(["mikel"],callback);
```
