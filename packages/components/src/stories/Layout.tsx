import React, { useRef } from 'react';

import { Button } from './Button';

type Tree<T> = {
  name: T;
  children?: Tree<T>[];
};

function RecursiveTabs({ routes }: { routes: Tree<string> }) {
  const ref = useRef<HTMLLIElement>(null);
  const [isHover, setHover] = React.useState({ self: false, children: false });
  if (!routes.children) {
    return <button>{routes.name}</button>;
  } else {
    const showTabs = isHover.self || isHover.children;

    return (
      <div style={{ position: 'relative' }}>
        <div
          onPointerEnter={() => setHover({ ...isHover, self: true })}
          onPointerLeave={() => setHover({ ...isHover, self: false })}
        >
          <button>{routes.name}</button>;
        </div>
        {showTabs && (
          <ul
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
            onPointerEnter={() => setHover({ ...isHover, children: true })}
            onPointerLeave={() => setHover({ ...isHover, children: false })}
          >
            {routes.children.map((route, index) => (
              <li ref={ref} key={index}>
                <RecursiveTabs routes={route} />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export const Header = ({ routes }: { routes: Tree<string> }) => (
  <div style={{ paddingTop: '32px', paddingBottom: '32px' }}>
    <header
      style={{
        background: '#eeeeee',
        margin: '16px',
        padding: '8px',
        borderRadius: '24px',
      }}
    >
      {routes && (
        <nav style={{ display: 'flex', justifyContent: 'end', gap: '6px' }}>
          {routes.children?.map((route, index) => (
            <RecursiveTabs key={index} routes={route} />
          ))}
        </nav>
      )}
    </header>
  </div>
);
