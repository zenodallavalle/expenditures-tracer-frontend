import Carousel from 'react-bootstrap/Carousel';
import { CategoriesExpendituresChartCore } from './CategoriesExpendituresChart';
import { BalanceMultipleChartCore } from './BalanceMultipleChart';
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
          <div className='w-100' style={{ height: 250 }}>
            <CategoriesExpendituresChartCore
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className='w-100' style={{ height: 250 }}>
            <BalanceMultipleChartCore
              balanceChartPeriod={'1Y'}
              hideLine
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className='w-100' style={{ height: 250 }}>
            <MoneyCandlestickChartCore
              balanceChartPeriod={'1Y'}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default ChartsCarousel;
