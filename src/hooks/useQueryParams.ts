import { useState, useEffect } from 'react';

interface IQueryParams {
  [key: string]: string | number;
}

export const useQueryParams = <T extends IQueryParams>(): T => {
  const [queryParams, setQueryParams] = useState<T>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const paramsObj: any = {};

    for (const param of params) {
      const [key, value] = param;

      paramsObj[key] = value;
    }

    setQueryParams(paramsObj);
  }, []);

  return queryParams as T;
};
