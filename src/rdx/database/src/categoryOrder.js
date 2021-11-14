export const saveOrder = (newOrder) => {
  localStorage.setItem('categoriesViewOrder', JSON.stringify(newOrder));
};

export const getOrder = () => {
  const payload = localStorage.getItem('categoriesViewOrder');
  try {
    if (!payload) return null;
    else return JSON.parse(payload);
  } catch (e) {
    return null;
  }
};

export const mergeOrder = (truth) => {
  const order = getOrder();

  if (!order) {
    return truth;
  }

  let result = [];
  const truthSet = new Set(truth);

  order.forEach((id) => {
    if (truthSet.has(id)) {
      result.push(id);
      truthSet.delete(id);
    } else {
      // dump
    }
  });

  truth.forEach((id) => {
    if (truthSet.has(id)) {
      result.push(id);
    } else {
      // nothing, was pushed previously
    }
  });

  return result;
};

export const insertAt = (elements, element, index) => {
  return elements.splice(index, 0, element);
};
