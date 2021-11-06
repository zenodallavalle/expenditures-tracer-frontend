import { useSelector } from 'react-redux';

import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

import {
  capitalize,
  getTextColorClassForDelta,
  formatDate,
  LoadingImg,
  AutoBlurButton,
} from 'utils';

import { expendituresSelectors } from 'rdx/expenditures';
import { usersSelectors } from 'rdx/users';

const right = 'text-end';
const center = 'text-center';

const legend = 'small fst-italic p-0 pt-4';
const value = 'p-0';
const prospect = 'p-0';

const rightLegend = [right, legend].join(' ');
const centerLegend = [center, legend].join(' ');

const rightValue = [right, value].join(' ');
const centerValue = [center, value].join(' ');

const rightProspect = [right, prospect].join(' ');
const centerProspect = [center, prospect].join(' ');

const ComparisonExpenditure = ({ id }) => {
  const expenditure = useSelector(expendituresSelectors.getById(id));
  return (
    <div>
      <span>{expenditure?.name}</span>
      <span className='me-1'>,</span>
      <span className='me-1 fw-bold'>{expenditure?.value}</span>
      <span className='fw-bold'>€</span>
    </div>
  );
};

const ComparisonRow = ({ expectedId }) => {
  const expected = useSelector(expendituresSelectors.getById(expectedId));
  const actualIds = expected.actual_expenditures;
  return (
    <tr>
      <td className={value}>
        <ComparisonExpenditure id={expectedId} />
      </td>
      <td />
      <td className={rightValue}>
        {actualIds.map((aId) => (
          <ComparisonExpenditure
            key={`expenditure_comparison_${aId}`}
            id={aId}
          />
        ))}
      </td>
    </tr>
  );
};

const ExpenditureModal = ({
  id,
  show = false,
  setShow = () => {},
  setShowEditExpenditure = () => {},
  ...props
}) => {
  const expenditure = useSelector(expendituresSelectors.getById(id));
  const user = useSelector(usersSelectors.getById(expenditure?.user));

  const hasRelated = expenditure?.is_expected
    ? Boolean(expenditure?.actual_expenditures)
    : Boolean(expenditure?.expected_expenditure);

  const expectedId =
    hasRelated && expenditure.is_expected
      ? expenditure.id
      : expenditure.expected_expenditure;

  return (
    <Modal
      show={show}
      onClose={() => setShow(false)}
      onClick={(e) => {
        !(e.target instanceof HTMLButtonElement) && e.stopPropagation();
      }}
    >
      <Modal.Header closeButton>
        <h5 className='me-2'>
          {expenditure ? (
            capitalize(expenditure.name)
          ) : (
            <LoadingImg width={20} />
          )}
        </h5>
        <Badge variant='primary'>
          {expenditure ? (
            expenditure.is_expected ? (
              'expected'
            ) : (
              'actual'
            )
          ) : (
            <LoadingImg width={20} />
          )}
        </Badge>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div>
            <span className='me-1'>Value</span>
            <span>{expenditure?.value}</span>
            <span className='ms-1'>€</span>
          </div>
          <div className='fst-italic small'>
            <span className='me-1'>Registered by:</span>
            <span className='fw-bold me-1'>
              {user ? user.username : <LoadingImg width={20} />}
            </span>
            <span>{formatDate(expenditure?.date)}</span>
          </div>
        </div>
        <hr />
        {hasRelated ? (
          <Table borderless size='sm'>
            <tbody>
              <ComparisonRow expectedId={expectedId} />
              <tr>
                <th className={legend}>Expected expenditure</th>
                <th className={centerLegend}>Delta</th>
                <th className={rightLegend}>Actual expenditures</th>
              </tr>

              <tr>
                <td className={prospect}>
                  {expenditure?.prospect?.expected || ''}
                </td>
                <td
                  className={
                    centerProspect +
                    ` ${getTextColorClassForDelta(
                      expenditure?.prospect?.delta
                    )}`
                  }
                >
                  {expenditure?.prospect?.delta !== null ||
                  expenditure?.prospect?.delta !== undefined
                    ? expenditure?.prospect?.delta
                    : ''}
                </td>
                <td className={rightProspect}>
                  {expenditure?.prospect?.actual}
                </td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <div>This expenditure has no related expenditures</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <AutoBlurButton
          onClick={() => setShowEditExpenditure(true)}
          className='w-100'
        >
          Edit
        </AutoBlurButton>
      </Modal.Footer>
    </Modal>
  );
};

export default ExpenditureModal;
