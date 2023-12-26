import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Header = () => {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header>
      <h1>My App</h1>
      <button onClick={logout}>Log out</button>
    </header>
  );
};

export default Header;
