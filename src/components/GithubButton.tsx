import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const GithubButton = () => {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return <Button onClick={onClick}>Continue with Github</Button>;
};

const Button = styled.button`
  background-color: #f2f2f2;
  font-weight: 500;
  padding: 0.625rem 1.25rem;
  border-radius: 3.125rem;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3125rem;
  margin-top: 3.125rem;
  width: 100%;
  cursor: pointer;
`;

export default GithubButton;
