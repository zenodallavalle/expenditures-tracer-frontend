import ContentLoader from 'react-content-loader';

export const CategoryProspectLoading = ({ ...props }) => (
  <ContentLoader
    speed={2}
    width={500}
    height={86}
    viewBox='0 0 500 86'
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
    {...props}
  >
    <rect x='4' y='4' rx='4' ry='4' width='480' height='20' />
    <rect x='4' y='40' rx='4' ry='4' width='60' height='15' />
    <rect x='4' y='65' rx='4' ry='4' width='60' height='15' />
    <rect x='220' y='65' rx='4' ry='4' width='60' height='15' />
    <rect x='220' y='40' rx='4' ry='4' width='60' height='15' />
    <rect x='430' y='40' rx='4' ry='4' width='60' height='15' />
    <rect x='430' y='65' rx='4' ry='4' width='60' height='15' />
  </ContentLoader>
);
