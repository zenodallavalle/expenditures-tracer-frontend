import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Container from 'react-bootstrap/Container';

import { useAutomaticUserTokenAuthQuery } from '/src/api/userApiSlice';
import { Alerts } from '/src/components/Alerts';
import { HeaderBar } from '/src/components/HeaderBar';
import { BottomBar } from '/src/components/BottomBar';
import { MainView } from '/src/components/MainView';
import { AddExpenditure } from '/src/components/Expenditure';
import { changedPanel, selectAuthToken } from '/src/rdx/params';
import { useSaveParamsInURL } from '/src/rdx/useSaveParamsInURL';

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

  const onExited = () => setAddExpenditureOffcanvasCounter((x) => x + 1);

  useEffect(() => {
    if (!authToken || isError) dispatch(changedPanel('user'));
  }, [dispatch, isError, authToken]);

  return (
    <div>
      <HeaderBar onAdd={onAdd} />
      <Alerts />
      <div className="py-1">
        <div className="safe-down">
          <Container fluid>
            <div className="mx-auto">
              <MainView />
            </div>
          </Container>
        </div>
      </div>
      <AddExpenditure
        key={`add_expenditure_offcanvas_${addEditExpenditureOffcanvasCounter}`}
        show={showAddExpenditureOffcanvas}
        onHide={onCancel}
        onExited={onExited}
      />
      <BottomBar />
    </div>
  );
};

export default App;
