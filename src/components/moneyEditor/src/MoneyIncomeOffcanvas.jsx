import { useSelector } from 'react-redux';

import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';
import { LoadingDiv } from 'utils';
import { databaseSelectors } from 'rdx/database';

import CurrentMoney from './CurrentMoney';
import Income, { AddIncome } from './Income';

const MoneyIncomeOffcanvas = ({
  show = false,
  onHide = () => {},
  ...props
}) => {
  const isLoading = useSelector(databaseSelectors.isLoading());
  const incomesIds = useSelector(databaseSelectors.getIncomesIds());

  return (
    <Offcanvas show={show} onHide={onHide} placement='end'>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Income and current money</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <CurrentMoney />

        <h5 className='text-center'>Incomes</h5>

        {isLoading && !incomesIds?.length ? (
          <LoadingDiv maxWidth={100} />
        ) : incomesIds?.length === 0 ? (
          <div className='fst-italic text-center mb-2'>
            No incomes registered yet
          </div>
        ) : (
          <ListGroup variant='flush'>
            {incomesIds?.map((id) => (
              <ListGroup.Item key={`income_${id}`}>
                <Income id={id} />
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <AddIncome />
      </Offcanvas.Body>
    </Offcanvas>
  );
};
export default MoneyIncomeOffcanvas;
