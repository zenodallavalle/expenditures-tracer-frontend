import { useEffect, useState } from 'react';

import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { AutoBlurButton, getFirstDateForPreviousMonth } from 'utils';
import { useAutomaticGetFullDBQuery } from 'api/dbApiSlice';
import { createContext } from 'react';
import { Category } from './Category';
import { useNewExpendituresMutation } from 'api/expenditureApiSlice';

export const ExpendituresCopyModal = ({
  show,
  onHide = () => {},
  ...props
}) => {
  const CopyExpendituresContext = createContext();
  const [selected, setSelected] = useState([]);

  const firstDateOfPreviousMonth = getFirstDateForPreviousMonth();
  const previousMonthString = `${
    firstDateOfPreviousMonth.getMonth() + 1
  }-${firstDateOfPreviousMonth.getFullYear()}`;

  const [monthSource, setMonthSource] = useState(previousMonthString);

  const { data: fullDB, isLoading } = useAutomaticGetFullDBQuery();
  const categories = fullDB?.categories;
  const months = fullDB?.months_list;

  const onSelectMonth = (e) => {
    setMonthSource(e.target.value);
  };

  const [
    newExpenditure,
    {
      isLoading: newExpendituresAreLoading,
      isSuccess: newExpendituresAreSuccess,
    },
  ] = useNewExpendituresMutation();

  const onCopy = () => {
    newExpenditure(selected);
  };

  useEffect(() => {
    if (newExpendituresAreSuccess) {
      setSelected([]);
      onHide();
    }
  }, [newExpendituresAreSuccess, onHide]);

  return (
    <div>
      <Modal size='lg' show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <div className='fw-bold'>
            {`Expected expenditures from ${monthSource}`}
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className='d-flex align-items-baseline'>
            <div className='me-1'>Select source month</div>
            <Form.Select disabled={isLoading} onChange={onSelectMonth}>
              {months?.map(({ month, isWorking }) => (
                <option
                  value={month}
                  disabled={isWorking}
                  key={`copy_previous_expenditures_modal_month_source_option_${month}`}
                >
                  {isWorking ? `${month} - this is current month` : month}
                </option>
              ))}
            </Form.Select>
          </div>
          <CopyExpendituresContext.Provider
            value={{
              selected,
              setSelected,
              month: monthSource,
              newExpendituresAreLoading,
            }}
          >
            {categories.map((catId) => (
              <Category
                key={`copy_expenditures_modal_category_id_${catId}`}
                id={catId}
                context={CopyExpendituresContext}
              />
            ))}
          </CopyExpendituresContext.Provider>
        </Modal.Body>

        <Modal.Footer>
          <div className='d-flex justify-content-between w-100'>
            <div>
              <AutoBlurButton onClick={onHide} variant='danger'>
                Cancel
              </AutoBlurButton>
            </div>
            <div>
              <AutoBlurButton
                disabled={
                  isLoading || newExpendituresAreLoading || !selected.length
                }
                onClick={onCopy}
              >
                Copy selected
              </AutoBlurButton>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
