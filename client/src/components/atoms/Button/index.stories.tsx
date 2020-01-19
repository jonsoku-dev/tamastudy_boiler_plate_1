import React from 'react';
import Button from '.';

export default {
  title: 'atoms|Button',
  component: Button
};

export const Summary = () => (
  <>
    <Button text="registry" />
    <Button onClick={() => {}} text="login" />
    <Button onClick={() => {}} text="logout" />
    <Button onClick={() => {}} text="write" />
    <Button onClick={() => {}} text="update" />
    <Button onClick={() => {}} text="remove" />
    <Button onClick={() => {}} text="reservation" />
    <Button onClick={() => {}} text="cancel" />
    <Button onClick={() => {}} text="close" />
  </>
);
