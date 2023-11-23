import styled from 'styled-components';

const RoundedButton = styled.button<{ width?: string }>`
  color: var(--white);
  background-color: var(--primary);
  border-radius: 24px;
  padding: 0 12px;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: ${(props) => props.width || 'unset'};
`;

export default RoundedButton;
