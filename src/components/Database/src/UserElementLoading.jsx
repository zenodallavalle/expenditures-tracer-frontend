import ContentLoader from 'react-content-loader';

export const UserElementLoading = ({ ...props }) => (
  <ContentLoader
    speed={2}
    width={518}
    height={48}
    viewBox='0 0 518 48'
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
    {...props}
  >
    <rect x='0' y='8' rx='4' ry='4' width='486' height='25' />
  </ContentLoader>
);
