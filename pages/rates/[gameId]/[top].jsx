import React, { memo, useEffect, useState } from "react";
import uuid from "react-uuid";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import html2canvas from "html2canvas";
import { CopyToClipboard } from "react-copy-to-clipboard";
import styled from "styled-components";
import { RoundBanner, ImageViewArea, ImageSizeControl, IdealNameArea } from "src/styles";
import Retry from "src/resources/retry.png";
import Ranking from "src/resources/ranking.png";
import Share from "src/resources/share.png";
import Capture from "src/resources/capture.png";
import Gold from "src/resources/1st.png";
import Silver from "src/resources/2nd.png";
import Bronze from "src/resources/3rd.png";
import Kshopina from "src/resources/kshopina-logo.png";
import Prev from "src/resources/prev.png";
import Link from "next/link";

import { useCurrentGame, useCurrentFirst } from "src/hooks/states";
import { isRenderable } from "src/utils";
import Round from "pages/images/[gameId]/[round]";
import { Loading } from "src/components";

const ResultWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CircleCTAForm = styled.div`
  border-radius: 50px;
  width: 40px;
  height: 40px;
  background: #2c2828;
  margin: 0 16px 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #565656;
    transition: 0.3s;
  }
`;
const CTACombo = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
`;
const ModalForm = styled.div`
  display: flex;
  height: 100%;
  overflow: scroll;
  background: #fff;
  flex-direction: column;
  overflow-x: hidden;
  align-items: center;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const ModalContentsBar = styled.div`
  display: flex;
  position: fixed;
  width: 400px;
  height: 40px;
  background: #fff;
`;

const RankItemForm = styled.div`
  width: 300px;
  height: 58px;
  display: flex;
  margin: 32px 0 32px 0;
  align-items: center;
`;
const ItemInfoForm = styled.li`
  margin: 0;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  font-size: 12px;
  padding: 4px;
  background: #fff;
  border-radius: 30px;
  margin-right: 8px;

  box-shadow: 0px 4px 10px rgba(88, 79, 195, 0.15);
`;
const ItemsRankBox = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 30px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  margin-right: 16px;

  color: #000;
  box-shadow: 0px 4px 10px rgba(88, 79, 195, 0.25);
`;

const FixedBanner = styled(RoundBanner)`
  display: fixed;
  position: absolute;
`;
const RankerList = styled(ItemInfoForm)`
  width: 70px;
  height: 150px;
  display: flex;
  flex-direction: column;
  margin: 8px 0 8px 0;
  background: rgba(0, 0, 0, 0);
  box-shadow: none;
  align-items: center;
  justify-content: flex-end;
`;

const RankImg = styled.img``;

const DirectCTA = styled.div`
  width: 80%;
  height: 44px;
  background: #2c2828;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    background: #565656;
    transition: 0.2s;
  }
