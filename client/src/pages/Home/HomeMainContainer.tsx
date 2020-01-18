import React from 'react';
import { css } from '@emotion/core';
import useTheme from '../../utils/useTheme';

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
      as 1234
    </div>
  );
};

export default HomeMainContainer;
