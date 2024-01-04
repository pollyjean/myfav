import styled from "styled-components";
import PostArticle from "../components/PostArticle";
import Timeline from "../components/Timeline";

const Home = () => {
  return (
    <Wrapper>
      <PostArticle />
      <Timeline />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  gap: 1.25rem;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
`;

export default Home;
