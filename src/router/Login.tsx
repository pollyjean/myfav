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
        console.log(error.code, error.message);
      }
    } finally {
      setIsLoading(false);
    }
    console.log(email, password);
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
