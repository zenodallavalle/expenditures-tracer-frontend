import { useEffect, useState } from 'react';

import { getGraphHeight, LoadingDiv } from 'utils';

export const ChartWrapper = ({
  isLoading,
  ChildrenRenderer = ({ ...childrenProps }) => null,
  ...props
}) => {
  const [graphHeight, setGraphHeight] = useState(getGraphHeight());
  const divStyle = {};
  if (graphHeight) {
    divStyle.height = graphHeight;
  }

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setGraphHeight(getGraphHeight());
    } else {
      setGraphHeight(getGraphHeight());
    }
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isLoading) return <LoadingDiv />;
  return (
    <div className='w-100'>
      {props.children || null}
      <div className='w-100' style={divStyle}>
        <ChildrenRenderer options={{ maintainAspectRatio: !graphHeight }} />
      </div>
    </div>
  );
};
export default ChartWrapper;
