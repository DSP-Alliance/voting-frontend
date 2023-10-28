import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IoIosCopy, IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';

const Code = styled.div`
  white-space: pre-wrap;
  overflow-wrap: break-word;
  position: relative;
  margin-top: 8px;
`;

const CopyButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding-top: 0;
  margin-top: -5px;
  background-color: transparent;
  color: var(--primary);

  &:hover:enabled {
    background-color: transparent;
  }
`;

const Toggles = styled(ToggleButtonGroup)`
  position: absolute;
  top: 0;
  left: 0;
  margin-top: -12px;

  [class*='MuiToggleButton-root'] {
    font-size: 0.6rem;
    line-height: 1;
  }
`;

function CodeSnippet({
  code,
  showOptions,
}: {
  code: string;
  showOptions?: boolean;
}) {
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [version, setVersion] = useState<'lotus' | 'venus'>('lotus');

  useEffect(() => {
    if (copiedText) {
      const timeout = setTimeout(() => {
        setCopiedText(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [copiedText]);

  return (
    <Code>
      {showOptions && (
        <Toggles
          value={version}
          onChange={(e, value) => value && setVersion(value)}
          size='small'
          exclusive
        >
          <ToggleButton value='lotus'>Lotus</ToggleButton>
          <ToggleButton value='venus'>Venus</ToggleButton>
        </Toggles>
      )}
      <CopyToClipboard
        text={showOptions ? `${version}${code}` : code}
        onCopy={() => setCopiedText(true)}
      >
        <CopyButton type='button'>
          {copiedText ? (
            <>
              <span>Copied!</span>
              <IoIosCheckmarkCircleOutline />
            </>
          ) : (
            <>
              <span>Copy</span>
              <IoIosCopy />
            </>
          )}
        </CopyButton>
      </CopyToClipboard>
      <SyntaxHighlighter
        lineProps={{
          style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' },
        }}
        language='bash'
        wrapLines={true}
        wrapLongLines={true}
      >
        {showOptions ? `${version}${code}` : code}
      </SyntaxHighlighter>
    </Code>
  );
}

export default CodeSnippet;