`;

const Results = () => {
  const { top } = useRouter().query;
  const [currentGame] = useCurrentGame();
  const [currentFirst] = useCurrentFirst();
  const [rates, setRates] = useState();
  const [showTotals, setShowTotals] = useState(false);

  useEffect(() => {
    if (top) {
      const getRates = async () => {
        const { data } = await axios.get(`/rates/${currentGame._id}/${top}`);
        setRates(data.data);
      };

      getRates();
    }
  }, [top]);

  if (isRenderable(rates)) {
    const {
      _id: gameId,
      tagNames: { main: mainTagName, sub: subTagName, optional: optionalTagName },
    } = currentGame;
    let {
      imageUrl: { host: winnerHost, pathname: winnerPathname },
      name: winnerName,
      tags: { main: winnerMain, sub: winnerSub, optional: winnerOptional },
      firstRate: winnerFirstRate,
      winRate: winnerWinRate,
    } = currentFirst;
    const href = `/rounds/${gameId}`;
    const winnerSrc = `${winnerHost}/${winnerPathname}`;

    // 캡쳐 버튼 누르면 캡쳐될 영역
    const winner = (
      <ResultWrap id="capture">
        <RoundBanner>WINNER 🎉</RoundBanner>

        <ImageViewArea
          style={{
            maxWidth: "350px",
            maxHeight: "272px",
            height: "100%",
            padding: "8px",
            margin: "16px 0 8px 0",
          }}
        >
          <ImageSizeControl src={winnerSrc} alt={winnerName} />
          <div
            style={{
              position: "absolute",
              color: "#fff",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <IdealNameArea style={{ textAlign: "center" }}>
              <h3 style={{ margin: "0", fontSize: "16px" }}>{winnerMain}</h3>
              {optionalTagName ? (
                <p>
                  {winnerSub} - {winnerOptional}
                </p>
              ) : (
                <p>{winnerSub}</p>
              )}
            </IdealNameArea>
          </div>
        </ImageViewArea>
      </ResultWrap>
    );

    // 밑 주석이 원래 코드
    const anotherRankList = [...rates];
    const rankerList = anotherRankList.splice(0, 3);
    rankerList.unshift(...rankerList.splice(1, 1));

    // let temp = rates[1];
    // const rankerList = rates.slice(0, 3);
    // rankerList.splice(1,1);
    // rankerList.unshift(temp);
    //  console.log(rankerList);
    // const anotherRankList = rates.slice(3);

    const renderRanker = rankerList.map(({ imageUrl: { host, pathname }, name, tags: { main, sub, optional }, firstRate, winRate }, i) => {
      const src = `${host}/${pathname}`;
      return (
        <RankerList key={uuid()} style={{ marginTop: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            {i === 1 ? (
              <div
                style={{
                  borderRadius: "70px",
                  overflow: "hidden",
                  width: "80px",
                  height: "80px",
                  position: "relative",
                  marginRight: "16px",
                  margin: "0",
                  boxShadow: "0px 4px 10px rgba(88, 79, 195, 0.55)",
                }}
              >
                <Image src={src} alt="#" layout="fill" objectFit="cover" margin="0" />
              </div>
            ) : (
              <div
                style={{
                  borderRadius: "30px",
                  overflow: "hidden",
                  width: "60px",
                  height: "60px",
                  position: "relative",
                  marginRight: "16px",
                  margin: "0",
                  boxShadow: "0px 4px 10px rgba(88, 79, 195, 0.55)",
                }}
              >
                <Image src={src} alt="#" layout="fill" objectFit="cover" />
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div style={{ flex: "1", fontSize: "12px", fontWeight: "600" }}>{main}</div>
            <div style={{ flex: "1", fontSize: "10px" }}>{sub}</div>

            <div
              style={{
                position: "relative",
                width: "20px",
                height: "20px",
                marginTop: "8px",
              }}
            >
              <Image src={i === 0 ? Silver : i === 1 ? Gold : Bronze} alt="#" layout="fill" objectFit="cover" />
            </div>
          </div>
        </RankerList>
      );
    });
    // 서버에서 받아온 4위부터 20위
    const totals = anotherRankList.map(({ imageUrl: { host, pathname }, name, tags: { main, sub, optional }, firstRate, winRate }, i) => {
      const src = `${host}/${pathname}`;
      console.log(src);

      return (
        <RankItemForm key={uuid()}>
          <div
            style={{
              width: "16px",
              fontSize: "12px",
              fontWeight: "600",
              display: "flex",
              justifyContent: "center",
              padding: "0 4px 0 4px",
            }}
          >
            {i + 4}
          </div>
          <ItemInfoForm>
            {/* <Image width="500px" height="500px" src={src} alt={name} /> */}
            <div
              style={{
                borderRadius: "50px",
                overflow: "hidden",
                position: "relative",
                margin: "0 12px 0 10px",
                boxShadow: "0px 4px 10px rgba(88, 79, 195, 0.4)",
              }}
            >
              <div style={{ width: "52.85px", height: "40px" }}>
                <Image src={src} alt="#" layout="fill" objectFit="cover" />
              </div>
            </div>
            <div style={{ display: "flex", width: "100%" }}>
              <div
                style={{
                  flex: "1",
                  fontSize: "12px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {main}
              </div>
              <div
                style={{
                  flex: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {sub}
              </div>
            </div>
          </ItemInfoForm>
        </RankItemForm>
      );
    });

    const onCapture = async () => {
      const canvas = await html2canvas(document.getElementById("capture"), {
        useCORS: true,
        allowTaint: true,
      });
      const image = canvas.toDataURL("image/png");
      const fileName = `${winnerName}-${Date.now()}.png`;

      let link = document.createElement("a");
      document.body.appendChild(link);
      link.href = image;
      link.download = fileName;
      link.click();
      document.body.removeChild(link);
    };

    return (
      <>
        {showTotals ? (
          <ModalForm>
            <div
              style={{
                background: "#fff",
                width: "100%",
                height: "50px",
                zIndex: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "fixed",
              }}
            >
              <FixedBanner style={{ display: "flex", margin: "10px 4.5px 8px 4.5px" }}>
                <div
                  style={{
                    flex: "0.5",
                    borderRadius: "70px",
                    overflow: "hidden",
                    width: "19px",
                    height: "19px",
                    position: "relative",
                    margin: "0 0 0 16px",
                  }}
                >
                  <Image src={Prev} alt="#" layout="fill" objectFit="cover" margin="0" onClick={() => setShowTotals(false)} />
                </div>

                <h4 style={{ flex: "8", textAlign: "center" }}>RANKING</h4>
                <div style={{ flex: "0.5", marginRight: "16px" }}></div>
              </FixedBanner>
            </div>

            <ul style={{ padding: "0", margin: "40px 0 0 0 " }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>{renderRanker}</div>
              {totals}
            </ul>
          </ModalForm>
        ) : (
          <>
            {winner}
            <CTACombo>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                {showTotals ? (
                  <CircleCTAForm>
                    <Image src={Retry} width="20px" height="20px" />
                  </CircleCTAForm>
                ) : (
                  <Link href={href}>
                    <CircleCTAForm>
                      <Image src={Retry} width="20px" height="20px" />
                    </CircleCTAForm>
                  </Link>
                )}
                {showTotals ? (
                  <CircleCTAForm>
                    <Image src={Share} width="20px" height="20px" />
                  </CircleCTAForm>
                ) : (
                  <CopyToClipboard text={`${window.origin}${href}`}>
                    <CircleCTAForm>
                      <Image src={Share} width="20px" height="20px" />
                    </CircleCTAForm>
                  </CopyToClipboard>
                )}
                <CircleCTAForm
                  onClick={() => {
                    if (!showTotals) onCapture();
                  }}
                >
                  <Image src={Capture} width="20px" height="20px" />
                </CircleCTAForm>
                <CircleCTAForm
                  onClick={() => {
                    if (!showTotals) setShowTotals(true);
                  }}
                >
                  <Image src={Ranking} width="20px" height="20px" />
                </CircleCTAForm>
              </div>
              <DirectCTA>
                <div
                  style={{
                    width: "124px",
                    height: "29px",
                    position: "relative",
                  }}
                >
                  <a href="https://kshopina.com/" target="_blank" rel="noopener noreferrer">
                    <Image src={Kshopina} objectFit="cover" layout="fill" />
                  </a>
                </div>
              </DirectCTA>
            </CTACombo>
          </>
        )}
      </>
    );
  } else {
    return <Loading />;
  }
};

export default memo(Results);
