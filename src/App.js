import "./App.scss";
import { Suspense, useState, createContext } from "react";
import RandomBeer from "./components/RandomBeer";
import { Switch } from "antd";
import { mutate } from "swr";
import BeerList from "./components/BeerList";

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
        <div>
          <span className="alcohol-toggle">
            <label>
              <Switch defaultChecked onChange={onAlcoholChange} />
              Show alcoholic beers
            </label>
          </span>
        </div>
        <RandomBeer />
        <BeerList />
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
