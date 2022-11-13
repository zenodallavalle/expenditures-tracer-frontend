import ContentLoader from 'react-content-loader';

export const DatabaseLoading = ({ ...props }) => (
  <ContentLoader
    speed={2}
    width={436}
    height={40}
    viewBox='0 0 436 40'
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
    {...props}
  >
    <rect x='88' y='5' rx='4' ry='4' width='350' height='25' />
    <rect x='0' y='5' rx='4' ry='4' width='80' height='25' />
  </ContentLoader>
);
