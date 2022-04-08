import React, { memo, useEffect } from "react";
import Link from "next/link";
import uuid from "react-uuid";
import { useRouter } from "next/router";
import styled from "styled-components";


import {
  useGames,
  useRounds,
  useCurrentGame,
  useCurrentRound,
} from "src/hooks/states";
import { Loading } from 'src/components';
import { isRenderable } from "src/utils";
// 임시
import axios from "axios";

const ForIframeView = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SelectRoundWrap = styled.div`
  width: 100%;
  height: 40px;
  margin: 24px 0 24px 0;
`;

const RoundSelectCTA = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0px 4px 10px rgba(88, 79, 195, 0.25);
  border-radius: 5px;
  border: 1px solid #b477e1;
  
  color: #b477e1;
  

  &:hover {
    background: #9656c6;
    transition: 0.2s;
    color: #fff;
    font-weight: 600;
  }
`;

const SelectRounds = () => {
  const gameId = useRouter().query.gameId;
  const [rounds, setRounds] = useRounds();
  const [, setCurrentRound] = useCurrentRound();
  // 임시
  const [currentGame, setCurrentGame] = useCurrentGame();
  const [games, setGames] = useGames();

  useEffect(() => {
    if (gameId) {
      const setGame = async () => {
        let newRounds;

        if (!currentGame || currentGame._id !== gameId) {
          const { data } = await axios.get(`/games/0`);

          if (!games) {
            setGames(data.data);
          }

          const newCurrentGame = data.data.filter(
            ({ _id }) => _id === gameId
          )[0];

          if (!newCurrentGame) {
            // gameId 가 잘못됨
            console.log("wrong GameId");
          } else {
            setCurrentGame(newCurrentGame);
            newRounds = newCurrentGame.imagesCount;
          }
        } else {
          newRounds = currentGame.imagesCount;
        }

        setRounds(newRounds);
      };

      setGame();
    }
  }, [gameId]);

  if (isRenderable(rounds, gameId, currentGame, games)) {
    let selectableRounds = [];

    for (let i = 4; i <= rounds; i *= 2) {
      selectableRounds.unshift(
        <SelectRoundWrap key={uuid()}>
          <Link href={`/images/${gameId}/${i}`}>
            <RoundSelectCTA
              onClick={() => setCurrentRound(i)}
              style={{ textDecoration: "none" }}
            >
              {i}
            </RoundSelectCTA>
          </Link>
        </SelectRoundWrap>
      );
    }

    return (
      <>
        <ForIframeView>
          <h3>Numbers of Members?</h3>
          {selectableRounds}
        </ForIframeView>
      </>
    );
  } else {
    return <Loading />;
  }
};

export default memo(SelectRounds);
