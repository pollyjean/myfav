import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "./firebase";

const Layout = () => {
  const navigate = useNavigate();
  const onLogOut = async () => {
    const ok = confirm("Are you sure you want to log out?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  };
  return (
    <Wrapper>
      <Menu>
        <MenuItem>
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to="/profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" />
            </svg>
          </Link>
        </MenuItem>
        <MenuItem className="log-out" onClick={onLogOut}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 24 24"
          >
            <path d="M11.5,16A1.5,1.5,0,0,0,10,17.5v.8A2.7,2.7,0,0,1,7.3,21H5.7A2.7,2.7,0,0,1,3,18.3V5.7A2.7,2.7,0,0,1,5.7,3H7.3A2.7,2.7,0,0,1,10,5.7v.8a1.5,1.5,0,0,0,3,0V5.7A5.706,5.706,0,0,0,7.3,0H5.7A5.706,5.706,0,0,0,0,5.7V18.3A5.706,5.706,0,0,0,5.7,24H7.3A5.706,5.706,0,0,0,13,18.3v-.8A1.5,1.5,0,0,0,11.5,16Z" />
            <path d="M22.561,9.525,17.975,4.939a1.5,1.5,0,0,0-2.121,2.122l3.411,3.411L7,10.5a1.5,1.5,0,0,0,0,3H7l12.318-.028-3.467,3.467a1.5,1.5,0,0,0,2.121,2.122l4.586-4.586A3.505,3.505,0,0,0,22.561,9.525Z" />
          </svg>
        </MenuItem>
      </Menu>
      <Outlet />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  height: 100%;
  gap: 1.25rem;
  padding: 3.125rem 0;
  width: 100%;
  max-width: 53.75rem;
`;

const Menu = styled.menu`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`;

const MenuItem = styled.li`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  height: 3.125rem;
  width: 3.125rem;
  border-radius: 50%;
  svg {
    width: 1.875rem;
    fill: white;
  }
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    color: white;
    font-weight: 500;
    font-size: 1.125rem;
    text-decoration: none;
  }
  &.log-out {
    border-color: tomato;
    svg {
      fill: tomato;
    }
  }
`;

export default Layout;
