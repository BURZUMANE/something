import {useEffect, useState} from "react";

export function usePolling<T>(interval: number, cb: Function, abortCb: () => AbortController) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response: T = await cb()
      setData(response);

      setIsLoading(false);
    };

    fetchData().then();

    const intervalId = setInterval(fetchData, interval);

    return () => {
      clearInterval(intervalId);
      abortCb().abort();
    };
  }, [abortCb, cb, interval]);

  return {data, isLoading};
}
