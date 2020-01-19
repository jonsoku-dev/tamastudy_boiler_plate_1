/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import useTheme from '../../../utils/useTheme';

interface Props {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text:
    | 'registry'
    | 'login'
    | 'logout'
    | 'write'
    | 'remove'
    | 'update'
    | 'reservation'
    | 'cancel'
    | 'close';
}

// onClick 함수가 있을 때 : active
// onClick 함수가 없을 때 : inActive

const Button: React.FC<Props> = ({ text, onClick, ...rest }) => {
  const theme = useTheme();
  const fontColorMapping = {
    registry: theme.color.primary.white.almost,
    login: theme.color.primary.white.almost,
    logout: theme.color.primary.white.almost,
    write: theme.color.primary.white.almost,
    remove: theme.color.primary.white.almost,
    update: theme.color.primary.white.almost,
    reservation: theme.color.primary.white.almost,
    cancel: theme.color.primary.white.almost,
    close: theme.color.primary.white.almost
  };
  const buttonColorMapping = {
    registry: theme.color.material.teal,
    login: theme.color.material.teal,
    logout: theme.color.system.red,
    write: theme.color.material.teal,
    remove: theme.color.system.red,
    update: theme.color.material.teal,
    reservation: theme.color.material.teal,
    cancel: theme.color.system.red,
    close: theme.color.system.red
  };
  return (
    <button
      css={css`
        cursor: ${!onClick && 'not-allowed'};
        pointer-events: ${!onClick && 'none'};
      `}
      onClick={onClick}
    >
      <div
        css={css`
          box-sizing: border-box;
          color: ${onClick ? fontColorMapping[text] : theme.color.text.dark3};
          background-color: ${onClick ? buttonColorMapping[text] : theme.color.icon.darkInactive};
          padding: 1.1rem 1.5rem;
          border-radius: 15px;
          text-transform: uppercase;
          box-shadow: 2px 2px 28px 0px rgba(0, 0, 0, 0.39);
          font-size: 1rem;
          transition: all 0.8s;
          line-height: 1;
          &:hover {
            opacity: 0.8;
          }
        `}
        {...rest}
      >
        {text}
      </div>
    </button>
  );
};

export default Button;
