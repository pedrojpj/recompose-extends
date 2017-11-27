import styled, { css } from 'styled-components';

export const Title = styled.h1`
  color: Crimson;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
  margin: 0 0 5px 0;
  padding: 0;
`;

export const Button = styled.button`
  border: 0;
  background: transparent;
  font-weight: bold;
  color: Crimson;
  text-decoration: underline;
  outline: 0;
  margin-bottom: 5px;
`;

export const Subtitle = styled.h2`
  color: Black;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  margin: 0 0 10px 0;
  padding: 0;
`;

export const Content = styled.p`
  color: Crimson;
  font-size: 12px;
  line-height: 14px;
  font-weight: light;
  text-align: left;
  padding: 10px;
`;

export const Container = styled.div`
  background: GhostWhite;
  padding: 0;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  max-height: 0;
  transition: all 500ms ease;

  ${props =>
    props.active &&
    css`
      max-height: 500px;
    `};
`;
