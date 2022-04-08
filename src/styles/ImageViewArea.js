import styled from "styled-components";
export const ImageViewArea = styled.div`
  display: flex;
  width: 320px;
  height: 200px;
  overflow: hidden;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
`;

export const ImageSizeControl = styled.img``;

export const IdealNameArea = styled.div`
  width: 300px;
  height: 50px;
  background: rgba(0, 0, 0, 0.65);
  padding: 4px 16px 4px 16px;
  box-sizing: border-box;
  border-radius: 10px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  & > p {
    margin: 0;
    font-size: 12px;
  }
`;
