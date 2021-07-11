import { fireEvent, render } from "@testing-library/react";
import * as Criteria from "react-criteria";
import * as api from "../../api";
import BeerList from "./";
import TEST_DATA from "../../TEST_DATA.json";

jest.mock("react-criteria");

describe("BeerList", () => {
  it("shows a list of beer", () => {
    const mockSetSize = jest.fn();
    jest.spyOn(api, "useBeerList").mockImplementation(() => ({
      beers: TEST_DATA.mixed_list,
      isLoadingMore: false,
      size: 1,
      setSize: mockSetSize,
      hasNextPage: false,
    }));
    const { asFragment } = render(<BeerList />);
    expect(asFragment()).toMatchSnapshot();
    expect(api.useBeerList).toHaveBeenCalledTimes(1);
    expect(api.useBeerList).toHaveBeenCalledWith([]);
  });

  it("shows loading state", () => {
    const mockSetSize = jest.fn();
    jest.spyOn(api, "useBeerList").mockImplementation(() => ({
      beers: TEST_DATA.mixed_list,
      isLoadingMore: true,
      size: 1,
      setSize: mockSetSize,
      hasNextPage: false,
    }));
    const { asFragment } = render(<BeerList />);
    expect(asFragment()).toMatchSnapshot();
    expect(api.useBeerList).toHaveBeenCalledTimes(1);
    expect(api.useBeerList).toHaveBeenCalledWith([]);
  });

  it("shows empty state", () => {
    const mockSetSize = jest.fn();
    jest.spyOn(api, "useBeerList").mockImplementation(() => ({
      beers: [],
      isLoadingMore: false,
      size: 1,
      setSize: mockSetSize,
      hasNextPage: false,
    }));
    const { asFragment } = render(<BeerList />);
    expect(asFragment()).toMatchSnapshot();
    expect(api.useBeerList).toHaveBeenCalledTimes(1);
    expect(api.useBeerList).toHaveBeenCalledWith([]);
  });

  it("passes filters to api layer", () => {
    const mockSetSize = jest.fn();
    jest.spyOn(api, "useBeerList").mockImplementation(() => ({
      beers: [],
      isLoadingMore: false,
      size: 1,
      setSize: mockSetSize,
      hasNextPage: false,
    }));
    const { getByText } = render(<BeerList />);
    expect(api.useBeerList).toHaveBeenCalledTimes(1);
    expect(api.useBeerList).toHaveBeenCalledWith([]);
    fireEvent.click(getByText("Add filter"));
    expect(api.useBeerList).toHaveBeenCalledTimes(2);
    expect(api.useBeerList).toHaveBeenLastCalledWith([
      {
        brewed_before: "01-2021",
      },
      { beer_name: "blonde" },
    ]);
  });
});
