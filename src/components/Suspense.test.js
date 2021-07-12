import { render } from "@testing-library/react";
import React from "react";
import BeerDrawer from "./BeerDrawer";
import BeerItem from "./BeerItem";
import BeerList from "./BeerList";
import RandomBeer from "./RandomBeer";

jest.mock("react", () => {
  const React = jest.requireActual("react");
  React.Suspense = ({ fallback }) => fallback;
  return React;
});

describe("Suspense", () => {
  it("BeerItem", () => {
    const { asFragment } = render(<BeerItem loading />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("BeerList", () => {
    const { asFragment } = render(<BeerList />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("RandomBeer", () => {
    const { asFragment } = render(<RandomBeer />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("BeerDrawer", () => {
    const { asFragment, debug } = render(<BeerDrawer id={11} />);
    debug();
    expect(asFragment()).toMatchSnapshot();
  });
});
