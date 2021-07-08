import swr, { useSWRInfinite } from "swr";
import axios from "axios";
import { useContext } from "react";
import { ShowAlcoholicContext } from "./App";
const queryString = require("query-string");

axios.defaults.baseURL = "https://api.punkapi.com/v2";

let cancelSource = axios.CancelToken.source();

const requestInterceptor = (config) => {
  config.cancelToken = cancelSource.token;
  return config;
};

axios.interceptors.request.use(requestInterceptor);

const fetcher = (url) =>
  axios.get(url).then(({ data }) => {
    data = data.filter(
      ({ description, image_url }) => description && image_url
    );
    if (data.length) return data;
    return fetcher(url);
  });
const minorFetcher = (url) =>
  axios.get(url).then(({ data }) => {
    data = data.filter(
      ({ abv, description, image_url }) =>
        abv <= 0.5 && description && image_url
    );
    if (data.length) return data;
    console.log("retrying");
    return minorFetcher(url);
  });

function useSWR(url, isIdempotent) {
  const showAlcoholic = useContext(ShowAlcoholicContext);
  let config = {
    suspense: true,
    loadingTimeout: 1500,
    fetcher: !showAlcoholic && url === "/beers/random" ? minorFetcher : fetcher,
  };
  if (!isIdempotent)
    config = {
      ...config,
      dedupingInterval: 100,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    };
  return swr(url, config);
}

function firstIndex(arr) {
  if (arr && Array.isArray(arr) && arr.length) return arr[0];
  else return undefined;
}

function useBeer(id) {
  const { data, error, isValidating, mutate } = useSWR(
    id ? `/beers/${id}` : null
  );

  return {
    beer: data[0],
    isLoading: !error && !data,
    isError: error,
  };
}

function useRandomBeer() {
  const { data, error, isValidating, mutate } = useSWR("/beers/random");

  return {
    beer: firstIndex(data),
    isLoading: !error && !data,
    isError: error,
    isValidating,
    mutate,
  };
}

function useBeerList(filter = []) {
  const showAlcoholic = useContext(ShowAlcoholicContext);
  console.log({ filter });

  const filterObj = {};
  if (filter.length) Object.assign(filterObj, ...filter);

  let { data, error, size, setSize, isValidating } = useSWRInfinite(
    (index) =>
      `/beers?${queryString.stringify({ ...filterObj, page: index + 1 })}`,
    {
      fetcher: (url) =>
        axios.get(url).then(({ data }) => {
          data = data.filter(
            ({ description, image_url }) => description && image_url
          );
          return data;
        }),
      suspense: true,
      loadingTimeout: 1500,
      dedupingInterval: 100,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const isLoadingInitialData = !data && !error,
    isLoadingMore =
      isLoadingInitialData ||
      (size > 0 && data && typeof data[size - 1] === "undefined"),
    hasNextPage = data[data.length - 1].length;

  data = data.filter((v) => v.length).flat();

  if (!showAlcoholic) {
    data = data.filter(({ abv }) => abv <= 0.5);
    if (data.length < 10 && hasNextPage && !isLoadingMore) setSize(size + 1);
  }

  return {
    beers: data,
    isLoadingMore,
    isLoadingInitialData,
    isError: error,
    size,
    setSize,
    isValidating,
    hasNextPage,
  };
}

export { useBeer, useRandomBeer, useBeerList };
