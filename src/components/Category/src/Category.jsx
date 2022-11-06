import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import clsx from 'clsx';

import FormControl from 'react-bootstrap/FormControl';
import { InlineIcon } from '@iconify/react';
import plus16 from '@iconify/icons-octicon/plus-16';
import dash16 from '@iconify/icons-octicon/dash-16';
import eyeClosed16 from '@iconify/icons-octicon/eye-closed-16';
import foldDown16 from '@iconify/icons-octicon/fold-down-16';
import foldUp16 from '@iconify/icons-octicon/fold-up-16';

import {
  useAutomaticGetCategoryQuery,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
} from 'api/categoryApiSlice';
import {
  selectCategoryViewStatus,
  updatedCategoryViewStatus,
} from 'rdx/params';
import {
  AutoBlurTransparentButton,
  FunctionalitiesMenu,
  getColorFor,
  getColumnWidth,
} from 'utils';

const Category = ({ id, children = null, readOnly = false, ...props }) => {
  const dispatch = useDispatch();

  const { data: category, isLoading } = useAutomaticGetCategoryQuery({ id });

  const categoryViewStatus = useSelector(selectCategoryViewStatus(id));

  const [patchCategory, { error: patchCategoryError }] =
    useEditCategoryMutation();

  const [deleteCategory] = useDeleteCategoryMutation();

  const [patch, setPatch] = useState({ id });
  const [isEditing, setIsEditing] = useState(false);

  const ref = useRef();

  const collapsed = categoryViewStatus === 'collapsed';
  const hidden = categoryViewStatus === 'hidden';

  const collapseCategory = () =>
    dispatch(
      updatedCategoryViewStatus({ id, categoryViewStatus: 'collapsed' })
    );
  const expandCategory = () =>
    dispatch(updatedCategoryViewStatus({ id, categoryViewStatus: 'expanded' }));
  const hideCategory = () =>
    dispatch(updatedCategoryViewStatus({ id, categoryViewStatus: 'hidden' }));
  const toggleCollapsedExpandedCategory = collapsed
    ? expandCategory
    : collapseCategory;

  const onChange = (e) => {
    if (category[e.target.name] !== e.target.value)
      setPatch({ ...patch, [e.target.name]: e.target.value });
    else {
      const updatePatch = { ...patch };
      delete updatePatch[e.target.name];
      setPatch(updatePatch);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onEdited();
    }
  };

  const onEdit = (e) => {
    setIsEditing(true);
  };

  useEffect(() => {
    isEditing && ref.current?.focus();
  }, [isEditing]);

  const onEdited = async (e, onSuccess = () => {}, onFail = () => {}) => {
    if (Object.keys(patch).length > 1) {
      const response = await patchCategory(patch);
      if (response.data) {
        setPatch({ id });
        setIsEditing(false);
        onSuccess();
      } else if (response.error) {
        onFail();
      }
    } else {
      onSuccess();
      setIsEditing(false);
    }
  };

  const onDelete = async (e, onSuccess = () => {}, onFail = () => {}) => {
    const response = await deleteCategory({ id });
    if (response.data) return onSuccess();
  };

  const onMove = (relativeDelta) => () => {
    console.warn('onMove not implemented yet.', { relativeDelta });
  };

  const FunctionalitiesMenuCompiled = (
    <FunctionalitiesMenu
      clickable={!isLoading}
      onEdit={onEdit}
      isEditing={isEditing}
      onEdited={onEdited}
      onDelete={onDelete}
      deleteConfirmTimeout={4000}
      autocollapseTimeout={4000}
    />
  );

  if (hidden) return null;
  return (
    <div
      className=' mt-1 mb-3 mx-auto w-100'
      style={{ maxWidth: getColumnWidth(), minWidth: getColumnWidth() * 0.7 }}
    >
      <div
        className={clsx([
          'px-1',
          'border',
          'rounded',
          `border-${getColorFor({ type: 'category', id })}`,
        ])}
      >
        <div className='d-flex align-items-center pb-1'>
          {isEditing ? (
            <>
              <div>
                <AutoBlurTransparentButton onClick={hideCategory}>
                  <InlineIcon icon={eyeClosed16} />
                </AutoBlurTransparentButton>
              </div>
              <div>
                <AutoBlurTransparentButton onClick={onMove(1)}>
                  <InlineIcon icon={foldDown16} />
                </AutoBlurTransparentButton>
              </div>
              <div>
                <AutoBlurTransparentButton onClick={onMove(-1)}>
                  <InlineIcon icon={foldUp16} />
                </AutoBlurTransparentButton>
              </div>
            </>
          ) : (
            <div>
              <AutoBlurTransparentButton
                onClick={toggleCollapsedExpandedCategory}
              >
                <InlineIcon icon={collapsed ? plus16 : dash16} />
              </AutoBlurTransparentButton>
            </div>
          )}
          <div className='flex-grow-1 text-primary px-1'>
            {isEditing ? (
              <>
                <FormControl
                  name='name'
                  className='my-1 me-2'
                  value={
                    patch.name === undefined ? category?.name || '' : patch.name
                  }
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  ref={ref}
                  disabled={isLoading}
                />
                {patchCategoryError?.data?.name?.map((msg, idx) => (
                  <div
                    key={`patch_category_${id}_error_${idx}`}
                    className='text-danger'
                  >
                    {msg}
                  </div>
                ))}
              </>
            ) : (
              <div>{category?.name}</div>
            )}
          </div>
          {!readOnly && <div>{FunctionalitiesMenuCompiled}</div>}
        </div>
        {!collapsed && children}
      </div>
    </div>
  );
};

export default Category;
