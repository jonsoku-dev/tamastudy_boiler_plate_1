import React from 'react';
import Button from '.';

export default {
  title: 'atoms|Button',
  component: Button,
};

export const Summary = () => (
  <>
    <RegisterBtn />
  </>
);

export const RegisterBtn = () => (
  <Button
    onClick={e => {
      e.preventDefault();
      alert('회원가입 alert');
    }}
  >
    회원가입
  </Button>
);
