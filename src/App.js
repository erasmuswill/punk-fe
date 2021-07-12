import "./App.scss";
import { Suspense, useState, createContext } from "react";
import RandomBeer from "./components/RandomBeer";
import { Divider, PageHeader, Switch } from "antd";
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
        <PageHeader
          ghost={false}
          title={<Title>Punk FE</Title>}
          extra={
            <span className="alcohol-toggle">
              <label>
                <Switch defaultChecked onChange={onAlcoholChange} />
                Show alcoholic beers
              </label>
            </span>
          }
        />
        <Divider />
        <RandomBeer />
        <Divider />
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
