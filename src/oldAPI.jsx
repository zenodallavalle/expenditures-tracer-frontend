// //import { getByDisplayValue } from '@testing-library/react';
// const getBase = () => {
//   const u = new URL(document.location.href);
//   return u.origin;
// };
// export function APILogin(
//   username,
//   password,
//   onSuccess = () => {},
//   onError = () => {}
// ) {
//   const data = { username: username, password: password };
//   const url = new URL(
//     process.env.REACT_APP_API_ROOT + 'api-token-auth/',
//     getBase()
//   );
//   fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         if ('token' in data) {
//           //logged in
//           onSuccess(data);
//         } else {
//           //wrong credentials
//           onError(data);
//         }
//       },
//       (error) => {
//         onError(error);
//       }
//     );
// }

// export function APILogout() {}

// export function APIGetUser(
//   authToken,
//   userId,
//   workingMonth,
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   const url = new URL(
//     process.env.REACT_APP_API_ROOT + 'users/' + userId + '/',
//     getBase()
//   );
//   url.searchParams.append('month', workingMonth);
//   fetch(url, {
//     method: 'GET',
//     headers: {
//       Authorization: 'Token ' + authToken,
//     },
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         if ('id' in data) {
//           onSuccess(data);
//         } else {
//           onError(data);
//         }
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APIGetDB(
//   authToken,
//   id,
//   workingMonth,
//   additionalParameters = {},
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   const url = new URL(
//     process.env.REACT_APP_API_ROOT + 'dbs/' + id + '/',
//     getBase()
//   );
//   url.searchParams.append('month', workingMonth);
//   Object.keys((additionalParameters = {})).forEach((key) => {
//     url.searchParams.append(key, additionalParameters[key]);
//   });
//   fetch(url, {
//     method: 'GET',
//     headers: {
//       Authorization: 'Token ' + authToken,
//     },
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         if ('id' in data) {
//           //workingDB is set
//           onSuccess(data);
//         } else {
//           onError(data);
//         }
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APIAddDB(
//   authToken,
//   db,
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   const url = new Date(process.env.REACT_APP_API_ROOT + 'dbs/', getBase());
//   fetch(url, {
//     method: 'POST',
//     headers: {
//       Authorization: 'Token ' + authToken,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(db),
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         if ('id' in data) {
//           onSuccess(data);
//         } else {
//           onError(data);
//         }
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APIEditDB(
//   authToken,
//   db,
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   const url = new URL(
//     process.env.REACT_APP_API_ROOT + 'dbs/' + db.id + '/',
//     getBase()
//   );
//   fetch(url, {
//     method: 'PUT',
//     headers: {
//       Authorization: 'Token ' + authToken,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(db),
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         if ('id' in data) {
//           onSuccess(data);
//         } else {
//           onError(data);
//         }
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APIDeleteDB(
//   authToken,
//   db,
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   const url = new URL(
//     process.env.REACT_APP_API_ROOT + 'dbs/' + db.id + '/',
//     getBase()
//   );
//   fetch(url, {
//     method: 'DELETE',
//     headers: {
//       Authorization: 'Token ' + authToken,
//       'Content-Type': 'application/json',
//     },
//   })
//     .then(
//       () => {
//         if (db.id === parseInt(localStorage.getItem('workingDBId'))) {
//           localStorage.removeItem('workingDBId');
//         }
//         onSuccess();
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APIAddCategory(
//   authToken,
//   category,
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   const url = new URL(
//     process.env.REACT_APP_API_ROOT + 'categories/',
//     getBase()
//   );
//   fetch(url, {
//     method: 'POST',
//     headers: {
//       Authorization: 'Token ' + authToken,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(category),
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         if ('id' in data) {
//           onSuccess(data);
//         } else {
//           onError(data);
//         }
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(onCallEnded());
// }
// export function APIEditCategory(
//   authToken,
//   category,
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   const url = new URL(
//     process.env.REACT_APP_API_ROOT + 'categories/' + category.id + '/',
//     getBase()
//   );
//   fetch(url, {
//     method: 'PUT',
//     headers: {
//       Authorization: 'Token ' + authToken,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(category),
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         if ('id' in data) {
//           onSuccess(data);
//         } else {
//           onError(data);
//         }
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APIDeleteCategory(
//   authToken,
//   category,
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   const url = new URL(
//     process.env.REACT_APP_API_ROOT + 'categories/' + category.id + '/',
//     getBase()
//   );
//   fetch(url, {
//     method: 'DELETE',
//     headers: {
//       Authorization: 'Token ' + authToken,
//       'Content-Type': 'application/json',
//     },
//   })
//     .then(
//       () => {
//         onSuccess();
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APIGetExpenditures(
//   authToken,
//   db_id,
//   workingMonth,
//   additionalParameters = {},
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   var url = new URL(
//     process.env.REACT_APP_API_ROOT + 'expenditures/',
//     getBase()
//   );
//   const params = {
//     db__id: db_id,
//     month: workingMonth,
//   };
//   Object.keys(params).forEach((key) =>
//     url.searchParams.append(key, params[key])
//   );
//   Object.keys(additionalParameters).forEach((key) =>
//     url.searchParams.append(key, additionalParameters[key])
//   );
//   fetch(url, {
//     method: 'GET',
//     headers: {
//       Authorization: 'Token ' + authToken,
//     },
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         onSuccess(data);
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APIAddExpenditure(
//   authToken,
//   expenditure,
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   const url = new URL(
//     process.env.REACT_APP_API_ROOT + 'expenditures/',
//     getBase()
//   );
//   fetch(url, {
//     method: 'POST',
//     headers: {
//       Authorization: 'Token ' + authToken,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(expenditure),
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         if ('id' in data) {
//           onSuccess(data);
//         } else {
//           onError(data);
//         }
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APICopyPrecMonthExp(
//   authToken,
//   db_id,
//   workingMonth,
//   additionalParameters = {},
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   var url = new URL(
//     process.env.REACT_APP_API_ROOT + 'copy-expenditures-from-precedent-month/',
//     getBase()
//   );
//   const params = {
//     db__id: db_id,
//     month: workingMonth,
//   };
//   Object.keys(params).forEach((key) =>
//     url.searchParams.append(key, params[key])
//   );
//   Object.keys(additionalParameters).forEach((key) =>
//     url.searchParams.append(key, additionalParameters[key])
//   );
//   fetch(url, {
//     method: 'GET',
//     headers: {
//       Authorization: 'Token ' + authToken,
//     },
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         onSuccess(data);
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APIEditExpenditure(
//   authToken,
//   expenditure,
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   const url = new URL(
//     process.env.REACT_APP_API_ROOT + 'expenditures/' + expenditure.id + '/',
//     getBase()
//   );
//   fetch(url, {
//     method: 'PUT',
//     headers: {
//       Authorization: 'Token ' + authToken,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(expenditure),
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         if ('id' in data) {
//           onSuccess(data);
//         } else {
//           onError(data);
//         }
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }
// export function APIDeleteExpenditure(
//   authToken,
//   expenditure,
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   const url = new URL(
//     process.env.REACT_APP_API_ROOT + 'expenditures/' + expenditure.id + '/',
//     getBase()
//   );
//   fetch(url, {
//     method: 'DELETE',
//     headers: {
//       Authorization: 'Token ' + authToken,
//       'Content-Type': 'application/json',
//     },
//   })
//     .then(
//       () => {
//         onSuccess();
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APIGetCashes(
//   authToken,
//   db_id,
//   workingMonth,
//   additionalParameters = {},
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   var url = new URL(process.env.REACT_APP_API_ROOT + 'cash/', getBase());
//   const params = {
//     db__id: db_id,
//     month: workingMonth,
//   };
//   Object.keys(params).forEach((key) =>
//     url.searchParams.append(key, params[key])
//   );
//   Object.keys(additionalParameters).forEach((key) =>
//     url.searchParams.append(key, additionalParameters[key])
//   );
//   fetch(url, {
//     method: 'GET',
//     headers: {
//       Authorization: 'Token ' + authToken,
//     },
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         onSuccess(data);
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APIAddCash(
//   authToken,
//   cash,
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   var url = new URL(process.env.REACT_APP_API_ROOT + 'cash/', getBase());
//   fetch(url, {
//     method: 'POST',
//     headers: {
//       Authorization: 'Token ' + authToken,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(cash),
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         if ('id' in data) {
//           onSuccess(data);
//         } else {
//           onError(data);
//         }
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APIEditCash(
//   authToken,
//   cash,
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   const url = new URL(
//     process.env.REACT_APP_API_ROOT + 'cash/' + cash.id + '/',
//     getBase()
//   );
//   fetch(url, {
//     method: 'PUT',
//     headers: {
//       Authorization: 'Token ' + authToken,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(cash),
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         if ('id' in data) {
//           onSuccess(data);
//         } else {
//           onError(data);
//         }
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APIDeleteCash(
//   authToken,
//   cash,
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   const url = new URL(
//     process.env.REACT_APP_API_ROOT + 'cash/' + cash.id + '/',
//     getBase()
//   );
//   fetch(url, {
//     method: 'DELETE',
//     headers: {
//       Authorization: 'Token ' + authToken,
//       'Content-Type': 'application/json',
//     },
//   })
//     .then(
//       () => {
//         onSuccess();
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }

// export function APIGetMonths(
//   authToken,
//   db_id,
//   onSuccess = () => {},
//   onError = () => {},
//   onCallEnded = () => {}
// ) {
//   const url = new URL(process.env.REACT_APP_API_ROOT + 'months/', getBase());
//   const params = {
//     db__id: db_id,
//   };
//   Object.keys(params).forEach((key) =>
//     url.searchParams.append(key, params[key])
//   );
//   fetch(url, {
//     method: 'GET',
//     headers: {
//       Authorization: 'Token ' + authToken,
//     },
//   })
//     .then((response) => response.json())
//     .then(
//       (data) => {
//         onSuccess(data);
//       },
//       (error) => {
//         onError(error);
//       }
//     )
//     .then(() => {
//       onCallEnded();
//     });
// }
