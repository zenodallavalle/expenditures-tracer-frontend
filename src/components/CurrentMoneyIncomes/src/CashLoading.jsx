import ContentLoader from 'react-content-loader';

export const CashLoading = ({ ...props }) => (
  <ContentLoader
    speed={2}
    width={380}
    height={48}
    viewBox='0 0 380 48'
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
    {...props}
  >
    <rect x='8' y='2' rx='4' ry='4' width='343' height='15' />
    <rect x='8' y='24' rx='4' ry='4' width='343' height='15' />
  </ContentLoader>
);
