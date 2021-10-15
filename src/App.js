import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import { databaseApi, userApi } from 'api';
import { userSelectors } from 'rdx/user';
import { localInfoSelectors } from 'rdx/localInfo';
import { databaseSelectors } from 'rdx/database';

import Alerts from 'components/alerts/';
import HeaderBar from 'components/headerBar';
import BottomBar from 'components/bottomBar';
import ExpenditureOffcanvas from 'components/expenditureEditor';
import MainView from 'components/mainView';

const App = (props) => {
  const dispatch = useDispatch();
  const isInitial = useSelector(userSelectors.isInitial());
  const isAvailableForRequests = useSelector(
    userSelectors.isAvailableForRequests()
  );
  const workingDB = useSelector(databaseSelectors.getWorkingDB());
  const workingDBWorkingMonth = useSelector(
    databaseSelectors.getWorkingMonth()
  );
  const workingMonth = useSelector(localInfoSelectors.getWorkingMonth());

  const [showAddExpenditureOffcanvas, setShowAddExpenditureOffcanvas] =
    useState(false);
  const [
    addEditExpenditureOffcanvasCounter,
    setAddExpenditureOffcanvasCounter,
  ] = useState(1);

  const fetch = useCallback(
    async (dbId = workingDB.id) => {
      dispatch({ type: 'database/isLoading' });
      dispatch({ type: 'expenditures/isLoading' });
      try {
        const fullDB = await databaseApi.setWorkingDB({
          id: dbId,
        });
        dispatch({ type: 'expenditures/dataRetrieved', payload: fullDB });
        dispatch({ type: 'database/dataRetrieved', payload: fullDB });
        return fullDB;
      } catch (e) {
        // handle error e. Is an object that can be the json received from server or an object containing
        // {detail:'Service unreachable'}
      }
    },
    [dispatch, workingDB]
  );

  useEffect(() => {
    if (
      workingMonth &&
      workingDBWorkingMonth &&
      workingMonth !== workingDBWorkingMonth
    ) {
      fetch();
    }
  }, [workingMonth, workingDBWorkingMonth, fetch]);

  const initialize = useCallback(async () => {
    const workingDBId = localStorage.getItem('workingDBId');
    const { payload: user } = await dispatch(userApi.tryAuthToken());
    let dbId = null;
    if (user) {
      if (user.dbs.length === 1) {
        dbId = user.dbs[0].id;
      } else if (workingDBId) {
        dbId = workingDBId;
      } else if (workingDB) {
        dbId = workingDB.id;
      }
      if (dbId) {
        const fullDB = await fetch(dbId);
        if (fullDB) {
          localStorage.setItem('workingDBId', fullDB.id);
          dispatch({ type: 'localInfo/panelChanged', payload: 'prospect' });
          return;
        }
      }
    }
    dispatch({ type: 'localInfo/panelChanged', payload: 'user' });
  }, [fetch, dispatch, workingDB]);

  useEffect(() => {
    if (isInitial && isAvailableForRequests) {
      initialize();
    }
  }, [isInitial, isAvailableForRequests, initialize]);

  return (
    <Router>
      <Route path='/:panel?/'>
        <div className='py-1'>
          <HeaderBar
            fetch={fetch}
            onAdd={() => setShowAddExpenditureOffcanvas(true)}
          />
          <Alerts />

          <div className='safe-down'>
            <Container fluid>
              <div style={{ maxWidth: 720 }} className='mx-auto'>
                <MainView />
              </div>
            </Container>
          </div>

          <ExpenditureOffcanvas
            key={`add_expenditure_offcanvas_${addEditExpenditureOffcanvasCounter}`}
            show={showAddExpenditureOffcanvas}
            clear={() => setAddExpenditureOffcanvasCounter((x) => x + 1)}
            onHide={() => setShowAddExpenditureOffcanvas(false)}
          />

          <BottomBar />
        </div>
      </Route>
    </Router>
  );
};

export default App;
