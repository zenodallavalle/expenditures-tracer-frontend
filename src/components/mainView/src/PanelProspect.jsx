import { AutoBlurButton } from 'utils';
import { databaseSelectors } from 'rdx/database';
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { useSelector } from 'react-redux';
import { InlineIcon } from '@iconify/react';
import pencil16 from '@iconify/icons-octicon/pencil-16';
import MoneyIncomeOffcanvas from 'components/moneyEditor';
import Category from './Category';
import Prospect from './Prospect';

const retrieveClassForDeltaDiv = (value) => {
  if (value > 0) {
    return 'text-success';
  } else if (value < 0) {
    return 'text-danger';
  }
  return 'text-dark';
};

const PanelProspect = (props) => {
  const isLoading = useSelector(databaseSelectors.isLoading());
  const prospect = useSelector(databaseSelectors.getProspect());
  const categories = useSelector(databaseSelectors.getCategories());
  const [showEditMoneyIncomeOffcavas, setShowEditMoneyIncomeOffcavas] =
    useState(false);

  return (
    <div>
      <div className='border rounded border-primary p-1 mt-1 mb-3'>
        <div className='pb-1'>
          <div className='d-flex rounded bg-primary text-light'>
            <div className='flex-grow-1 px-1'>Overall prosepct</div>
            <div>
              <AutoBlurButton
                onClick={() => setShowEditMoneyIncomeOffcavas(true)}
                className='py-0'
                disabled={isLoading}
              >
                <InlineIcon icon={pencil16} />
              </AutoBlurButton>
            </div>
          </div>
        </div>

        <Prospect />

        {prospect?.warn && (
          <Alert variant='warning' className='mb-0 p-1 text-center small'>
            {prospect.warn}
          </Alert>
        )}
      </div>

      <div>
        {!categories ? (
          <p className='text-center'>
            <em>
              No categories created yet.
              <br />
              Please, go to actual or expected expenditure panel and create one.
            </em>
          </p>
        ) : (
          categories.map(({ id, prospect }) => (
            <Category id={id} key={'category_prospect' + id} readOnly>
              <div className='d-flex justify-content-between p-1'>
                <div className='d-flex flex-column text-center'>
                  <div className='fst-italic fw-light small'>Expected</div>
                  <div>{prospect.expected_expenditure}</div>
                </div>

                <div className='d-flex flex-column text-center'>
                  <div className='fst-italic fw-light small'>Delta</div>
                  <div className={retrieveClassForDeltaDiv(prospect.delta)}>
                    {prospect.delta}
                  </div>
                </div>

                <div className='d-flex flex-column text-center'>
                  <div className='fst-italic fw-light small'>Actual</div>
                  <div>{prospect.actual_expenditure}</div>
                </div>
              </div>
            </Category>
          ))
        )}
      </div>

      <MoneyIncomeOffcanvas
        show={showEditMoneyIncomeOffcavas}
        onHide={() => setShowEditMoneyIncomeOffcavas(false)}
      />
    </div>
  );
};

export default PanelProspect;
