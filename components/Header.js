import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link route="/">
        <a className="item">BoostIdea</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/">
          <a className="item">Ideas</a>
        </Link>

        <Link route="/ideas/new">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};