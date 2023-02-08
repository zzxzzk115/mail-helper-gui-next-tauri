import { useEffect, useState } from "react";

const useLocalStorage = (key, fallbackValue) => {

  const [value, setValue] = useState(fallbackValue);

  const isClient = typeof window !== 'undefined';

  function getFromStorage(key) {
    if (isClient) {
      return JSON.parse(window.localStorage.getItem(key));
    }
  }

  function setToStorage(key, value) {
    if (isClient) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }

  function setValueExtend(newValue) {
    setToStorage(key, newValue);
    setValue(newValue);
  }

  useEffect(()=>{
    let stored = getFromStorage("is-first-load");
    if (stored !== null) {
      setValue(stored);
    }
  }, []);

  return [value, setValueExtend];
};

export default useLocalStorage;