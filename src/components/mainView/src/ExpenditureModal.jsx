import { useSelector } from 'react-redux';

import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import { capitalize, formatDate, LoadingImg, AutoBlurButton } from 'utils';

import { expendituresSelectors } from 'rdx/expenditures';
import { usersSelectors } from 'rdx/users';

const ComparisonExpenditure = ({ id }) => {
  const expenditure = useSelector(expendituresSelectors.getById(id));
  return (
    <div className='text-center'>
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
    <Row>
      <Col>
        <div className='text-center'>Expected</div>
        <ComparisonExpenditure id={expectedId} />
      </Col>
      <Col>
        <div className='text-center'>Actual</div>
        {actualIds.map((aId) => (
          <ComparisonExpenditure
            key={`expenditure_comparison_${aId}`}
            id={aId}
          />
        ))}
      </Col>
    </Row>
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
          <ComparisonRow expectedId={expectedId} />
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
