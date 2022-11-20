import ContentLoader from 'react-content-loader';

export const DatabaseProspectLoading = ({ ...props }) => (
  <ContentLoader
    speed={2}
    className='w-100'
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
    {...props}
  >
    <rect y='0' rx='4' ry='4' height='20' className='w-100 px-3 my-2' />

    <rect y='30' rx='4' ry='4' height='20' className='w-100'></rect>
    <rect y='60' rx='4' ry='4' height='20' className='w-100'></rect>
    <rect y='90' rx='4' ry='4' height='20' className='w-100'></rect>
    <rect y='120' rx='4' ry='4' height='20' className='w-100'></rect>
  </ContentLoader>
);
