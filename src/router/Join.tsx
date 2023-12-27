import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/AuthStyles";
import GithubButton from "../components/GithubButton";

const Join = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user);
      await updateProfile(credentials.user, {
        displayName: name,
      });
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error);
        console.log(error.code, error.message);
      }
    } finally {
      setIsLoading(false);
    }
    console.log(name, email, password);
  };
  return (
    <Wrapper>
      <Title>Join Fav </Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="name"
          placeholder="Name"
          onChange={onChange}
          value={name}
          type="text"
          required
        />
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
        <Input type="submit" value={isLoading ? "Loading..." : "Join"} />
      </Form>
      {error && <Error>{error.message}</Error>}
      <Switcher>
        Already have an account? <Link to="/login">log into Fav &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
};

export default Join;
