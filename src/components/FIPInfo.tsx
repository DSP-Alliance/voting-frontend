import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import FipService from 'services/fipService';
import type { FipData } from 'services/fipService';

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

function FIPInfo({ num }: { num: number }) {
  const [fipData, setFipData] = useState<FipData>();

  useEffect(() => {
    async function getFIPInfo() {
      try {
        const response = await FipService.getFip(num);
        setFipData(response);
      } catch (error) {
        console.error(error);
      }
    }

    getFIPInfo();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <InfoContainer>
      <span>{fipData?.fip?.replace(/\"/g, '')}</span>
      <span>{fipData?.title}</span>
      <span>{`Authors: ${fipData?.author?.replace(/\"/g, '')}`}</span>
      <span>{`Status: ${fipData ? fipData.status : '-'}`}</span>
      <span>{`Discussions: ${fipData ? fipData['discussions-to'] : '-'}`}</span>
    </InfoContainer>
  );
}

export default FIPInfo;
