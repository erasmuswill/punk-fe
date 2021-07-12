import { fireEvent, render } from "@testing-library/react";
import * as api from "../../api";
import RandomBeer from "./";
import * as BeerDrawer from "../BeerDrawer";
import TEST_DATA from "../../TEST_DATA.json";

describe("RandomBeer", () => {
  it("shows a random beer", () => {
    const mockMutate = jest.fn();
    jest.spyOn(api, "useRandomBeer").mockImplementation(() => ({
      beer: TEST_DATA.alc_beer,
      loading: false,
      isValidating: false,
      mutate: mockMutate,
    }));
    const { asFragment } = render(<RandomBeer />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("allows a new random beer to be shown", () => {
    const mockMutate = jest.fn();
    jest.spyOn(api, "useRandomBeer").mockImplementation(() => ({
      beer: TEST_DATA.alc_beer,
      loading: false,
      isValidating: false,
      mutate: mockMutate,
    }));
    const { getByText } = render(<RandomBeer />);
    const mutateButton = getByText("Random beer").parentElement; // This matches the span inside the button, calling parentElement to get a reference to the button
    fireEvent.click(mutateButton);
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  it("shows a validation state", () => {
    const mockMutate = jest.fn();
    jest.spyOn(api, "useRandomBeer").mockImplementation(() => ({
      beer: undefined,
      loading: true,
      isValidating: true,
      mutate: mockMutate,
    }));
    const { asFragment } = render(<RandomBeer />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("shows beer details button", () => {
    jest.spyOn(api, "useRandomBeer").mockImplementation(() => ({
      beer: TEST_DATA.alc_beer,
      loading: false,
      isValidating: false,
    }));
    jest.spyOn(BeerDrawer, "default").mockImplementation(({ id }) => {
      return "BeerDrawer:" + id;
    });
    const { getByText } = render(<RandomBeer />);
    const detailButton = getByText("More details").parentElement; // This matches the span inside the button, calling parentElement to get a reference to the button
    fireEvent.click(detailButton);
    expect(getByText("BeerDrawer:" + TEST_DATA.alc_beer.id)).toBeTruthy();
  });
});
