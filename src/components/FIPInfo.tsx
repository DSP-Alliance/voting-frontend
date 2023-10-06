import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { getFip } from 'services/fipService';
import type { FipData } from 'services/fipService';

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Link = styled.a`
  color: var(--primary);
  word-break: break-all;
`;

const ErrorMessage = styled.div`
  font-size: 14px;
  align-self: center;
  color: var(--error);
`;

function FIPInfo({ num }: { num: number }) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fipData, setFipData] = useState<FipData>();

  useEffect(() => {
    async function getFIPInfo() {
      try {
        const response = await getFip(num);
        setFipData(response);
      } catch (error: any) {
        setErrorMessage(JSON.stringify(error));
      }
    }

    getFIPInfo();
  }, [num]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderDiscussionLinks = (links: string | undefined) => {
    if (links) {
      const linksArray = links.split(', ').map((link) => {
        return (
          <li key={link}>
            <Link href={link} target='_blank' rel='noreferrer'>
              {link}
            </Link>
          </li>
        );
      });

      return linksArray;
    } else {
      return '-';
    }
  };

  return (
    <InfoContainer>
      <span>
        {'#' + fipData?.fip?.replace(/(\"|)/g, '').replace(/^0+/, '')}
      </span>
      <span>{fipData?.title}</span>
      <span>{`Authors: ${fipData?.author?.replace(/\"/g, '')}`}</span>
      <span>{`Status: ${fipData ? fipData.status : '-'}`}</span>
      <span>
        Discussions:
        <ul>{fipData && renderDiscussionLinks(fipData['discussions-to'])}</ul>
      </span>
      {errorMessage && <ErrorMessage>Error: {errorMessage}</ErrorMessage>}
    </InfoContainer>
  );
}

export default FIPInfo;
