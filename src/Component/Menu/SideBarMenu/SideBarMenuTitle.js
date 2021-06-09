import React from 'react';
import { useSelector } from 'react-redux';

const SideBarMenuTitle = () => {
  const activeWindow = useSelector((e) => e.WINDOWFRAME_REDUCER !== undefined && e.WINDOWFRAME_REDUCER['activeWindow'], (p, n) => {
    return p.programId === n.programId;
  });

  const nam = activeWindow.programNam !== undefined ? activeWindow.programNam : '\u00A0';

  return (
    <h2>
      {nam}
    </h2>
  );
};

export default SideBarMenuTitle;