import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Container from 'react-bootstrap/Container';

import { useAutomaticUserTokenAuthQuery } from 'api/userApiSlice';
import { Alerts } from 'components/Alerts';
import { HeaderBar } from 'components/HeaderBar';
import { BottomBar } from 'components/BottomBar';
import { MainView } from 'components/MainView';
import { AddExpenditure } from 'components/Expenditure';
import { changedPanel, selectAuthToken } from 'rdx/params';
import { useSaveParamsInURL } from 'rdx/useSaveParamsInURL';

const App = ({ ...props }) => {
  useSaveParamsInURL();

  const { isError } = useAutomaticUserTokenAuthQuery();

  const authToken = useSelector(selectAuthToken);

  const dispatch = useDispatch();

  const [showAddExpenditureOffcanvas, setShowAddExpenditureOffcanvas] =
    useState(false);
  const [
    addEditExpenditureOffcanvasCounter,
    setAddExpenditureOffcanvasCounter,
  ] = useState(1);

  const onAdd = () => setShowAddExpenditureOffcanvas(true);

  const onCancel = () => setShowAddExpenditureOffcanvas(false);

  const onClear = () => setAddExpenditureOffcanvasCounter((x) => x + 1);

  useEffect(() => {
    if (!authToken || isError) dispatch(changedPanel('user'));
  }, [dispatch, isError, authToken]);

  return (
    <div>
      <HeaderBar onAdd={onAdd} />
      <Alerts />
      <div className='py-1'>
        <div className='safe-down'>
          <Container fluid>
            <div className='mx-auto'>
              <MainView />
            </div>
          </Container>
        </div>
      </div>
      <AddExpenditure
        key={`add_expenditure_offcanvas_${addEditExpenditureOffcanvasCounter}`}
        show={showAddExpenditureOffcanvas}
        clear={onClear}
        onHide={onCancel}
      />
      <BottomBar />
    </div>
  );
};

export default App;
