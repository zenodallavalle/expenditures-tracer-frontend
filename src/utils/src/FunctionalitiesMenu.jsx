import { useState, useEffect, useRef, useCallback } from 'react';
import Collapse from 'react-bootstrap/Collapse';

import { InlineIcon } from '@iconify/react';
import pencil16 from '@iconify/icons-octicon/pencil-16';
import check16 from '@iconify/icons-octicon/check-16';
import trashcan16 from '@iconify/icons-octicon/trashcan-16';
import kebabHorizontal16 from '@iconify/icons-octicon/kebab-horizontal-16';
import chevronRight16 from '@iconify/icons-octicon/chevron-right-16';

import { LoadingDiv, AutoBlurTransparentButton } from 'utils';

const FunctionalitiesMenu = ({
  isExtended: passedIsExtended,
  setIsExtended: passedSetIsExtended,
  autocollapseTimeout,
  clickable = true,
  hideExpander = false,
  onEdit,
  isEditing = false,
  onEdited,
  onDelete = () => {},
  askDeleteConfirm = true,
  deleteConfirmTimeout = 3000,
  ...props
}) => {
  const [_isExtended, _setIsExtended] = useState(false);
  const isExtended =
    passedIsExtended === undefined || passedSetIsExtended === undefined
      ? _isExtended
      : passedIsExtended;
  const setIsExtended =
    passedIsExtended === undefined || passedSetIsExtended === undefined
      ? _setIsExtended
      : passedSetIsExtended;
  const [showExpander, setShowExpander] = useState(true);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteTimeoutRef = useRef();
  const autocollapseTimeoutRef = useRef();

  const [isApplyingEdit, setIsApplyingEdit] = useState(false);
  const [isApplyingDelete, setIsApplyingDelete] = useState(false);

  useEffect(() => {
    if (!isExtended) {
      setIsApplyingDelete(false);
      setIsApplyingEdit(false);
    }
  }, [isExtended]);

  const clearAutocollapseTimeout = useCallback(() => {
    if (autocollapseTimeoutRef.current) {
      clearTimeout(autocollapseTimeoutRef.current);
      autocollapseTimeoutRef.current = null;
    }
  }, [autocollapseTimeoutRef]);

  const clearAskConfirmTimeout = useCallback(() => {
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
      deleteTimeoutRef.current = null;
    }
  }, [deleteTimeoutRef]);

  useEffect(() => {
    if (deleteConfirmTimeout && !deleteTimeoutRef.current) {
      deleteTimeoutRef.current = setTimeout(() => {
        setConfirmDelete(false);
        deleteTimeoutRef.current = null;
      }, deleteConfirmTimeout);
    }
  }, [deleteConfirmTimeout, deleteTimeoutRef]);

  const toggleExpand = () => setIsExtended(!isExtended);

  useEffect(() => {
    if (isExtended) {
      if (autocollapseTimeout) {
        if (!autocollapseTimeoutRef.current) {
          autocollapseTimeoutRef.current = setTimeout(() => {
            setIsExtended(false);
            autocollapseTimeoutRef.current = null;
          }, autocollapseTimeout);
        }
      }
    } else {
      clearAutocollapseTimeout();
      if (confirmDelete) setConfirmDelete(false);
      clearAskConfirmTimeout();
    }
    return () => {
      // clear residual timeouts on unmount components
      clearAutocollapseTimeout();
      clearAskConfirmTimeout();
    };
  }, [
    isExtended,
    setIsExtended,
    autocollapseTimeout,
    autocollapseTimeoutRef,
    confirmDelete,
    clearAutocollapseTimeout,
    clearAskConfirmTimeout,
  ]);

  const onEditBtn = (e) => {
    clearAutocollapseTimeout();
    clearAskConfirmTimeout();
    if (isEditing) {
      if (onEdited) {
        setIsApplyingEdit(true);
        onEdited(
          e,
          () => setIsExtended(false),
          () => setIsApplyingEdit(false)
        );
      }
    } else {
      if (onEdit) {
        if (!onEdited) {
          setIsApplyingEdit(true);
        }
        onEdit(
          e,
          () => setIsExtended(false),
          () => setIsApplyingEdit(false)
        );
      }
    }
  };

  const onDeleteBtn = (e) => {
    if (!askDeleteConfirm) {
      if (onDelete) {
        setIsApplyingDelete(true);
        onDelete(
          e,
          () => setIsExtended(false),
          () => setIsApplyingDelete(false)
        );
      }
    } else {
      if (!confirmDelete) {
        setConfirmDelete(true);
      } else {
        clearAskConfirmTimeout();
        if (onDelete) {
          setIsApplyingDelete(true);
          onDelete(
            e,
            () => setIsExtended(false),
            () => setIsApplyingDelete(false)
          );
        }
      }
    }
  };

  return (
    <div className='d-flex flex-row'>
      {showExpander && !hideExpander && (
        <div>
          <AutoBlurTransparentButton
            onClick={toggleExpand}
            disabled={!clickable}
          >
            <InlineIcon icon={kebabHorizontal16} />
          </AutoBlurTransparentButton>
        </div>
      )}
      <Collapse
        in={isExtended}
        onExited={() => setShowExpander(true)}
        onEnter={() => setShowExpander(false)}
        dimension='width'
      >
        <div>
          <div className='d-flex flex-row'>
            <div>
              <AutoBlurTransparentButton
                onClick={toggleExpand}
                disabled={!clickable || isEditing}
              >
                <InlineIcon icon={chevronRight16} />
              </AutoBlurTransparentButton>
            </div>
            {(isEditing ? onEdited : onEdit) && (
              <div>
                <AutoBlurTransparentButton
                  onClick={onEditBtn}
                  disabled={!clickable || isApplyingEdit || isApplyingDelete}
                >
                  {isApplyingEdit ? (
                    <LoadingDiv maxWidth={15} />
                  ) : (
                    <InlineIcon icon={isEditing ? check16 : pencil16} />
                  )}
                </AutoBlurTransparentButton>
              </div>
            )}
            {onDelete && (
              <div>
                <AutoBlurTransparentButton
                  className={
                    !isApplyingDelete && (!askDeleteConfirm || confirmDelete)
                      ? ' btn-danger'
                      : ''
                  }
                  onClick={onDeleteBtn}
                  disabled={!clickable || isApplyingEdit || isApplyingDelete}
                >
                  {isApplyingDelete ? (
                    <LoadingDiv maxWidth={15} />
                  ) : (
                    <InlineIcon icon={trashcan16} />
                  )}
                </AutoBlurTransparentButton>
              </div>
            )}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default FunctionalitiesMenu;
