import { Header as H } from '../components/Layout/header';

interface HeaderProps {
  preferredLanguage?: 'en' | 'cn';
}

function Header() {
  return (
    <div>
      <H />
    </div>
  );
}

export { Header, HeaderProps };
