import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { getFip } from 'services/fipService';
import type { FipData } from 'services/fipService';
import Loading from 'common/Loading';
import { useFipDataContext } from 'common/FipDataContext';
import ErrorMessage from 'common/ErrorMessage';
import VoteActionsModal from 'components/VoteActionsModal';
import VoteData from 'components/VoteData';

const VoteDataContainer = styled.div`
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

function LatestVote({
  hasRegistered,
  showVoteModal,
  setShowVoteModal,
}: {
  hasRegistered: boolean;
  showVoteModal: boolean;
  setShowVoteModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [fipData, setFipData] = useState<FipData>();
  const [errorMessage, setErrorMessage] = useState('');

  const { loadingFipData, lastFipAddress, lastFipNum } = useFipDataContext();

  useEffect(() => {
    async function getFIPInfo() {
      if (lastFipNum) {
        try {
          const response = await getFip(lastFipNum);
          setFipData(response);
        } catch (error: any) {
          setErrorMessage(JSON.stringify(error));
        }
      }
    }

    getFIPInfo();
  }, [lastFipNum]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <VoteDataContainer>
      <Header>Current Vote</Header>
      {loadingFipData && <Loading />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {fipData && (
        <VoteData
          fipData={fipData}
          address={lastFipAddress}
          setShowVoteModal={setShowVoteModal}
        />
      )}
      {lastFipAddress && (
        <VoteActionsModal
          open={showVoteModal}
          onClose={() => setShowVoteModal(false)}
          address={lastFipAddress}
          hasRegistered={hasRegistered}
        />
      )}
    </VoteDataContainer>
  );
}

export default LatestVote;
