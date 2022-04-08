import { atom, useAtom } from "jotai";
import axios from "axios";

axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api/ideals`;

const gamesAtom = atom(null, (_get, set, payload) => {
  const getGames = async () => {
    const { data } = await axios.get("/games/1");
    set(gamesAtom, data.data);
  };

  if (!payload) {
    getGames();
  } else {
    set(gamesAtom, payload);
  }
});
gamesAtom.onMount = (getGames) => {
  getGames();
};

export const useGames = () => useAtom(gamesAtom);
