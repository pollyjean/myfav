import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Fav from "./Fav";
import { Unsubscribe } from "firebase/database";

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

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchFavs = async () => {
      const favsQuery = query(
        collection(db, "favs"),
        orderBy("createdAt", "desc"),
        limit(20)
      );
      unsubscribe = await onSnapshot(favsQuery, (snapshot) => {
        const stream = snapshot.docs.map((doc) => {
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
        setFavs(stream);
      });
    };
    fetchFavs();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {favs.map((fav) => (
        <Fav key={fav.id} {...fav} />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export default Timeline;
