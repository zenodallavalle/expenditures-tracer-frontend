import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Offcanvas from "react-bootstrap/Offcanvas";

import { expenditureApi } from "api";
import { LoadingImg, dateToLocaleISOString, AutoBlurButton } from "utils";
import { expendituresSelectors } from "rdx/expenditures";
import { databaseSelectors } from "rdx/database";
import { Form, FormControl } from "react-bootstrap";

const toPKRelated = (v) => {
  const int = parseInt(v.trim());
  if (!isNaN(int)) {
    return int || null;
  }
  return undefined;
};

const toFloat = (v) => {
  const float = parseFloat(v.trim().replace(",", "."));
  if (!isNaN(float)) {
    return float;
  }
  return undefined;
};

const getUpdatedValue = (e) => {
  switch (e.target.name) {
    case "value":
      return e.target.value === "" ? "" : toFloat(e.target.value);
    case "category":
      return toPKRelated(e.target.value);
    case "expected_expenditure":
      return toPKRelated(e.target.value);
    default:
      return e.target.value;
  }
};

const ExpenditureOffcanvas = ({
  show = false,
  onHide = () => {},
  clear = () => {},
  id,
  expected: passedExpected = false,

  ...props
}) => {
  const emptyExpenditure = {
    name: "",
    value: "",
    date: new Date(),
    category: null,
    expected_expenditure: null,
    is_expected: passedExpected,
  };

  const dispatch = useDispatch();

  const expendituresAreLoading = useSelector(expendituresSelectors.isLoading());
  const databaseIsLoading = useSelector(databaseSelectors.isLoading());
  const isLoading = databaseIsLoading || expendituresAreLoading;

  const workingDB = useSelector(databaseSelectors.getWorkingDB());

  const categories = useSelector(databaseSelectors.getCategories());
  const expenditure = useSelector(expendituresSelectors.getById(id));
  const expectedExpenditures = useSelector(expendituresSelectors.getAll(true));

  const [instance, setInstance] = useState(id ? {} : emptyExpenditure);
  const [messages, setMessages] = useState({});

  const refName = useRef();
  const refValue = useRef();
  const refDate = useRef();
  const refCategory = useRef();
  const refExpected = useRef();

  const isExpected = id ? !expenditure?.is_expected : !instance.is_expected;

  useEffect(() => {
    if (id && expenditure) {
      setInstance({});
    }
  }, [id, expenditure]);

  const onChange = (e) => {
    const updatedValue = getUpdatedValue(e);
    if (updatedValue !== undefined) {
      if (id) {
        if (expenditure[e.target.name] !== updatedValue) {
          if (e.target.name === "expected_expenditure") {
            setInstance((i) => ({
              ...i,
              [e.target.name]: updatedValue,
              category: expectedExpenditures.find((e) => e.id === updatedValue)
                ?.category,
            }));
          } else {
            setInstance((i) => ({ ...i, [e.target.name]: updatedValue }));
          }
        } else {
          const updatedInstance = { ...instance };
          delete updatedInstance[e.target.name];
          setInstance(updatedInstance);
        }
      } else {
        if (e.target.name === "expected_expenditure") {
          setInstance((instance) => ({
            ...instance,
            [e.target.name]: updatedValue,
            category: expectedExpenditures.find((e) => e.id === updatedValue)
              ?.category,
          }));
        } else {
          setInstance((instance) => ({
            ...instance,
            [e.target.name]: updatedValue,
          }));
        }
      }
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      switch (e.target.name) {
        case "name":
          return refValue.current?.focus();
        case "value":
          return refDate.current?.focus();
        case "date":
          return refCategory.current?.focus();
        case "category":
          return isExpected ? refExpected.current?.focus() : onSave();
        case "expected_expenditure":
          return onSave();
        default:
          return;
      }
    }
    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();
      switch (e.target.name) {
        case "name":
          return refValue.current?.focus();
        case "value":
          return refDate.current?.focus();
        case "date":
          return refCategory.current?.focus();
        case "category":
          return isExpected
            ? refExpected.current?.focus()
            : refName.current?.focus();
        case "expected_expenditure":
          return refName.current?.focus();
        default:
          return;
      }
    }
  };

  const onSave = async () => {
    if (id) {
      let isValid = true;
      const msgs = {};
      Object.entries(instance).forEach(([k, v]) => {
        if (!v) {
          if (["category", "name", "value"].includes(k)) {
            isValid = false;
            msgs[k] = ["This field is required"];
          }
        }
      });
      setMessages(msgs);
      if (isValid) {
        dispatch({ type: "expenditures/isLoading" });
        try {
          const fullDB = await expenditureApi.editExpenditure({
            id,
            payload: instance,
          });
          dispatch({ type: "database/dataUpdated", payload: fullDB });
          dispatch({ type: "expenditures/dataUpdated", payload: fullDB });
          onHide();
          clear();
        } catch (e) {
          if (e.json.non_field_errors) {
            dispatch({
              type: "alerts/added",
              payload: e.json.non_field_errors.join(", "),
            });
          } else {
            setMessages(e.json);
          }
          dispatch({ type: "expenditures/loaded" });
        }
      }
    } else {
      setMessages({
        name:
          !instance.name || !instance.name.trim()
            ? ["This field is required"]
            : [],
        value: !instance.value ? ["This field should be float"] : [],
        category: !instance.category ? ["This field is required"] : [],
      });
      if (!instance.name || !instance.value || !instance.category) {
        // not ok
      } else {
        const payload = {
          ...instance,
          db: workingDB.id,
        };
        if (instance.is_expected) {
          delete payload["expected_expenditure"];
        }
        dispatch({ type: "expenditures/isLoading" });
        try {
          const fullDB = await expenditureApi.createExpenditure({
            payload,
          });
          dispatch({ type: "database/dataUpdated", payload: fullDB });
          dispatch({ type: "expenditures/dataUpdated", payload: fullDB });
          onHide();
          clear();
        } catch (e) {
          if (e.json.non_field_errors) {
            dispatch({
              type: "alerts/added",
              payload: e.json.non_field_errors.join(", "),
            });
          } else {
            setMessages(e.json);
          }
          dispatch({ type: "expenditures/loaded" });
        }
      }
    }
  };

  const getTitle = () => {
    if (!id) {
      if (instance.is_expected) {
        return "Add new expected expenditure";
      } else {
        return "Add new actual expenditure";
      }
    } else {
      if (expenditure.is_expected) {
        return "Edit expected expenditure";
      } else {
        return "Edit actual expenditure";
      }
    }
  };

  useEffect(() => {
    if (show) {
      refName.current?.focus();
    }
  }, [show]);

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      style={{ width: "100%", maxWidth: 500 }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{getTitle()}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div>
          <div className="d-flex align-items-baseline py-2">
            <div className="pe-2">Description</div>
            <div className="flex-grow-1">
              <FormControl
                name="name"
                value={
                  instance.name !== undefined
                    ? instance.name
                    : expenditure?.name || ""
                }
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={refName}
                disabled={isLoading}
              />
            </div>
          </div>
          {messages.name?.map((m, idx) => (
            <div
              key={`msg_expenditure_name_val_${idx}`}
              className="text-danger"
            >
              {m}
            </div>
          ))}

          <div className="d-flex align-items-baseline py-2">
            <div className="pe-2">Value</div>
            <div className="flex-grow-1">
              <FormControl
                name="value"
                value={
                  instance.value !== undefined
                    ? instance.value
                    : expenditure?.value || ""
                }
                placeholder="€"
                type="number"
                step={0.01}
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={refValue}
                disabled={isLoading}
              />
            </div>
          </div>
          {messages.value?.map((m, idx) => (
            <div
              key={`msg_expenditure_name_val_${idx}`}
              className="text-danger"
            >
              {m}
            </div>
          ))}

          {!id && (
            <div className="py-2">
              <AutoBlurButton
                className="w-100"
                onClick={() => {
                  setInstance((i) => ({
                    ...i,
                    is_expected: !i.is_expected,
                  }));
                }}
              >{`Switch to ${
                instance.is_expected ? "actual" : "expected"
              }`}</AutoBlurButton>
            </div>
          )}

          <div className="d-flex align-items-baseline py-2">
            <div className="pe-2">Date</div>
            <div className="flex-grow-1">
              <FormControl
                name="date"
                type="datetime-local"
                value={dateToLocaleISOString(
                  new Date(
                    instance.date !== undefined
                      ? instance.date
                      : expenditure?.date
                  )
                )}
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={refDate}
                disabled={isLoading}
              />
            </div>
          </div>
          {messages.date?.map((m, idx) => (
            <div
              key={`msg_expenditure_name_val_${idx}`}
              className="text-danger"
            >
              {m}
            </div>
          ))}

          <div className="d-flex align-items-baseline py-2">
            <div className="pe-2">Category</div>
            <div className="flex-grow-1">
              {databaseIsLoading ? (
                <FormControl value="Loading..." readOnly />
              ) : (
                <Form.Select
                  name="category"
                  value={
                    instance.category !== undefined
                      ? instance.category || 0
                      : expenditure?.category || 0
                  }
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  ref={refCategory}
                  disabled={isLoading}
                >
                  <option key={"categorydefault0"} value={0}>
                    -----
                  </option>
                  {categories?.map((c) => (
                    <option
                      key={`category_add_edit_modal_${c.id}`}
                      value={c.id}
                    >
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              )}
            </div>
          </div>
          {messages.category?.map((m, idx) => (
            <div
              key={`msg_expenditure_name_val_${idx}`}
              className="text-danger"
            >
              {m}
            </div>
          ))}

          {isExpected && (
            <div>
              <div className="d-flex align-items-baseline py-2">
                <div className="pe-2">Expected expenditure</div>
                <div className="flex-grow-1">
                  {expendituresAreLoading ? (
                    <FormControl value="Loading..." readOnly />
                  ) : (
                    <Form.Select
                      name="expected_expenditure"
                      value={
                        instance.expected_expenditure !== undefined
                          ? instance.expected_expenditure || 0
                          : expenditure?.expected_expenditure || 0
                      }
                      onChange={onChange}
                      onKeyDown={onKeyDown}
                      ref={refExpected}
                      disabled={isLoading}
                    >
                      <option key={"expected_expenditure_default0"} value={0}>
                        -----
                      </option>
                      {expectedExpenditures?.map((e) => (
                        <option
                          key={`expected_expenditure_add_edit_modal_${e.id}`}
                          value={e.id}
                        >
                          {e.value.toString() + "€, " + e.name}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </div>
              </div>
              {messages.expected_expenditure?.map((m, idx) => (
                <div
                  key={`msg_expenditure_name_val_${idx}`}
                  className="text-danger"
                >
                  {m}
                </div>
              ))}
            </div>
          )}

          <div className="ps-1 flex-grow-1 pt-4">
            <AutoBlurButton
              variant="success"
              className="w-100"
              onClick={onSave}
              disabled={isLoading}
            >
              {isLoading ? <LoadingImg maxWidth={25} /> : "Save"}
            </AutoBlurButton>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ExpenditureOffcanvas;
