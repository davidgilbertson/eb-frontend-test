// a rudimentary xhr wrapper. In production would use isomorphic-fetch or similar
export function fetchJson(url, callback) {
  const xhrRequest = new XMLHttpRequest();

  xhrRequest.open('GET', url, true);

  xhrRequest.onreadystatechange = () => {
    if (xhrRequest.readyState !== 4 || xhrRequest.status !== 200) return;

    try {
      const json = JSON.parse(xhrRequest.responseText);
      callback(null, json);
    } catch (e) {
      callback(e);
    }
  };

  xhrRequest.send();
}

// use this to handle scenarios of unexpected data
// this should return something immediately usable in the component
export function getDescription(descriptions, index = 0) {
  let desc;

  if (!Array.isArray(descriptions) || !descriptions[index]) {
    desc = {};
  } else {
    desc = descriptions[index];
  }

  return {
    title: desc.title || '',
    thumbnail: desc.thumbnail || '',
    description: desc.description || '',
  };
}
