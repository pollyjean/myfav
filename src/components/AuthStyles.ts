import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 26.25rem;
  padding: 3.125rem 0;
`;

export const Title = styled.h1`
  font-size: 2.625rem;
`;

export const Form = styled.form`
  margin-top: 3.125rem;
  margin-bottom: 0.625rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
`;

export const Input = styled.input`
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

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 1.25rem;
  a {
    color: #2ecc71;
  }
`;
