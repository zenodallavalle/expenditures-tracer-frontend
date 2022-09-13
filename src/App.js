import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import { databaseApi, userApi } from 'api';
import { getWorkingMonth } from 'utils';
import { userSelectors } from 'rdx/user';
import { databaseSelectors } from 'rdx/database';

import Alerts from 'components/alerts/';
import HeaderBar from 'components/headerBar';
import BottomBar from 'components/bottomBar';
import ExpenditureOffcanvas from 'components/expenditureEditor';
import MainView from 'components/mainView';
import { useUserTokenAuthQuery } from 'api/userApiSlice';
import { useAutomaticGetDBQuery } from 'api/dbsApiSlice';
import { selectWorkingDBId } from 'rdx/params';

const App = (props) => {
  // const dispatch = useDispatch();
  // const params = useParams();
  // const navigate = useNavigate();
  // const isInitial = useSelector(userSelectors.isInitial());
  // const isAvailableForRequests = useSelector(
  //   userSelectors.isAvailableForRequests()
  // );
  // const workingDB = useSelector(databaseSelectors.getWorkingDB());
  // const workingDBWorkingMonth = useSelector(
  //   databaseSelectors.getWorkingMonth()
  // );

  const [showAddExpenditureOffcanvas, setShowAddExpenditureOffcanvas] =
    useState(false);
  const [
    addEditExpenditureOffcanvasCounter,
    setAddExpenditureOffcanvasCounter,
  ] = useState(1);

  // const fetch = useCallback(
  //   async (dbId = workingDB.id) => {
  //     dispatch({ type: 'database/isLoading' });
  //     dispatch({ type: 'expenditures/isLoading' });
  //     try {
  //       const fullDB = await databaseApi.setWorkingDB({
  //         id: dbId,
  //       });
  //       dispatch({ type: 'expenditures/dataRetrieved', payload: fullDB });
  //       dispatch({ type: 'database/dataRetrieved', payload: fullDB });
  //       return fullDB;
  //     } catch (e) {
  //       // handle error e. Is an object that can be the json received from server or an object containing
  //       // {detail:'Service unreachable'}
  //     }
  //   },
  //   [dispatch, workingDB]
  // );

  // useEffect(() => {
  //   const workingMonth = getWorkingMonth();
  //   if (workingDBWorkingMonth && workingMonth !== workingDBWorkingMonth) {
  //     fetch();
  //   }
  // }, [workingDBWorkingMonth, fetch, params]);

  // const dbId = useSelector(selectWorkingDBId);

  const {
    data: user,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useUserTokenAuthQuery();
  const { data: fullDB, isFetching: isFetchingDB } = useAutomaticGetDBQuery(
    {},
    { skip: !isSuccess }
  );

  // console.log(user, fullDB);

  // const initialize = useCallback(async () => {
  //   const workingDBId = localStorage.getItem('workingDBId');
  //   const { payload: user } = await dispatch(userApi.tryAuthToken());
  //   user?.id &&
  //     dispatch({
  //       type: 'users/currentUser',
  //       payload: { id: user.id, username: user.username, isCurrentUser: true },
  //     });
  //   let dbId = null;
  //   if (user) {
  //     if (user.dbs.length === 1) {
  //       dbId = user.dbs[0].id;
  //     } else if (workingDBId) {
  //       dbId = workingDBId;
  //     } else if (workingDB) {
  //       dbId = workingDB.id;
  //     }
  //     if (dbId) {
  //       const fullDB = await fetch(dbId);
  //       if (fullDB) {
  //         localStorage.setItem('workingDBId', fullDB.id);
  //         const urlSearchParams = new URLSearchParams(window.location.search);
  //         urlSearchParams.delete('month');
  //         urlSearchParams.set('panel', 'prospect');
  //         navigate(`/?${urlSearchParams.toString()}`);
  //         return;
  //       }
  //     }
  //   }
  //   const urlSearchParams = new URLSearchParams(window.location.search);
  //   urlSearchParams.delete('month');
  //   urlSearchParams.set('panel', 'user');
  //   navigate(`/?${urlSearchParams.toString()}`);
  // }, [fetch, dispatch, workingDB, navigate]);

  // useEffect(() => {
  //   if (isInitial && isAvailableForRequests) {
  //     initialize();
  //   }
  // }, [isInitial, isAvailableForRequests, initialize]);

  return (
    <div>
      <HeaderBar
        // fetch={fetch}
        onAdd={() => setShowAddExpenditureOffcanvas(true)}
      />
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
      <ExpenditureOffcanvas
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
