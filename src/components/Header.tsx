import { auth } from "../firebase";

const Header = () => {
  const logout = () => {
    auth.signOut();
  };
  return (
    <header>
      <h1>My App</h1>
      <button onClick={logout}>Log out</button>
    </header>
  );
};

export default Header;
