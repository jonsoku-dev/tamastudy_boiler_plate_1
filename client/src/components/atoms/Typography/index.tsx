/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import styled from '@emotion/styled';
import useTheme from '../../../utils/useTheme';

interface Props {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'body3'
    | 'body4'
    | 'caption';
}

const Typography: React.FC<Props> = ({ variant, ...children }) => {
  const theme = useTheme();

  return <div>{children}</div>;
};

export default Typography;
