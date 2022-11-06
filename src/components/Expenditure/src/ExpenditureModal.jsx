import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

import {
  capitalize,
  getTextColorClassForDelta,
  formatDateTime,
  LoadingImg,
  AutoBlurButton,
} from 'utils';

import { useGetExpenditureQuery } from 'api/expenditureApiSlice';
import {
  useGetUserQuery,
  useAutomaticUserTokenAuthQuery,
} from 'api/userApiSlice';

import { ComparisonRow } from './Comparison';

const right = 'text-end';
const center = 'text-center';

const legend = 'small fst-italic p-0 pt-4';
// const value = 'p-0';
const prospect = 'p-0';

const rightLegend = [right, legend].join(' ');
const centerLegend = [center, legend].join(' ');

// const rightValue = [right, value].join(' ');
// const centerValue = [center, value].join(' ');

const rightProspect = [right, prospect].join(' ');
const centerProspect = [center, prospect].join(' ');

const ExpenditureModal = ({
  id,
  show = false,
  setShow = () => {},
  setShowEditExpenditure = () => {},
  editable,
  ...props
}) => {
  const {
    data: expenditure,
    isLoading,
    isSuccess,
  } = useGetExpenditureQuery({ id });

  const { data: mainUser, isLoading: mainuUserIsLoading } =
    useAutomaticUserTokenAuthQuery();

  const { data: user, isLoading: userIsLoading } = useGetUserQuery(
    { id: expenditure?.user },
    {
      skip:
        isLoading || mainuUserIsLoading || expenditure?.user === mainUser.id,
    }
  );

  const creator = expenditure?.user === mainUser.id ? mainUser : user;
  const creatorIsLoading =
    expenditure?.user === mainUser.id ? mainuUserIsLoading : userIsLoading;

  const hasRelated = expenditure?.is_expected
    ? expenditure?.actual_expenditures
    : expenditure?.expected_expenditure;

  const expectedId =
    hasRelated && expenditure?.is_expected
      ? id
      : expenditure?.expected_expenditure;

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      onClick={(e) => {
        !(e.target instanceof HTMLButtonElement) && e.stopPropagation();
      }}
    >
      <Modal.Header closeButton>
        <h5 className='me-2'>
          {isLoading ? <LoadingImg width={20} /> : capitalize(expenditure.name)}
        </h5>
        {isSuccess && (
          <Badge variant='primary'>
            {expenditure?.is_expected ? 'expected' : 'actual'}
          </Badge>
        )}
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
              {creatorIsLoading ? <LoadingImg width={20} /> : creator?.username}
            </span>
            <span>{formatDateTime(expenditure?.date)}</span>
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
      {editable && (
        <Modal.Footer>
          <AutoBlurButton
            onClick={() => {
              setShowEditExpenditure(true);
              setShow(false);
            }}
            className='w-100'
          >
            Edit
          </AutoBlurButton>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ExpenditureModal;
