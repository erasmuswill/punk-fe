import "./App.scss";
import { Suspense, useState, createContext } from "react";
import RandomBeer from "./components/RandomBeer";
import { Switch } from "antd";
import { mutate } from "swr";

const ShowAlcoholicContext = createContext(true);

function App() {
  const [showAlcoholic, setShowAlcoholic] = useState(true);

  function onAlcoholChange(value) {
    setShowAlcoholic(value);
    mutate("/beers/random");
  }

  return (
    <ShowAlcoholicContext.Provider value={showAlcoholic}>
      <div className="App">
        <span>
          <label>
            Show alcoholic beers
            <Switch defaultChecked onChange={onAlcoholChange} />
          </label>
        </span>
        <RandomBeer />
      </div>
    </ShowAlcoholicContext.Provider>
  );
}

const SuspenseWrappedApp = (props) => (
  <Suspense fallback={<img height="300" src="/loader-op.gif" />}>
    <App {...props} />
  </Suspense>
);

export default SuspenseWrappedApp;
export { ShowAlcoholicContext };
