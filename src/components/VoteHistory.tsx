import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';
import { useTranslation } from 'react-i18next';

import { getFip } from 'services/fipService';
import { useFipDataContext } from 'common/FipDataContext';
import ErrorMessage from 'common/ErrorMessage';
import VoteData from 'components/VoteData';

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
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [allFipData, setAllFipData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { fipList: fips, loadingFipData } = useFipDataContext();

  useEffect(() => {
    async function getFIPInfo() {
      setLoading(true);
      try {
        const response = await Promise.all(
          fips.map((fip) =>
            getFip(fip).catch((error) => {
              console.error(error);
              return null;
            }),
          ),
        );
        setAllFipData(response.filter((a) => a));
      } catch (error: any) {
        setErrorMessage(error.message);
      }
      setLoading(false);
    }

    if (fips.length > 0) getFIPInfo();
  }, [fips]);

  return (
    <VoteHistoryContainer>
      <Header>{t('voteHistory')}</Header>
      {errorMessage && <ErrorMessage message={errorMessage} />}
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
