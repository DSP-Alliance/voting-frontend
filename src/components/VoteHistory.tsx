import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';

import { getFip } from 'services/fipService';
import { useFipDataContext } from 'common/FipDataContext';
import VoteData from 'components/VoteData';
import { set } from 'react-hook-form';

const VoteHistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px;
`;

const Header = styled.h3`
  font-family: var(--font-color);
  font-size: 40px;
  font-weight: 600;
  margin: 0;
`;

const Divider = styled.div`
  border-bottom: 1px solid var(--divider);
  width: 100%;
  margin: 10px 0;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
`;

function VoteHistory() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [allFipData, setAllFipData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { fipList: fips, loadingFipData } = useFipDataContext();

  console.log({ allFipData });

  useEffect(() => {
    async function getFIPInfo() {
      setLoading(true);
      try {
        const response = await Promise.all(fips.map((fip) => getFip(fip)));
        setAllFipData(response);
      } catch (error: any) {
        setErrorMessage(JSON.stringify(error));
      }
      setLoading(false);
    }

    if (fips.length > 0) getFIPInfo();
  }, [fips]);

  return (
    <VoteHistoryContainer>
      <Header>Vote History</Header>
      {(loading || loadingFipData) && (
        <LoaderContainer>
          <ClipLoader color='var(--primary)' />
        </LoaderContainer>
      )}
      {allFipData.map((fipData) => (
        <div key={fipData.fip}>
          <VoteData fipData={fipData} address={undefined} showExpandButton />
          <Divider />
        </div>
      ))}
    </VoteHistoryContainer>
  );
}

export default VoteHistory;
