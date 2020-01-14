/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import useTheme from '../../../utils/useTheme';

interface Props {
  work?: boolean;
  bgColor?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<Props> = ({ work = true, bgColor, children, onClick, ...rest }) => {
  const theme = useTheme();
  return (
    <button
      css={css`
        background-color: ${bgColor ? bgColor : theme.color.primary.main};
        color: ${theme.color.primary.white1};
        padding: 0.6rem 1.2rem;
        border-radius: 5px;
        margin: 1rem;
        text-transform: uppercase;
        pointer-events: ${work ? 'auto' : 'none'};
      `}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
