import ContentLoader from 'react-content-loader';

export const ExpenditureLoading = ({ ...props }) => (
  <ContentLoader
    speed={2}
    width={480}
    height={80}
    viewBox='0 0 480 80'
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
    {...props}
  >
    <rect x='8' y='5' rx='4' ry='4' width='440' height='20' />
    <rect x='8' y='35' rx='4' ry='4' width='440' height='10' />
    <rect x='8' y='55' rx='4' ry='4' width='440' height='20' />
  </ContentLoader>
);
