import { renderHook } from "@testing-library/react-hooks";
import * as SWR from "swr";

import { useBeer, useBeerList, useRandomBeer } from "./api";
import { ShowAlcoholicContext } from "./App";
const mockBeer = [
    {
      id: 192,
      name: "Punk IPA 2007 - 2010",
      tagline: "Post Modern Classic. Spiky. Tropical. Hoppy.",
      first_brewed: "04/2007",
      description:
        "Our flagship beer that kick started the craft beer revolution. This is James and Martin's original take on an American IPA, subverted with punchy New Zealand hops. Layered with new world hops to create an all-out riot of grapefruit, pineapple and lychee before a spiky, mouth-puckering bitter finish.",
      image_url: "https://images.punkapi.com/v2/192.png",
      abv: 6.0,
      ibu: 60.0,
      target_fg: 1010.0,
      target_og: 1056.0,
      ebc: 17.0,
      srm: 8.5,
      ph: 4.4,
      attenuation_level: 82.14,
      volume: {
        value: 20,
        unit: "liters",
      },
      boil_volume: {
        value: 25,
        unit: "liters",
      },
      method: {
        mash_temp: [
          {
            temp: {
              value: 65,
              unit: "celsius",
            },
            duration: 75,
          },
        ],
        fermentation: {
          temp: {
            value: 19.0,
            unit: "celsius",
          },
        },
        twist: null,
      },
      ingredients: {
        malt: [
          {
            name: "Extra Pale",
            amount: {
              value: 5.3,
              unit: "kilograms",
            },
          },
        ],
        hops: [
          {
            name: "Ahtanum",
            amount: {
              value: 17.5,
              unit: "grams",
            },
            add: "start",
            attribute: "bitter",
          },
          {
            name: "Chinook",
            amount: {
              value: 15,
              unit: "grams",
            },
            add: "start",
            attribute: "bitter",
          },
        ],
        yeast: "Wyeast 1056 - American Ale™",
      },
      food_pairing: [
        "Spicy carne asada with a pico de gallo sauce",
        "Shredded chicken tacos with a mango chilli lime salsa",
        "Cheesecake with a passion fruit swirl sauce",
      ],
      brewers_tips:
        "While it may surprise you, this version of Punk IPA isn't dry hopped but still packs a punch! To make the best of the aroma hops make sure they are fully submerged and add them just before knock out for an intense hop hit.",
      contributed_by: "Sam Mason <samjbmason>",
    },
  ],
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
        data: [mockBeer],
        error: undefined,
      }));
      const {
        result: { current: result },
      } = renderHook(() => useBeerList());
      expect(SWR.useSWRInfinite.mock.calls[0][0](0)).toBe("/beers?page=1");
      expect(SWR.useSWRInfinite.mock.calls[0][0](1)).toBe("/beers?page=2");
      expect(result.error).toBeUndefined();
      expect(result.beers).toContain(mockBeer[0]);
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
        data: [mockBeer,[]],
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
        data: [mockBeer],
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
      expect(result.beers).toContain(mockBeer[0]);
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
