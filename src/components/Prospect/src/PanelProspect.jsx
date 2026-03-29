import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import Alert from 'react-bootstrap/Alert';
import { InlineIcon } from '@iconify/react';

import { useAutomaticGetFullDBQuery } from '/src/api/dbApiSlice';
import { Category, CategoryProspect } from '/src/components/Category';
import { CurrentMoneyIncomesOffcanvas } from '/src/components/CurrentMoneyIncomes';
import { selectHiddenCategoriesIds } from '/src/rdx/params';
import { AutoBlurButton, getColumnWidth } from '/src/utils';

import { DatabaseProspect } from './DatabaseProspect';
import { DatabaseProspectLoading } from './DatabaseProspectLoading';
import { ChartsCarousel } from '/src/components/Charts';

export const PanelProspect = (props) => {
  const { data: fullDB, isSuccess, isLoading } = useAutomaticGetFullDBQuery();
  const prospect = fullDB?.prospect;
  const categoriesIds = fullDB?.categories;

  const hiddenCategoriesIdsForAllDB = useSelector(selectHiddenCategoriesIds);

  const hiddenCategoriesIds = useMemo(() => {
    hiddenCategoriesIdsForAllDB?.filter((id) =>
      fullDB?.categories.includes(id),
    );
  }, [hiddenCategoriesIdsForAllDB, fullDB?.categories]);

  const [showEditMoneyIncomeOffcavas, setShowEditMoneyIncomeOffcavas] =
    useState();

  return (
    <div className="mx-auto" style={{ maxWidth: getColumnWidth() }}>
      <div className="border rounded border-primary p-1 mt-1 mb-3">
        {isLoading ? (
          <DatabaseProspectLoading />
        ) : (
          <>
            <div className="pb-1">
              <div className="d-flex rounded bg-primary text-light">
                <div className="flex-grow-1 px-1">Overall prosepct</div>
                <div>
                  <AutoBlurButton
                    onClick={() => setShowEditMoneyIncomeOffcavas(true)}
                    className="py-0"
                    disabled={!isSuccess}
                  >
                    <InlineIcon icon="octicon:pencil-16" />
                  </AutoBlurButton>
                </div>
              </div>
            </div>

            <DatabaseProspect />

            {prospect?.warn && (
              <Alert variant="warning" className="mb-0 p-1 text-center small">
                {prospect.warn}
              </Alert>
            )}
          </>
        )}
      </div>
      <div>
        {isLoading ? null : !categoriesIds?.length ? (
          <div className="text-center fst-italic">
            No categories created yet.
            <br />
            Please, go to actual or expected expenditure panel and create one.
          </div>
        ) : (
          <div>
            <ChartsCarousel />
            {categoriesIds?.map((id) => (
              <Category id={id} key={'category_prospect' + id} readOnly>
                <CategoryProspect id={id} />
              </Category>
            ))}
            {hiddenCategoriesIds?.length > 0 && (
              <div className="text-center fst-italic small">
                <div>
                  {hiddenCategoriesIds?.length === 1
                    ? 'There is one hidden category.'
                    : `There are ${hiddenCategoriesIds?.length} hidden categories.`}
                </div>
                <div>
                  {`To include ${
                    hiddenCategoriesIds?.length === 1 ? 'it' : 'them'
                  } in the prospect view, expand ${
                    hiddenCategoriesIds?.length === 1 ? 'it' : 'them'
                  } in
                  expenditures view.`}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <CurrentMoneyIncomesOffcanvas
        show={showEditMoneyIncomeOffcavas}
        onHide={() => setShowEditMoneyIncomeOffcavas(false)}
      />
    </div>
  );
};
