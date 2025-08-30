import { createSearchParamsCache, createSerializer, parseAsInteger, parseAsString } from "nuqs/server";

export const dataSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  id: parseAsString,
  gender: parseAsString,
  type: parseAsString,
};

export const dataSearchParamsCache = createSearchParamsCache(dataSearchParams);
export const dataSerialize = createSerializer(dataSearchParams);
