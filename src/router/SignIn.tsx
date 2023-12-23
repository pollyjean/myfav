import { useState } from "react";
import styled from "styled-components";

const SignIn = () => {
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
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // try {
    // } catch (error) {
    // } finally {
    //   setIsLoading(false);
    // }
    console.log(name, email, password);
  };
  return (
    <Wrapper>
      <Title>Sign In </Title>
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
        <Input type="submit" value={isLoading ? "Loading..." : "Sign In"} />
      </Form>
      {error && <Error>{error.message}</Error>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 26.25rem;
  padding: 3.125rem 0;
`;

const Title = styled.h1`
  font-size: 2.625rem;
`;

const Form = styled.form`
  margin-top: 3.125rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
`;

const Input = styled.input`
  padding: 0.625rem 1.25rem;
  border-radius: 3.125rem;
  border: none;
  width: 100%;
  font-size: 1rem;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export default SignIn;
