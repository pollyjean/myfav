import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { FavInterface } from "../components/Timeline";
import Fav from "../components/Fav";

const Profile = () => {
  const user = auth.currentUser;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditName, setIsEditName] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [favs, setFavs] = useState<FavInterface[]>([]);
  const [newName, setNewName] = useState(user?.displayName);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setError(null);
    if (!user) return;
    try {
      if (files && files.length === 1 && files[0].size > 10 * 1024 * 1024) {
        throw new Error("10MB 이하의 파일만 업로드 가능합니다.");
      } else if (files && files.length === 1) {
        setIsLoading(true);
        const file = files[0];
        const storageRef = ref(storage, `avatars/${user?.uid}`);
        const result = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(result.ref);
        setAvatar(url);
        await updateProfile(user, {
          photoURL: url,
        });
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchFavs = async () => {
    const favQuery = query(
      collection(db, "favs"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const snapshot = await getDocs(favQuery);
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
    setFavs(stream);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewName(value);
  };
  const onEditMode = () => {
    setIsEditName(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };
  const onCancelName = () => {
    setIsEditName(false);
  };
  const onSaveName = async () => {};
  useEffect(() => {
    fetchFavs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <>
            {isLoading ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 3.5c-.771 0-1.537.022-2.297.066a1.124 1.124 0 0 0-1.058 1.028l-.018.214a.75.75 0 1 1-1.495-.12l.018-.221a2.624 2.624 0 0 1 2.467-2.399 41.628 41.628 0 0 1 4.766 0 2.624 2.624 0 0 1 2.467 2.399c.056.662.097 1.329.122 2l.748-.748a.75.75 0 1 1 1.06 1.06l-2 2.001a.75.75 0 0 1-1.061 0l-2-1.999a.75.75 0 0 1 1.061-1.06l.689.688a39.89 39.89 0 0 0-.114-1.815 1.124 1.124 0 0 0-1.058-1.028A40.138 40.138 0 0 0 8 3.5ZM3.22 7.22a.75.75 0 0 1 1.061 0l2 2a.75.75 0 1 1-1.06 1.06l-.69-.69c.025.61.062 1.214.114 1.816.048.56.496.996 1.058 1.028a40.112 40.112 0 0 0 4.594 0 1.124 1.124 0 0 0 1.058-1.028 39.2 39.2 0 0 0 .018-.219.75.75 0 1 1 1.495.12l-.018.226a2.624 2.624 0 0 1-2.467 2.399 41.648 41.648 0 0 1-4.766 0 2.624 2.624 0 0 1-2.467-2.399 41.395 41.395 0 0 1-.122-2l-.748.748A.75.75 0 1 1 1.22 9.22l2-2Z"
                  clip-rule="evenodd"
                />
              </svg>
            ) : (
              <AvatarImage src={avatar} />
            )}
          </>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"></path>
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      {isEditName ? (
        <Name>
          <EditText
            value={newName as string}
            onChange={onChange}
            ref={inputRef}
          />
          <Button value="Save" type="button" onClick={onSaveName} />
          <Button value="Cancel" type="button" onClick={onCancelName} />
        </Name>
      ) : (
        <Name>
          {user?.displayName ?? "Anonymous"}
          <Button value="Edit" type="button" onClick={onEditMode} />
        </Name>
      )}
      <Favs>
        {favs.map((fav) => (
          <Fav key={fav.id} {...fav} />
        ))}
      </Favs>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`;

const AvatarUpload = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 5rem;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid #1d9bf0;
  cursor: pointer;
  svg {
    width: 3.125rem;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.25rem;
`;

const ErrorMessage = styled.p`
  color: tomato;
  font-size: 0.875rem;
`;

const Favs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  overflow-y: auto;
  padding-right: 0.625rem;
`;

const EditText = styled.input`
  border: 2px solid white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: transparent;
  color: white;
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

const Button = styled.input`
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

export default Profile;
