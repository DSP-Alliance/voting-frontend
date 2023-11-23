import styled from 'styled-components';

const RoundedOutlineButton = styled.button`
  color: var(--primary);
  background-color: var(--white);
  border: 1px solid var(--primary);
  border-radius: 24px;
  padding: 0 12px;

  &:hover {
    color: var(--white);
  }
`;

export default RoundedOutlineButton;
