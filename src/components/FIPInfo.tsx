import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { getFip } from 'services/fipService';

export interface FipData {
  author?: string;
  category?: string;
  created?: string;
  'discussions-to'?: string;
  fip?: string;
  status?: string;
  title?: string;
  type?: string;
}

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

function FIPInfo({ num }: { num: number }) {
  const [fipData, setFipData] = useState<FipData>();

  useEffect(() => {
    async function getFIPInfo() {
      // get fip info from github api
      try {
        const response = await getFip(num);
        setFipData(response);
      } catch (error) {
        console.error(error);
      }
    }

    getFIPInfo();
  }, []);

  return (
    <InfoContainer>
      <span>{fipData?.fip?.replace(/\"/g, '')}</span>
      <span>{fipData?.title}</span>
    </InfoContainer>
  );
}

export default FIPInfo;
