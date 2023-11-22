import React from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
`;

function Loading({ size }: { size?: number }) {
  return (
    <LoaderContainer>
      <ClipLoader color='var(--primary)' size={size} />
    </LoaderContainer>
  );
}

export default Loading;
