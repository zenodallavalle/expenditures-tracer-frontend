import LoadingImg from 'components/LoadingImg';
import { databaseSelectors } from 'rdx/database';
import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { InlineIcon } from '@iconify/react';
import pencil16 from '@iconify/icons-octicon/pencil-16';
import ActualMoneyOrIncomeOffcanvas from 'components/actualMoneyOrIncomeOffcanvas';

const retrieveClassForDeltaDiv = (value) => {
  if (value > 0) {
    return 'text-success';
  } else if (value < 0) {
    return 'text-danger';
  }
  return 'text-dark';
};

const Prospect = (props) => {
  const isLoading = useSelector(databaseSelectors.isLoading());
  const prospect = useSelector(databaseSelectors.getProspect());
  const categories = useSelector(databaseSelectors.getCategories());
  const [showEditMoneyIncomeOffcavas, setShowEditMoneyIncomeOffcavas] =
    useState(false);

  return (
    <React.Fragment>
      <div key='prospectCell' className='border border-primary rounded my-2'>
        <div className='w-100 text'>
          <div className='text-primary m-1 border-primary rounded bg-primary pl-1'>
            <div className='d-flex'>
              <div className='flex-grow-1 text-light'>Overall prospect</div>
              <div>
                <Button
                  className='py-0'
                  onClick={() => setShowEditMoneyIncomeOffcavas(true)}
                >
                  <InlineIcon icon={pencil16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='clearfix m-1 text-center'>
          <div className='float-left text-justify'>
            <span className='text-muted'>
              <small>
                <em>Income</em>
              </small>
              <br />
            </span>
            {!prospect ? (
              <LoadingImg style={{ height: 30 }} />
            ) : (
              prospect.income
            )}
          </div>
          <div className='float-right text-right'>
            <span className='text-muted'>
              <small>
                <em>Current money</em>
              </small>
              <br />
            </span>
            {!prospect ? (
              <LoadingImg style={{ height: 30 }} />
            ) : (
              prospect.actual_money
            )}
          </div>
        </div>
        <div className='clearfix m-1 text-center'>
          <div className='float-left text-justify'>
            <span className='text-muted'>
              <small>
                <em>Expected expenditure</em>
              </small>
              <br />
            </span>
            {!prospect ? (
              <LoadingImg style={{ height: 30 }} />
            ) : (
              prospect.expected_expenditure
            )}
          </div>
          <div className='float-right text-right'>
            <span className='text-muted'>
              <small>
                <em>Actual expenditure</em>
              </small>
              <br />
            </span>
            {!prospect ? (
              <LoadingImg style={{ height: 30 }} />
            ) : (
              prospect.actual_expenditure
            )}
          </div>
          <div className=''>
            <span className='text-muted'>
              <small>
                <em>Delta</em>
              </small>
              <br />
            </span>
            <div
              className={retrieveClassForDeltaDiv(prospect?.delta_expenditure)}
            >
              {!prospect ? (
                <LoadingImg style={{ height: 30 }} />
              ) : (
                prospect.delta_expenditure
              )}
            </div>
          </div>
        </div>
        <div className='clearfix m-1 text-center'>
          <div className='float-left text-justify'>
            <span className='text-muted'>
              <small>
                <em>Expected saving</em>
              </small>
              <br />
            </span>
            {!prospect ? (
              <LoadingImg style={{ height: 30 }} />
            ) : (
              prospect.expected_saving
            )}
          </div>
          <div className='float-right text-right'>
            <span className='text-muted'>
              <small>
                <em>Actual saving</em>
              </small>
              <br />
            </span>
            {!prospect ? (
              <LoadingImg style={{ height: 30 }} />
            ) : (
              prospect.actual_saving
            )}
          </div>
          <div className=''>
            <span className='text-muted'>
              <small>
                <em>Delta</em>
              </small>
              <br />
            </span>
            <div className={retrieveClassForDeltaDiv(prospect?.delta_saving)}>
              {!prospect ? (
                <LoadingImg style={{ height: 30 }} />
              ) : (
                prospect.delta_saving
              )}
            </div>
          </div>
        </div>
        {prospect?.warn && (
          <Alert className='m-0 py-1 text-center ' variant='warning'>
            {prospect.warn}
          </Alert>
        )}
      </div>
      {isLoading ? (
        <div className='text-center'>
          <LoadingImg />
        </div>
      ) : (
        <div>
          {!categories ? (
            <p className='text-center'>
              <em>
                No categories created yet.
                <br />
                Go to actual or expected expenditure panel and create one.
              </em>
            </p>
          ) : (
            categories.map((category) => (
              <div
                key={'categoryprospect' + category.id}
                className='border border-primary rounded my-2 pb-1'
              >
                <div className='w-100 pl-1'>
                  <div className='text-primary m-1 clearfix'>
                    <span>{category.name}</span>
                  </div>
                </div>
                <div className='clearfix m-1 text-center'>
                  <div className='float-left text-justify'>
                    <span className='text-muted'>
                      <small>
                        <em>Expected</em>
                      </small>
                      <br />
                    </span>
                    {category.prospect.expected_expenditure}
                  </div>
                  <div className='float-right text-right'>
                    <span className='text-muted'>
                      <small>
                        <em>Actual</em>
                      </small>
                      <br />
                    </span>
                    {category.prospect.actual_expenditure}
                  </div>
                  <div className=''>
                    <span className='text-muted'>
                      <small>
                        <em>Delta</em>
                      </small>
                      <br />
                    </span>
                    <div
                      className={retrieveClassForDeltaDiv(
                        category.prospect.delta
                      )}
                    >
                      {category.prospect.delta}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <ActualMoneyOrIncomeOffcanvas
        show={showEditMoneyIncomeOffcavas}
        onHide={() => setShowEditMoneyIncomeOffcavas(false)}
      />
    </React.Fragment>
  );
};

export default Prospect;
