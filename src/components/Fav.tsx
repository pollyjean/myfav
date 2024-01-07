import styled from "styled-components";
import { FavInterface } from "./Timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Fav = ({ username, photo, fav, userId, id }: FavInterface) => {
  const loggedUser = auth.currentUser;
  const onDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this fav?");
    if (loggedUser?.uid !== userId || !ok) {
      return;
    }
    try {
      await deleteDoc(doc(db, "favs", id));
      if (photo) {
        const storageRef = ref(storage, `favs/${userId}/${id}`);
        await deleteObject(storageRef);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{fav}</Payload>
        {loggedUser?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
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

const DeleteButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  border: 0;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.3125rem 0.625rem;
  text-transform: uppercase;
  border-radius: 0.3125rem;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

export default Fav;
