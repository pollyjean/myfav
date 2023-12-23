import styled from "styled-components";

const Loading = () => {
  return (
    <Wrapper>
      <Text>Loading...</Text>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Text = styled.div`
  font-size: 1.5rem;
`;
export default Loading;
