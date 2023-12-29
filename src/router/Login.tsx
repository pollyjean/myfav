import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/AuthStyles";
import GithubButton from "../components/GithubButton";

const errorCodes = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account found with this email address.",
  "auth/wrong-password": "Please enter a valid password.",
  "auth/email-already-in-use": "This email address is already in use.",
  "auth/operation-not-allowed": "This email address is not allowed.",
  "auth/weak-password": "Please enter a stronger password.",
  "auth/too-many-requests": "Too many requests. Try again later.",
  "auth/network-request-failed": "Network error. Try again later.",
  "auth/provider-already-linked": "This account is already linked.",
  "auth/credential-already-in-use": "This credential is already in use.",
  "auth/invalid-credential": "This credential is invalid.",
  "auth/invalid-verification-code": "This code is invalid.",
  "auth/invalid-verification-id": "This ID is invalid.",
  "auth/expired-action-code": "This code has expired.",
  "auth/invalid-action-code": "This code is invalid.",
  "auth/invalid-email-verified":
    "This email address has already been verified.",
};

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (isLoading || email === "" || password === "") return;
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error);
        console.log(error);
        console.log(error.code);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>Log into Fav </Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="email"
          placeholder="Email"
          onChange={onChange}
          value={email}
          type="email"
          required
        />
        <Input
          name="password"
          placeholder="Password"
          onChange={onChange}
          value={password}
          type="password"
          required
        />
        <Input type="submit" value={isLoading ? "Loading..." : "Log In"} />
      </Form>
      {error && <Error>{error.message}</Error>}
      <Switcher>
        Don't have an account? <Link to="/join">Join Fav &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
};

export default Login;
