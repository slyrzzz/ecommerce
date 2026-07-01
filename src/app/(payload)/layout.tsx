import '@payloadcms/next/css';
import configPromise from '@payload-config';
import { RootLayout } from '@payloadcms/next/layouts';
import React from 'react';
import { importMap } from './importMap';
import { payloadServerFunction } from './actions';

type Args = {
  children: React.ReactNode;
};

const Layout = ({ children }: Args) => {
  return (
    // @ts-ignore
    <RootLayout config={configPromise} importMap={importMap} serverFunction={payloadServerFunction}>
      {children}
    </RootLayout>
  );
};

export default Layout;
