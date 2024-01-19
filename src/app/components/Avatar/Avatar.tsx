// src/components/ui/avatar/index.js
import styled from 'styled-components';

export const Avatar = styled.div`
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: grey;
  border-radius: 8px;
  // Add more styling as needed
`;

export const AvatarImage = styled.img`
  height: 100%;
  width: 100%;
  border-radius: 50%;
  // Add more styling as needed
`;

export const AvatarFallback = styled.div`
  // Add styling for fallback avatar
`;
