export function getFromLocalStorage(key) {
  return localStorage.getItem(key);
}

export function setItemToLocalStorage(key, val) {
  localStorage.setItem(key, val);
}

export function saveStateToLocalStorage(obj) {
  const newState = Object.assign({}, obj);
  const prefixedObj = Object.keys(newState).reduce((acc, key) => {
    const val = newState[key];
    return {
      ...acc,
      [`paranja:${key}`]: val,
    };
  }, {});

  Object.keys(prefixedObj).forEach((key) => {
    const val = prefixedObj[key];
    setItemToLocalStorage(key, val);
  });
}

function isEmpty(val) {
  return val == null || val === '';
}

export function clearObject(obj) { // remove props with null, undefined, empty string values
  return Object.keys(obj).reduce((acc, key) => {
    const val = obj[key];
    return isEmpty(val)
      ? acc
      : {
        ...acc,
        [key]: val,
      };
  }, {});
}

export function restoreState() {
  const saved = {
    opacity: getFromLocalStorage('paranja:opacity'),
    top: getFromLocalStorage('paranja:top'),
    left: getFromLocalStorage('paranja:left'),
    currentImageSrc: getFromLocalStorage('paranja:currentImageSrc'),
    currentImageName: getFromLocalStorage('paranja:currentImageName'),
    color: getFromLocalStorage('paranja:color'),
    positionSwitch: getFromLocalStorage('paranja:positionSwitch'),
  };

  return clearObject(saved);
}

export function clearLocalStorage() {
  Object.keys(localStorage)
    .filter(key => key.includes('paranja:'))
    .forEach(key => setItemToLocalStorage(key, ''));
}

export function debounce(func, wait, immediate) {
  let timeout;
  return (...args) => {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}
