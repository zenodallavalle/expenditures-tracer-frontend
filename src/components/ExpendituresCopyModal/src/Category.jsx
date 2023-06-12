import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

import chevronDown16 from '@iconify/icons-octicon/chevron-down-16';
import chevronUp16 from '@iconify/icons-octicon/chevron-up-16';

import { useGetCategoryWithoutProvidingTagsQuery } from 'api/categoryApiSlice';
import { AutoBlurTransparentButton, getColorFor, LoadingDiv } from 'utils';

import { Expenditure } from './Expenditure';
import { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { InlineIcon } from '@iconify/react';

export const Category = ({ id, context, ...props }) => {
  const { month } = useContext(context);

  const [expanded, setExpanded] = useState(true);

  const { data: category, isLoading } = useGetCategoryWithoutProvidingTagsQuery(
    { id, month }
  );

  useEffect(() => {
    if (category && !category.expected_expenditures.length) {
      setExpanded();
    }
  }, [category]);

  const onToggleExpanded = () => setExpanded((s) => !s);

  if (isLoading) return <LoadingDiv />;

  return (
    <div className='mb-2'>
      <div className='d-flex align-items-baseline'>
        <div>
          <AutoBlurTransparentButton onClick={onToggleExpanded}>
            <InlineIcon icon={expanded ? chevronUp16 : chevronDown16} />
          </AutoBlurTransparentButton>
        </div>
        <div className='fw-bold me-1'>{category?.name}</div>
        {!isLoading && (
          <Badge
            as='div'
            pill
            bg={getColorFor({ type: `category_${category?.db}`, id })}
          >
            {category?.expected_expenditures?.length}
          </Badge>
        )}
      </div>

      {expanded &&
        (!category?.expected_expenditures.length ? (
          <div className='fst-italic'>No expected expenditures registered.</div>
        ) : (
          <ListGroup>
            {category?.expected_expenditures.map((expId) => (
              <Expenditure
                key={`copy_expenditures_modal_expenditure_id_${expId}`}
                id={expId}
                context={context}
              />
            ))}
          </ListGroup>
        ))}
    </div>
  );
};
