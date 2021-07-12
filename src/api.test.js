import { renderHook } from "@testing-library/react-hooks";
import * as SWR from "swr";
import TEST_DATA from './TEST_DATA.json'

import { useBeer, useBeerList, useRandomBeer } from "./api";
import { ShowAlcoholicContext } from "./App";
const mockBeer = [TEST_DATA.alc_beer],
  mockError = { message: "An error has occurred!" };

const wrapper = ({ showAlcholic: value, children }) => (
  <ShowAlcoholicContext.Provider value={value}>
    {children}
  </ShowAlcoholicContext.Provider>
);

describe("useRandomBeer", () => {
  test("should provide random beer on API success", () => {
    jest.spyOn(SWR, "default").mockImplementation((url, config) => ({
      data: mockBeer,
      error: undefined,
    }));
    const {
      result: { current: result },
    } = renderHook(() => useRandomBeer(), { wrapper });
    expect(SWR.default).toBeCalledWith("/beers/random", expect.anything());
    expect(result.error).toBeUndefined();
    expect(result.beer).toBe(mockBeer[0]);
  });

  test("should pass error on API failure", () => {
    jest.spyOn(SWR, "default").mockImplementation((url, config) => ({
      data: undefined,
      error: mockError,
    }));
    const {
      result: { current: result },
    } = renderHook(() => useRandomBeer(), { wrapper });
    expect(SWR.default).toBeCalledWith("/beers/random", expect.anything());
    expect(result.beer).toBeUndefined();
    expect(result.error).toBe(mockError);
  });
});

describe("useBeer", () => {
  test("should provide beer on API success", () => {
    jest.spyOn(SWR, "default").mockImplementation((url, config) => ({
      data: mockBeer,
      error: undefined,
    }));
    const {
      result: { current: result },
    } = renderHook(() => useBeer(11));
    expect(SWR.default).toBeCalledWith("/beers/11", expect.anything());
    expect(result.error).toBeUndefined();
    expect(result.beer).toBe(mockBeer[0]);
  });

  test("should not call API if ID not present", () => {
    jest.spyOn(SWR, "default").mockImplementation((url, config) => ({
      data: undefined,
      error: undefined,
    }));
    const {
      result: { current: result },
    } = renderHook(() => useBeer());
    expect(SWR.default).toBeCalledTimes(1);
    expect(SWR.default).toBeCalledWith(null, expect.anything());
    expect(result.error).toBeUndefined();
    expect(result.beer).toBeUndefined();
  });

  test("should pass error on API failure", () => {
    jest.spyOn(SWR, "default").mockImplementation((url, config) => ({
      data: undefined,
      error: mockError,
    }));
    const {
      result: { current: result },
    } = renderHook(() => useBeer(11));
    expect(SWR.default).toBeCalledWith("/beers/11", expect.anything());
    expect(result.beer).toBeUndefined();
    expect(result.error).toBe(mockError);
  });
});

describe("useBeerList", () => {
  describe("unfiltered", () => {
    test("should provide beer list on API success", () => {
      jest.spyOn(SWR, "useSWRInfinite").mockImplementation((url, config) => ({
        data: [TEST_DATA.mixed_list],
        error: undefined,
      }));
      const {
        result: { current: result },
      } = renderHook(() => useBeerList());
      expect(SWR.useSWRInfinite.mock.calls[0][0](0)).toBe("/beers?page=1");
      expect(SWR.useSWRInfinite.mock.calls[0][0](1)).toBe("/beers?page=2");
      expect(result.error).toBeUndefined();
      expect(result.beers).toEqual(TEST_DATA.mixed_list);
    });

    test("should pass error on API failure", () => {
      jest.spyOn(SWR, "useSWRInfinite").mockImplementation((url, config) => ({
        data: undefined,
        error: mockError,
      }));
      const {
        result: { current: result },
      } = renderHook(() => useBeerList());
      expect(SWR.useSWRInfinite.mock.calls[0][0](0)).toBe("/beers?page=1");
      expect(SWR.useSWRInfinite.mock.calls[0][0](1)).toBe("/beers?page=2");
      expect(result.beer).toBeUndefined();
      expect(result.error).toBe(mockError);
    });

    test("should respect alcoholic filter", () => {
      jest.spyOn(SWR, "useSWRInfinite").mockImplementation((url, config) => ({
        data: [TEST_DATA.mixed_list,[]],
        error: undefined,
        size:1,setSize:()=>{}
      }));
      const {
        result: { current: result },
        rerender,
      } = renderHook(() => useBeerList(), {
        wrapper,
        initialProps: {
          showAlcholic: false,
        },
      });
      expect(SWR.useSWRInfinite.mock.calls[0][0](0)).toBe("/beers?page=1");
      expect(SWR.useSWRInfinite.mock.calls[0][0](1)).toBe("/beers?page=2");
      expect(result.error).toBeUndefined();
      expect(result.beers).toStrictEqual([]);
    });
  });

  describe("filtered", () => {
    test("should provide beer list on API success", () => {
      jest.spyOn(SWR, "useSWRInfinite").mockImplementation((url, config) => ({
        data: [TEST_DATA.mixed_list],
        error: undefined,
      }));
      const {
        result: { current: result },
      } = renderHook(() => useBeerList([{ beer_name: "blonde" }]));
      expect(SWR.useSWRInfinite.mock.calls[0][0](0)).toBe(
        "/beers?beer_name=blonde&page=1"
      );
      expect(SWR.useSWRInfinite.mock.calls[0][0](1)).toBe(
        "/beers?beer_name=blonde&page=2"
      );
      expect(result.error).toBeUndefined();
      expect(result.beers).toEqual(TEST_DATA.mixed_list);
    });

    test("should pass error on API failure", () => {
      jest.spyOn(SWR, "useSWRInfinite").mockImplementation((url, config) => ({
        data: undefined,
        error: mockError,
      }));
      const {
        result: { current: result },
      } = renderHook(() => useBeerList([{ beer_name: "blonde" }]));
      expect(SWR.useSWRInfinite.mock.calls[0][0](0)).toBe(
        "/beers?beer_name=blonde&page=1"
      );
      expect(SWR.useSWRInfinite.mock.calls[0][0](1)).toBe(
        "/beers?beer_name=blonde&page=2"
      );
      expect(result.beer).toBeUndefined();
      expect(result.error).toBe(mockError);
    });
  });
});
