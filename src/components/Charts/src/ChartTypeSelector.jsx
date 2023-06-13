import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {
  changedBalanceChartType,
  resetBalanceChartType,
  selectBalanceChartType,
} from 'rdx/params';
import { AutoBlurButton } from 'utils';

export const balanceChartTypes = ['multiple', 'candlestick'];

export const ChartTypeSelector = ({ ...props }) => {
  const dispatch = useDispatch();
  const balanceChartType = useSelector(selectBalanceChartType);
  const onChangeBalanceChartType = (type) => {
    dispatch(changedBalanceChartType(type));
  };

  useEffect(() => {
    if (!balanceChartTypes.includes(balanceChartType)) {
      dispatch(resetBalanceChartType());
    }
  }, [balanceChartType, dispatch]);

  return (
    <div className='text-center'>
      <div className='text-center pb-1'>Chart type</div>
      <ButtonGroup size='sm'>
        {balanceChartTypes.map((type) => (
          <AutoBlurButton
            key={`panel_charts_1_${type}`}
            variant={
              type === balanceChartType ? 'primary' : 'outline-secondary'
            }
            onClick={() => onChangeBalanceChartType(type)}
          >
            {type}
          </AutoBlurButton>
        ))}
      </ButtonGroup>
    </div>
  );
};
