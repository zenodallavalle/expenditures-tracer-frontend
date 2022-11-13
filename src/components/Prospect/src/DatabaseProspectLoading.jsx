import ContentLoader from 'react-content-loader';

export const DatabaseProspectLoading = ({ ...props }) => (
  <ContentLoader
    speed={2}
    width={500}
    height={190}
    viewBox='0 0 500 190'
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
    {...props}
  >
    <rect x='4' y='4' rx='4' ry='4' width='486' height='20' />
    <rect x='4' y='90' rx='4' ry='4' width='120' height='15' />
    <rect x='220' y='90' rx='4' ry='4' width='60' height='15' />
    <rect x='430' y='40' rx='4' ry='4' width='60' height='15' />
    <rect x='370' y='90' rx='4' ry='4' width='120' height='15' />
    <rect x='4' y='40' rx='4' ry='4' width='60' height='15' />
    <rect x='4' y='140' rx='4' ry='4' width='120' height='15' />
    <rect x='220' y='140' rx='4' ry='4' width='60' height='15' />
    <rect x='370' y='140' rx='4' ry='4' width='120' height='15' />
    <rect x='4' y='165' rx='4' ry='4' width='120' height='15' />
    <rect x='220' y='165' rx='4' ry='4' width='60' height='15' />
    <rect x='370' y='165' rx='4' ry='4' width='120' height='15' />
    <rect x='370' y='115' rx='4' ry='4' width='120' height='15' />
    <rect x='220' y='115' rx='4' ry='4' width='60' height='15' />
    <rect x='4' y='115' rx='4' ry='4' width='120' height='15' />
    <rect x='4' y='65' rx='4' ry='4' width='60' height='15' />
    <rect x='430' y='65' rx='4' ry='4' width='60' height='15' />
  </ContentLoader>
);
