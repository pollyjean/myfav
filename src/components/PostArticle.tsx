import { addDoc, collection, updateDoc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import {
  StorageError,
  StorageErrorCode,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

const PostArticle = () => {
  const LIMIT_IMAGE_SIZE = 10 * 1024 * 1024;
  const [isLoading, setIsLoading] = useState(false);
  const [fav, setFav] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const favRef = useRef<HTMLTextAreaElement>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFav(e.target.value);
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
    const user = auth.currentUser;
    if (!user || isLoading || fav === "" || fav.length > 280) {
      favRef.current?.focus();
      return;
    }
    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, "favs"), {
        fav,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `favs/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
      setFav("");
      setFile(null);
    } catch (error) {
      console.error(error);
      favRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        placeholder="My Favorite things are..."
        maxLength={280}
        rows={5}
        value={fav}
        onChange={onChange}
        required
        ref={favRef}
      />
      <AttachFileLabel htmlFor="file">
        {file ? "Photo Added(v)" : "Add Photo"}
      </AttachFileLabel>
      <AttachFileInput
        type="file"
        id="file"
        accept="image/*"
        onChange={onFileChange}
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      <SubmitButton type="submit">
        {isLoading ? "Posting..." : "Post Things"}
      </SubmitButton>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 1.25rem;
  border-radius: 1.2rem;
  background-color: transparent;
  color: white;
  width: 100%;
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
  padding: 0.625rem 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 1.25rem;
  border: 1px solid #1d9bf0;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  border: 0;
  padding: 0.625rem 0px;
  border-radius: 1.25rem;
  font-size: 1rem;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

const ErrorMessage = styled.div`
  color: tomato;
  font-size: 0.875rem;
`;

export default PostArticle;
