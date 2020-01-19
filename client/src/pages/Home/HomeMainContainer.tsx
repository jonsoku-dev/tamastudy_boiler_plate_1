import React from 'react';
import { css } from '@emotion/core';
import useTheme from '../../utils/useTheme';
import Button from '../../components/atoms/Button/index';

const HomeMainContainer = () => {
  const theme = useTheme();
  return (
    <div
      css={css`
        width: 100%;
        height: 520px;
        background-color: ${theme.color.primary.beige};
      `}
    >
      <Button text="registry" />
      <Button text="registry" />
    </div>
  );
};

export default HomeMainContainer;
