import styled from "styled-components";
import { FavInterface } from "./Timeline";

const Fav = ({ username, photo, fav }: FavInterface) => {
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{fav}</Payload>
      </Column>
      <Column>
        <Photo src={photo} />
      </Column>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 0.9375rem;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: auto;
  height: 6.25rem;
  border-radius: 0.9375rem;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 0.9375rem;
`;

const Payload = styled.p`
  margin: 0.625rem 0;
  font-size: 1.125rem;
`;

export default Fav;
