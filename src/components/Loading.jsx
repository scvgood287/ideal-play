import React, { memo } from "react";
import { PuffLoader as Loader } from "react-spinners";

const Loading = ({ loading = true, width = "320px", height = "500px" }) => {
  console.log(loading, width, height);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width,
      height
    }}>
      <Loader loading={loading} color={"#43235b"} />
    </div>
  );
};

export default memo(Loading);