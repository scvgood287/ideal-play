import React, { memo, useEffect, useState } from "react";
import uuid from "react-uuid";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import Versus from "src/resources/versus2.png";
import {
  RoundBanner,
  ImageViewArea,
  ImageSizeControl,
  IdealNameArea,
} from "src/styles";
import {
  useCurrentGame,
  useCurrentRound,
  useCurrentFirst,
} from "src/hooks/states";
import { isRenderable, createSchedule } from "src/utils";
import { Loading } from 'src/components';
import { finalRoundLoader, roundLoader } from 'src/resources';
import styled, { keyframes } from "styled-components";

const slideAnimation = keyframes`
  0% {
    opacity: 0;
    left: -320px;
  }
  50% {
    opacity: 1;
    left: 0;
  }
  100% {
    opacity: 0;
    left: 0;
    left: 320px;
  }
`;

const boxGradient = keyframes`
  0% {
    background: rgba(0, 0, 0, 0);
  }
  50% {
    background: rgba(67, 35, 91, 0.8);
  }
  100% {
    background: rgba(0, 0, 0, 0);
  }
`;

const BoxGradientWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 320px;
  height: 500px;
  z-index: 99999;
  animation: ${boxGradient} 2s;
`;

const SlideAnimationWrapper = styled.div`
  position: fixed;
  width: 320px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  animation: ${slideAnimation} 2s;
`;

const PlayGame = () => {
  const [currentGame] = useCurrentGame();
  const [currentRound] = useCurrentRound();
  const [, setCurrentFirst] = useCurrentFirst();

  const [images, setImages] = useState();
  const [schedule, setSchedule] = useState();
  const [currentSchedule, setCurrentSchedule] = useState(0);
  const [winners, setWinners] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState();
  const [loaderImage, setLoaderImage] = useState();

  const pickOne = (winnerId, loserIndex) => {
    let winner;
    let loser;
    const loserId = schedule[currentSchedule][loserIndex]._id;

    const newImages = images.filter((image) => {
      const { _id } = image;
      let isntCurrentSchedule = true;

      switch (_id) {
        case winnerId:
          winner = image;
          isntCurrentSchedule = false;
          break;
        case loserId:
          loser = image;
          isntCurrentSchedule = false;
          break;
      }

      return isntCurrentSchedule;
    });

    winner.logs.win++;
    loser.logs.lose++;

    if (schedule.length === 1) {
      winner.logs.first = 1;
      const logs = [...newImages, winner, loser].map(({ logs }) => logs);

      axios.post(`/logs/${currentGame._id}`, logs);
    } else {
      const newWinners = [...winners, winner];

      if (currentSchedule === schedule.length - 1) {
        setCurrentSchedule(0);
        setSchedule(createSchedule(newWinners));
        setWinners([]);
        setLoaderImage(schedule.length === 2 ? finalRoundLoader : roundLoader);
        setTimeout(() => setLoaderImage(), 2000);
      } else {
        setWinners(newWinners);
        setCurrentSchedule(currentSchedule + 1);
      }

      setImages([...newImages, winner, loser]);
    }
  };

  useEffect(() => {
    const getImages = async () => {
      const { data } = await axios.get(
        `images/${currentGame._id}/${currentRound}`
      );

      const entries = data.data.map((image) => {
        const { gameId, _id: imageId } = image;

        return {
          ...image,
          logs: {
            gameId,
            imageId,
            first: 0,
            entry: 1,
            win: 0,
            lose: 0,
          },
        };
      });

      setImages(entries);
      setSchedule(createSchedule(entries));
    };

    getImages();
  }, []);
  
  useEffect(() => {
    if (selectedInfo) {
      const [winnerId, loserIndex] = selectedInfo;
      pickOne(winnerId, loserIndex);

      setSelectedInfo();
    };
  }, [selectedInfo]);

  if (isRenderable(images, schedule)) {
    const { optional: optionalTagName } = currentGame.tagNames;

    const versus = schedule[currentSchedule].map((image, i) => {
      const {
        imageUrl: { host, pathname },
        tags: { main, sub, optional },
        name,
        _id,
      } = image;

      const src = `${host}/${pathname}`;
      const currentImageId = `${schedule.length * 2}-${currentSchedule + 1}-`;

      const imageArea = (
        <ImageSizeControl
          src={src}
          alt={name}
        />
      );

      const blurArea = (
        <div id={`${currentImageId}${i}`}
          style={{
            position: 'absolute',
            top: 56 + 200 * i,
            left: 0,
            width: "320px",
            height: "200px",
            background: "rgba(255, 255, 255, 0)",
          }}

          onClick={() => {
            const loser = document.getElementById(`${currentImageId}${1 - i}`);

            loser.style.background = "rgba(0, 0, 0, 0.6)";
            loser.style.backdropFilter = "blur(4px)";
            loser.style.transitionProperty = "background, backdrop-filter";
            loser.style.transitionDuration = "0.5s, 0.5s";

            if (schedule.length === 1) {
              const winner = images.filter(({ _id: winnerId }) => _id === winnerId)[0];
              setCurrentFirst(winner);
            };

            setTimeout(() => setSelectedInfo([_id, 1 - i]), 1000);
          }}
        />
      );

      return (
        <ImageViewArea key={uuid()}>
          <div
            style={{
              position: "absolute",
              color: "#fff",
              display: "flex",
              alignItems: "flex-end",
              zIndex: 999
            }}
          >
            <IdealNameArea>
              <h3 style={{ fontSize: "14px", margin: "0" }}>{main}</h3>
              {optionalTagName ? (
                <p>
                  {sub} - {optional}
                </p>
              ) : (
                <p>{sub}</p>
              )}
            </IdealNameArea>
          </div>
          {schedule.length !== 1 ? blurArea : (
            <Link href={`/rates/${currentGame._id}/20`}>
              {blurArea}
            </Link>
          )}
          {imageArea}
        </ImageViewArea>
      );
    });

    return (
      <>
      {loaderImage ?
        <>
          <BoxGradientWrapper />
          <SlideAnimationWrapper>
            <Image src={loaderImage} width={schedule.length === 1 ? 200 : 377} height={schedule.length === 1 ? 115 : 166}/>
          </SlideAnimationWrapper>
        </>
      : null}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <RoundBanner>
            {schedule.length === 1
              ? `Final Match`
              : `Round of ${schedule.length * 2} - ${currentSchedule + 1}R`}
          </RoundBanner>
          <div style={{
                position: "absolute",
                fontSize: 60,
                top: 180,
                left: 160,
                zIndex: 9999,
              }}
            >
              <Image
                src={Versus}
                alt="Picture of the author"
                width={150}
                height={150}
              />
            </div>
            <div>{versus}</div>
        </div>
      </>        
    );
  } else {
    return <Loading loading={true}/>;
  }
};

export default memo(PlayGame);
