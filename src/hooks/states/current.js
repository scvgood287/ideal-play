import { atom, useAtom } from "jotai";

const roundsAtom = atom();
const currentGameAtom = atom();
const currentRoundAtom = atom();
const currentFirstAtom = atom();

export const useRounds = () => useAtom(roundsAtom);
export const useCurrentGame = () => useAtom(currentGameAtom);
export const useCurrentRound = () => useAtom(currentRoundAtom);
export const useCurrentFirst = () => useAtom(currentFirstAtom);
