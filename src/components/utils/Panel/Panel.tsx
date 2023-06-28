import { PropsWithChildren } from 'react';

import './Panel.css';

function Panel (props: PropsWithChildren) {
  return <div className='Panel'>{props.children}</div>
}

export default Panel;
