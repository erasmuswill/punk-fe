import { fireEvent, render } from "@testing-library/react";
import * as api from "../../api";
import * as antd from "antd";
import BeerDrawer from "./";
import TEST_DATA from "../../TEST_DATA.json";

describe("BeerDrawer", () => {
  it("should not render if no ID", () => {
    const { asFragment } = render(<BeerDrawer />);
    expect(asFragment()).toMatchSnapshot();
  });

  it.skip("should render info", () => {
    jest.spyOn(api, "useBeer").mockImplementation(() => ({
      beer: TEST_DATA.alc_beer,
      loading: false,
      isValidating: false,
    }));
    const { debug } = render(<BeerDrawer id={11} />);
    debug();
    // getByText();
    // expect(asFragment()).toMatchSnapshot();
  });
});
