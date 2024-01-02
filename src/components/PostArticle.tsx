import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";

const PostArticle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fav, setFav] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFav(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || fav === "" || fav.length > 280) return;
    try {
      setIsLoading(true);
      await addDoc(collection(db, "favs"), {
        fav,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
    } catch (error) {
      console.error(error);
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
      />
      <AttachFileLabel htmlFor="file">
        {file ? "Photo Added" : "Add Photo"}
      </AttachFileLabel>
      <AttachFileInput
        type="file"
        id="file"
        accept="image/*"
        onChange={onFileChange}
      />
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

export default PostArticle;
