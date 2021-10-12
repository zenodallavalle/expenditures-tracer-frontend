import { useCallback, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSSTransitionClasses.css';
import './App.css';
import Alerts from './components/alerts';
import UpperBar from './components/upperBar';
import BottomBar from './components/bottomBar';
import User from './components/user';
import Prospect from './components/mainViewComponents/prospect';
import CategoriesView from './components/mainViewComponents/expenditures';
import Months from './components/mainViewComponents/months';
import AddEditExpenditureOffcanvas from './components/addEditExpenditureOffcanvas';
import ActualMoneyOrIncomeOffcanvas from './components/actualMoneyOrIncomeOffcanvas';
import LoadingImg from 'components/LoadingImg';
import { useDispatch, useSelector } from 'react-redux';
import { userSelectors } from 'rdx/user';
import { databaseApi, userApi } from 'api';
import { localInfoActions, localInfoSelectors } from 'rdx/localInfo';
import { databaseSelectors } from 'rdx/database';

const getCurrentMonth = () => {
  const d = new Date();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const currentMonth = (month < 10 ? '0' + month : '' + month) + '-' + year;
  return currentMonth;
};

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

  const currentPanel = useSelector(localInfoSelectors.getCurrentPanel());

  const generateMainContent = () => {
    switch (currentPanel) {
      case 'user':
        return <User />;
      case 'prospect':
        return <Prospect />;
      case 'months':
        return <Months />;
      case 'actual_expenditures':
        return <CategoriesView />;
      case 'expected_expenditures':
        return <CategoriesView />;
      default:
        return (
          <div className='text-center'>
            <LoadingImg />
          </div>
        );
    }
  };

  const fetch = useCallback(
    async (dbId = workingDB.id) => {
      dispatch({ type: 'database/isLoading' });
      dispatch({ type: 'expenditures/isLoading' });
      try {
        const fullDB = await databaseApi.setWorkingDB({
          id: dbId,
          workingMonth,
        });
        dispatch({ type: 'expenditures/dataRetrieved', payload: fullDB });
        dispatch({ type: 'database/dataRetrieved', payload: fullDB });
        dispatch({
          type: 'localInfo/setWorkingMonth',
          payload: fullDB.months_list.find((m) => m.is_working)?.month,
        });
        return fullDB;
      } catch (e) {
        // handle error e. Is an object that can be the json received from server or an object containing
        // {detail:'Service unreachable'}
      }
    },
    [dispatch, workingDB, workingMonth]
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
          console.log(fullDB);
          localStorage.setItem('workingDBId', fullDB.id);
          dispatch({ type: 'localInfo/panelChanged', payload: 'prospect' });
        }
      }
    } else {
      dispatch({ type: 'localInfo/panelChanged', payload: 'user' });
    }
  }, [fetch, dispatch, workingDB]);

  useEffect(() => {
    if (isInitial && isAvailableForRequests) {
      initialize();
    }
  }, [isInitial, isAvailableForRequests, initialize]);

  return (
    <div>
      <UpperBar
        fetch={fetch}
        onAdd={() => setShowAddExpenditureOffcanvas(true)}
      />
      <Alerts />

      <div className='safe-down'>{generateMainContent()}</div>

      <AddEditExpenditureOffcanvas
        key={`add_expenditure_offcanvas_${addEditExpenditureOffcanvasCounter}`}
        show={showAddExpenditureOffcanvas}
        clear={() => setAddExpenditureOffcanvasCounter((x) => x + 1)}
        onHide={() => setShowAddExpenditureOffcanvas(false)}
      />

      <BottomBar />
    </div>
  );
};

export default App;
