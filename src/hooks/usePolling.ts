import {useEffect, useRef, useState} from "react";
import {AxiosResponse} from "axios";

export function usePolling<T>(interval: number, cb: Function, abortCb: () => AbortController) {
  const isInitial = useRef(true)
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response: T = await cb()
      setData(response);

      setIsLoading(false);
      isInitial.current = false;
    };

    fetchData().then();

    const intervalId = setInterval(fetchData, interval);

    return () => {
      console.log(isInitial.current);
      clearInterval(intervalId);
      abortCb().abort();
      console.log('asdsadsadsaasd');
    };
  }, []);

  return {data, isLoading};
}
