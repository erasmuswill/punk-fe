import "./App.scss";
import { Suspense, useState, createContext } from "react";
import RandomBeer from "./components/RandomBeer";
import { Switch } from "antd";
import { mutate } from "swr";
import BeerList from "./components/BeerList";
import Title from "antd/lib/typography/Title";

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
        <Title level={1}>Punk FE</Title>
        <div style={{ height: "30px" }}>
          <span className="alcohol-toggle">
            <label>
              <Switch defaultChecked onChange={onAlcoholChange} />
              Show alcoholic beers
            </label>
          </span>
        </div>
        <RandomBeer />
        <Title>All beer</Title>
        <BeerList />
      </div>
    </ShowAlcoholicContext.Provider>
  );
}

const SuspenseWrappedApp = (props) => (
  <Suspense fallback={<img height="300" src="/loader-op.gif" alt="Loading" />}>
    <App {...props} />
  </Suspense>
);

export default SuspenseWrappedApp;
export { ShowAlcoholicContext };
