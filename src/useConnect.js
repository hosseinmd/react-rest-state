const { useEffect, useState } = require("react");
const {
  createContext,
  addToConnections,
  createUnsubscribe
} = require("./connect");

function useConnect(func, states, options = {}) {
  const [count, setCount] = useState(1);
  const forceUpdate = () => {
    setCount(count + 1);
  };
  if (!useEffect) throw "useEffect unsupported";
  useEffect(() => {
    if (typeof func != "function") func = forceUpdate;

    const context = createContext(func);
    addToConnections(context, states, options);

    return createUnsubscribe(context, states);
  }, []);
}

exports.useConnect = useConnect;
