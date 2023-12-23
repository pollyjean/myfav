import { RouterProvider } from "react-router-dom";
import GlobalStyles from "./components/GlobalStyles";
import router from "./router";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import { auth } from "./firebase";
import styled from "styled-components";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <Loading /> : <RouterProvider router={router} />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default App;
