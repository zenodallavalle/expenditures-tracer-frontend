import ContentLoader from 'react-content-loader';

export const CategoryContentLoading = ({ ...props }) => {
  return (
    <ContentLoader
      speed={2}
      width={500}
      height={156}
      viewBox='0 0 500 156'
      backgroundColor='#f3f3f3'
      foregroundColor='#ecebeb'
      {...props}
    >
      <rect x='4' y='8' rx='4' ry='4' width='480' height='20' />
      <rect x='34' y='40' rx='4' ry='4' width='450' height='80' />
      <rect x='4' y='128' rx='4' ry='4' width='480' height='20' />
    </ContentLoader>
  );
};
