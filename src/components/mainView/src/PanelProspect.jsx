import { AutoBlurButton } from 'utils';
import { databaseSelectors } from 'rdx/database';
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { useSelector } from 'react-redux';
import { InlineIcon } from '@iconify/react';
import pencil16 from '@iconify/icons-octicon/pencil-16';
import MoneyIncomeOffcanvas from 'components/moneyEditor';
import { getTextColorClassForDelta } from 'utils';
import Category from './Category';
import Prospect from './Prospect';

const PanelProspect = (props) => {
  const isLoading = useSelector(databaseSelectors.isLoading());
  const prospect = useSelector(databaseSelectors.getProspect());
  const categoriesIds = useSelector(databaseSelectors.getCategoriesIds());
  const notHiddenCategories = useSelector(
    databaseSelectors.getNotHiddenCategories()
  );
  const hiddenCategoriesIds = useSelector(
    databaseSelectors.getHiddenCategoriesIds()
  );

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
        {!categoriesIds ? (
          <p className='text-center'>
            <em>
              No categories created yet.
              <br />
              Please, go to actual or expected expenditure panel and create one.
            </em>
          </p>
        ) : (
          <div>
            {notHiddenCategories.map(({ id, prospect }) => (
              <Category id={id} key={'category_prospect' + id} readOnly>
                <div className='d-flex justify-content-between px-1 pb-1'>
                  <div className='d-flex flex-column text-center'>
                    <div className='fst-italic fw-light small'>Expected</div>
                    <div>{prospect.expected_expenditure}</div>
                  </div>

                  <div className='d-flex flex-column text-center'>
                    <div className='fst-italic fw-light small'>Delta</div>
                    <div className={getTextColorClassForDelta(prospect.delta)}>
                      {prospect.delta}
                    </div>
                  </div>

                  <div className='d-flex flex-column text-center'>
                    <div className='fst-italic fw-light small'>Actual</div>
                    <div>{prospect.actual_expenditure}</div>
                  </div>
                </div>
              </Category>
            ))}
            {hiddenCategoriesIds.length > 0 && (
              <div className='text-center fst-italic small'>
                <div>{`There ${
                  hiddenCategoriesIds.length === 1 ? 'is' : 'are'
                } ${hiddenCategoriesIds.length} hidden categories.`}</div>
                <div>
                  To include them in the prospect view expand them in
                  expenditures view.
                </div>
              </div>
            )}
          </div>
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
