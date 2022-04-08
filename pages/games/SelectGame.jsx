import React, { memo } from "react";
import Link from "next/link";
import uuid from "react-uuid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import styled from "styled-components";

import { useGames, useCurrentGame } from "src/hooks/states";

const Grid = styled.div`
  display: grid;
  grid-auto-rows: minmax(100px, auto);
  grid-template-columns: repeat(2, 150px);
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
  background: #fff;
`;

const GameTileForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 120px;
  height: 200px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 8px;

  align-items: center;
  padding: 8px;
`;

const DefaultCTAForm = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 28px;
  border-radius: 30px;
  margin-bottom: 8px;
`;

const StartCTA = styled(DefaultCTAForm)`
  background: #b477e1;
  color: #fff;

  &:hover {
    background: #9656c6;
    transition: 0.3;
  }
`;
const ShareCTA = styled(DefaultCTAForm)`
  border: 1px solid #2e2e2e;

  &:hover {
    background: #2e2e2e;
    color: #fff;
    transition: 0.3s;
  }
`;
const CircleCTAForm = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 30px;
  background: #2e2e2e;
`;

const ThumbnailArea = styled.div`
  width: 100%;
  height: 125px;
  background: #dedede;
  display: flex;
  align-items: flex-end;
  margin-bottom: 16px;
  & > div {
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;

    width: 100%;
  }
`;

const SelectGame = () => {
  const [games] = useGames();
  const [, setCurrentGame] = useCurrentGame();

  let selectGames = [];
  if (games) {
    selectGames = games.map((game) => {
      const { name, _id } = game;
      const href = `/rounds/${_id}`;

      return (
        <GameTileForm key={uuid()}>
          <ThumbnailArea>
            <div>{name}</div>
          </ThumbnailArea>

          <Link href={href}>
            <StartCTA onClick={() => setCurrentGame(game)}>START</StartCTA>
          </Link>
          {/* CopyToClipboard 로 감싼 버튼 누르면 text 가 복사됨 */}
          <CopyToClipboard text={`${window.origin}${href}`}>
            <ShareCTA>Share</ShareCTA>
          </CopyToClipboard>
        </GameTileForm>
      );
    });
  }

  return <Grid>{selectGames}</Grid>;
};

export default memo(SelectGame);
