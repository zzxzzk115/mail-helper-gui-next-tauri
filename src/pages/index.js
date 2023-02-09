import LocalStorageExtend from "../utils/LocalStorageExtend";
import { useEffect } from "react";
import { useRouter } from "next/router";

const App = () => {

  const router = useRouter();
  const firstLoadKey = "is-first-load";

  useEffect(() => {
    let isFirstLoad = LocalStorageExtend.getFromStorage(firstLoadKey, true);
    if (isFirstLoad) {
      router.replace('/hello');
    } else {
      router.replace('/home');
    }
  }, []);

  return;
}

export default App;
