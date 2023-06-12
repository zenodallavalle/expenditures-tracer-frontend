import Carousel from 'react-bootstrap/Carousel';
import { CategoriesExpendituresChartCore } from './CategoriesExpendituresChart';
import { BalanceComplexChartCore } from './BalanceComplexChart';
import { MoneyCandlestickChartCore } from './MoneyCandlestickChart';
import { useDispatch } from 'react-redux';
import { changedPanel } from 'rdx/params';
import { AutoBlurButton } from 'utils';

export const ChartsCarousel = ({ ...props }) => {
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(changedPanel('charts'));
  };

  return (
    <div className='pb-2 w-100'>
      <div className='text-center'>
        <AutoBlurButton className='py-0 w-100' onClick={onClick} size='sm'>
          Charts
        </AutoBlurButton>
      </div>
      <Carousel interval={5000} touch variant='dark' indicators={false}>
        <Carousel.Item>
          <CategoriesExpendituresChartCore />
        </Carousel.Item>
        <Carousel.Item>
          <BalanceComplexChartCore balanceChartPeriod={'1Y'} hideLine />
        </Carousel.Item>
        <Carousel.Item>
          <MoneyCandlestickChartCore balanceChartPeriod={'1Y'} />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default ChartsCarousel;
