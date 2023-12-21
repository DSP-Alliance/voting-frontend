import * as React from 'react';
import styled from 'styled-components';

const Parentdiv = styled.div`
  height: 22px;
  width: 100%;
  background-color: whitesmoke;
  border-radius: 40px;
  margin-top: 4px;
`;

const Childdiv = styled.div<{ progress: number; bgcolor: string }>`
  height: 100%;
  width: ${(props) => props.progress}%;
  background-color: ${(props) => props.bgcolor};
  border-radius: 40px;
  text-align: right;
`;

const ProgressText = styled.span`
  padding: 10px;
  color: black;
  font-weight: 900;
`;

function ProgressBar({
  progress,
  bgcolor,
}: {
  progress: number;
  bgcolor: string;
}) {
  return (
    <Parentdiv>
      <Childdiv progress={progress} bgcolor={bgcolor}>
        <ProgressText>{`${progress}%`}</ProgressText>
      </Childdiv>
    </Parentdiv>
  );
}

export default ProgressBar;
