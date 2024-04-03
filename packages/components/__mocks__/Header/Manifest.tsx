import React from 'react';

export const withServerAPI = ({
  Component,
  ...props
}: {
  Component: React.JSXElementConstructor<any>;
}) => (
  <>
    <Component {...props} />
  </>
);
