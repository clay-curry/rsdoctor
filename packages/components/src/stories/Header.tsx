import React from 'react';
import { Header } from '../components/Layout/header';

interface HeaderProps {
  preferredLanguage?: 'en' | 'cn';
}

function UncoupledHeader({ preferredLanguage }: HeaderProps) {
  return <Header />;
}

export { UncoupledHeader, HeaderProps };
