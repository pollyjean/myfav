import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Fav from "./Fav";

export interface FavInterface {
  id: string;
  photo?: string;
  fav: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Timeline = () => {
  const [favs, setFavs] = useState<FavInterface[]>([]);
  const fetchFavs = async () => {
    const favsQuery = query(
      collection(db, "favs"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(favsQuery);
    const data = snapshot.docs.map((doc) => {
      const { fav, userId, username, createdAt, photo } = doc.data();
      return {
        id: doc.id,
        fav,
        userId,
        username,
        createdAt,
        photo,
      };
    });
    setFavs(data);
  };
  useEffect(() => {
    fetchFavs();
  }, []);
  return (
    <Wrapper>
      {favs.map((fav) => (
        <Fav key={fav.id} {...fav} />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

export default Timeline;
