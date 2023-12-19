import { RouterProvider } from "react-router-dom";
import GlobalStyles from "./components/GlobalStyles";
import router from "./router";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    setIsLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <GlobalStyles />
      {isLoading ? <Loading /> : <RouterProvider router={router} />}
    </>
  );
};

export default App;
