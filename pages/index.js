import React, { memo } from "react";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <Link href="/games/SelectGame">
        <a>Select Game!</a>
      </Link>
    </>
  );
};

export default memo(Home);
