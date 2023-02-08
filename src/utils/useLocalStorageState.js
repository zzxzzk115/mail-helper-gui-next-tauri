import { useEffect, useState } from "react";
import LocalStorageExtend from "./LocalStorageExtend";

const useLocalStorageState = (key, fallbackValue) => {

  const [value, setValue] = useState(fallbackValue);

  function setValueExtend(newValue) {
    setValue(newValue);
    LocalStorageExtend.setToStorage(key, newValue);
  }

  useEffect(()=>{
    let stored = LocalStorageExtend.getFromStorage(key);
    setValueExtend(stored === null ? fallbackValue : stored);
  }, []);

  return [value, setValueExtend];
};

export default useLocalStorageState;