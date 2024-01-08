import styled from "styled-components";
import { FavInterface } from "./Timeline";
import { auth, db, storage } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  StorageError,
  StorageErrorCode,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";

const Fav = ({ username, photo, fav, userId, id }: FavInterface) => {
  const LIMIT_IMAGE_SIZE = 10 * 1024 * 1024;
  const loggedUser = auth.currentUser;
  const [isLoading, setIsLoading] = useState(false);
  const [newFav, setNewFav] = useState<string | undefined>(fav);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<Error | null>(null);
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
  const onEditMode = () => {
    if (loggedUser?.uid !== userId) {
      return;
    }
    setIsEditing(true);
  };
  const onEditCancel = async () => {
    setIsEditing(false);
    setIsLoading(false);
    setNewFav("");
    setFile(null);
    setError(null);
  };
  const onEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = e;
    setNewFav(value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1 && files[0].size < LIMIT_IMAGE_SIZE) {
      setFile(files[0]);
    } else if (
      files &&
      files.length === 1 &&
      files[0].size > LIMIT_IMAGE_SIZE
    ) {
      setError(
        new StorageError(
          StorageErrorCode.SERVER_FILE_WRONG_SIZE,
          "100MB 이하의 파일만 업로드 가능합니다."
        )
      );
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loggedUser || isLoading || fav === "" || fav.length > 280) {
      return;
    }
    try {
      setIsLoading(true);
      if (file) {
        const locationRef = ref(storage, `favs/${userId}/${id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, "favs", id), {
          photo: url,
        });
      }
      await updateDoc(doc(db, "favs", id), {
        fav: newFav,
        photo: file ? file : photo,
        updatedAt: Date.now(),
      });
      setNewFav("");
      setFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchFavs = async () => {
      const favQuery = query(collection(db, "favs", id));
      unsubscribe = await onSnapshot(favQuery, (snapshot) => {
        const stream = snapshot.docs.map((doc) => {
          const { fav, userId, username, createdAt, photo } = doc.data();
          return {
            id: doc.id,
            fav,
            userId,
            username,
            createdAt,
            photo,
          };
        });
        setNewFav(stream[0].fav);
        setFile(stream[0].photo ? stream[0].photo : null);
      });
    };
    fetchFavs();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [id]);
  return (
    <>
      <Wrapper>
        <Column>
          <Username>{username}</Username>
          {isEditing ? (
            <form onSubmit={onSubmit}>
              <Payload>
                <TextArea
                  id="TextEdit"
                  value={newFav}
                  onChange={onEditChange}
                />
              </Payload>
              {error && <ErrorMessage>{error.message}</ErrorMessage>}
              <AttachFileLabel htmlFor="fileEdit">
                {file ? "Photo Added(v)" : "Edit Photo(Optional)"}
              </AttachFileLabel>
              <AttachFileInput
                type="file"
                id="fileEdit"
                accept="image/*"
                onChange={onFileChange}
              />
              {loggedUser?.uid === userId && isEditing ? (
                <Button type="submit">
                  {isLoading ? "Loading..." : "Save"}
                </Button>
              ) : null}
              {loggedUser?.uid === userId && isEditing ? (
                <Button onClick={onEditCancel}>Cancel</Button>
              ) : null}
            </form>
          ) : (
            <Payload>{fav}</Payload>
          )}

          {loggedUser?.uid === userId && !isEditing ? (
            <Button onClick={onEditMode}>Edit</Button>
          ) : null}
          {loggedUser?.uid === userId && !isEditing ? (
            <Button onClick={onDelete}>Delete</Button>
          ) : null}
        </Column>
        <Column>{photo ? <Photo src={photo} /> : null}</Column>
      </Wrapper>
    </>
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

const Button = styled.button`
  background-color: #1d9bf0;
  color: white;
  border: 0;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.3125rem 0.625rem;
  margin: 0.3125rem 0.3125rem 0.3125rem 0;
  text-transform: uppercase;
  border-radius: 0.3125rem;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 0.625rem;
  border-radius: 0.625rem;
  background-color: transparent;
  color: white;
  width: 90%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 1rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileLabel = styled.label`
  background-color: #1d9bf0;
  color: white;
  border: 0;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.3125rem 0.625rem;
  margin: 0.3125rem 0.3125rem 0.3125rem 0;
  text-transform: uppercase;
  border-radius: 0.3125rem;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

const AttachFileInput = styled.input`
  display: none;
`;

const ErrorMessage = styled.div`
  color: tomato;
  font-size: 0.875rem;
`;

export default Fav;
