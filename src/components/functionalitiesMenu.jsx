import { useState, useEffect, useCallback } from 'react';
import { InlineIcon } from '@iconify/react';
import pencil16 from '@iconify/icons-octicon/pencil-16';
import check16 from '@iconify/icons-octicon/check-16';
import trashcan16 from '@iconify/icons-octicon/trashcan-16';
import kebabHorizontal16 from '@iconify/icons-octicon/kebab-horizontal-16';
import chevronRight16 from '@iconify/icons-octicon/chevron-right-16';
import { CSSTransition } from 'react-transition-group';

const onFocus = (props) => (e) => {
  setImmediate(() => {
    e.target.blur();
  });
  if (props.onFocus) props.onFocus(e);
};

const getPropsForElement = (props) => ({
  ...props,
  onFocus: onFocus(props),
});

const Button = (props) => <button {...getPropsForElement(props)} />;

const FunctionalitiesMenu = ({
  available,
  confirmDeleteTimeout,
  showExpander = true,
  showControls: _showControls = false,
  onShowControlsChanged: _onShowControlsChanged = () => {},
  onEdit = () => {},
  onEditFinished = () => {},
  onDeleteClicked = () => {},
  onDeleteTimedOut = () => {},
  onDeleteConfirmed = () => {},
  ...props
}) => {
  const [showControls, setShowControls] = useState(_showControls);

  useEffect(() => {
    if (showControls !== _showControls) setShowControls(_showControls);
  }, [showControls, _showControls]);

  const onShowControlsChanged = useCallback(_onShowControlsChanged, [
    _onShowControlsChanged,
  ]);

  useEffect(() => {
    onShowControlsChanged(showControls);
  }, [onShowControlsChanged, showControls]);

  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [detonateDeleteTimeout, setDetonateDeleteTimeout] = useState(null);

  const toggleControls = () => {
    if (showControls) {
      setIsEditing(false);
    }
    setShowControls(!showControls);
  };

  const onEditBtnClicked = (event) => {
    if (!onEditFinished) {
      //onEditFinished not passed, so handle only onEdit
      toggleControls();
      onEdit(event);
    } else {
      if (isEditing) {
        setIsEditing(false);
        onEditFinished(event);
        // i decided to put this call here so it is called only if onEditFinished execute WO errors!
        setShowControls(false);
      } else {
        setIsEditing(true);
        onEdit(event);
      }
    }
  };
  const onDeleteBtnClicked = (event) => {
    onDeleteClicked(event, deleteConfirmed);
    if (deleteConfirmed) {
      setDeleteConfirmed(false);
      clearTimeout(detonateDeleteTimeout);
      onDeleteConfirmed(event);
    } else {
      setDeleteConfirmed(true);
      if (confirmDeleteTimeout) {
        setDetonateDeleteTimeout(
          setTimeout(() => {
            setDeleteConfirmed(false);
            onDeleteTimedOut();
          }, confirmDeleteTimeout)
        );
      }
    }
  };
  return (
    <div style={{ overflow: 'hidden', display: 'flex' }}>
      {showExpander && (
        <CSSTransition
          in={!isEditing && !showControls}
          enter={true}
          timeout={{ enter: 300, exit: 10 }}
          classNames='menu-expander'
          unmountOnExit
        >
          <Button
            className='btn btn-sm btn-action'
            onClick={toggleControls}
            disabled={!available}
          >
            <InlineIcon icon={kebabHorizontal16} />
          </Button>
        </CSSTransition>
      )}
      <CSSTransition
        in={showControls}
        enter={true}
        timeout={{ enter: 300, exit: 100 }}
        classNames='menu-slide'
        unmountOnExit
      >
        <div>
          {!isEditing ? (
            <Button className='btn btn-sm btn-action' onClick={toggleControls}>
              <InlineIcon icon={chevronRight16} />
            </Button>
          ) : null}
          <Button
            className='btn btn-sm btn-action'
            onClick={onEditBtnClicked}
            disabled={!available}
          >
            <InlineIcon icon={isEditing ? check16 : pencil16} />
          </Button>
          <Button
            className={
              'btn btn-sm btn-action ' + (deleteConfirmed ? 'btn-danger' : '')
            }
            onClick={onDeleteBtnClicked}
            disabled={!available}
          >
            <InlineIcon icon={trashcan16} />
          </Button>
        </div>
      </CSSTransition>
    </div>
  );
};
export default FunctionalitiesMenu;
