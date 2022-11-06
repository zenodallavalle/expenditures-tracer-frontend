import Table from 'react-bootstrap/Table';

import { useAutomaticGetFullDBQuery } from 'api/dbApiSlice';
import { getTextColorClassForDelta, LoadingImg } from 'utils';

const right = 'text-end';
const center = 'text-center';

const legend = 'small fst-italic p-0';
const value = 'p-0';

const rightLegend = [right, legend].join(' ');
const centerLegend = [center, legend].join(' ');

const rightValue = [right, value].join(' ');
const centerValue = [center, value].join(' ');

export const DatabaseProspect = ({ ...props }) => {
  const { data: fullDB, isLoading } = useAutomaticGetFullDBQuery();
  const prospect = fullDB?.prospect;

  return (
    <div>
      <Table borderless size='sm'>
        <tbody>
          <tr>
            <th className={legend}>Income</th>
            <th></th>
            <th className={rightLegend}>Current money</th>
          </tr>
          <tr>
            <td className={value}>
              {prospect?.income === undefined || isLoading ? (
                <LoadingImg maxWidth={24} />
              ) : (
                prospect.income
              )}
            </td>
            <td></td>
            <td className={rightValue}>
              {prospect?.actual_money === undefined || isLoading ? (
                <LoadingImg maxWidth={24} />
              ) : (
                prospect.actual_money
              )}
            </td>
          </tr>

          <tr>
            <th className={legend}>Expected expenditure</th>
            <th className={centerLegend}>Delta</th>
            <th className={rightLegend}>Actual expenditure</th>
          </tr>
          <tr>
            <td className={value}>
              {prospect?.expected_expenditure === undefined || isLoading ? (
                <LoadingImg maxWidth={24} />
              ) : (
                prospect.expected_expenditure
              )}
            </td>
            <td
              className={
                centerValue +
                ` ${getTextColorClassForDelta(prospect?.delta_expenditure)}`
              }
            >
              {prospect?.delta_expenditure === undefined || isLoading ? (
                <LoadingImg maxWidth={24} />
              ) : (
                prospect.delta_expenditure
              )}
            </td>
            <td className={rightValue}>
              {prospect?.actual_expenditure === undefined || isLoading ? (
                <LoadingImg maxWidth={24} />
              ) : (
                prospect.actual_expenditure
              )}
            </td>
          </tr>

          <tr>
            <th className={legend}>Expected saving</th>
            <th className={centerLegend}>Delta</th>
            <th className={rightLegend}>Actual saving</th>
          </tr>
          <tr>
            <td className={value}>
              {prospect?.expected_saving === undefined || isLoading ? (
                <LoadingImg maxWidth={24} />
              ) : (
                prospect.expected_saving
              )}
            </td>
            <td
              className={
                centerValue +
                ` ${getTextColorClassForDelta(prospect?.delta_saving)}`
              }
            >
              {prospect?.delta_saving === undefined || isLoading ? (
                <LoadingImg maxWidth={24} />
              ) : (
                prospect.delta_saving
              )}
            </td>
            <td className={rightValue}>
              {prospect?.actual_saving === undefined || isLoading ? (
                <LoadingImg maxWidth={24} />
              ) : (
                prospect.actual_saving
              )}
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
