import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
`;

const Message = styled.div`
  font-size: 14px;
  background-color: var(--error-bg);
  color: var(--error);
  border-radius: 4px;
  padding: 12px;
  word-wrap: break-word;
  max-width: 50ch;
`;

function ErrorMessage({ message }: { message: string }) {
  return (
    <MessageContainer>
      <Message>Error: {message}</Message>
    </MessageContainer>
  );
}

export default ErrorMessage;
