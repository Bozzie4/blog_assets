// Example POST method implementation:
/*
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br"
    },
    redirect: "error", // manual, *follow, error
    body: JSON.stringify(data)
  });
  return response;
}
*/
/*
postData("/aznapi", {
  "user_name": "user1",
  "permission_bits": "Tr",
  "object_name": "/WebSEAL/cloudinit.verifyaccess.local-default/aznapi"}).then((data) => {
    console.log(data);
 });
*/
function postData(url = "", data = {}) {
      console.log(`Posting data to ${url}`);
      console.log('Posting :' + JSON.stringify(data));
      //const myRequest = new Request(url, {"method": "POST", "cache": "no-cache", 'body': JSON.stringify(data)});
      const myRequest = new Request(url, {"method": "POST", "mode": "cors", "cache": "no-cache", "body": data, "headers": {"Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br"}});

      fetch(myRequest)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error, status = ${response.status}`);
          }
          return response.json();
        })
        .then((text) => {
          renderResult(text);
        })
        .catch((error) => {
           console.log(`Error: ${error.message}`);
          _result.innerHTML = `Error: ${error.message}`;
        });
    }

function renderResult(inputJSON) {
    /*
    const table = document.createElement("table");
    // Create table header row using the extracted headers above.
    let tr = table.insertRow(-1);                   // table row.

    for (const [key, value] of Object.entries(inputJSON)) {
        console.log(`${key}: ${value}`);
        let tr = table.insertRow(-1);
        let cell1 = tr.insertCell(-1);
        cell1.innerHTML = key;
        let cell2 = tr.insertCell(-1);
        cell2.innerHTML = value;
    }
    _result.appendChild(table);
    */
    let table = "<bx-table><bx-table-body>"

    for (const [key, value] of Object.entries(inputJSON)) {
        console.log(`Building table ${key}: ${value}`);
        let _value = '';
        if (value === null) {
          _value = '';
        } else if (typeof value === 'object' && Array.isArray(value)) {
          _value = value.join('<br>');
        } else {
          _value = JSON.stringify(value);
        }
        table += "<bx-table-row>";
        table += `<bx-table-cell>${key}</bx-table-cell>`;
        table += `<bx-table-cell>${_value}</bx-table-cell>`;
        table += "</bx-table-row>";
    }
    table += "</bx-table-body></bx-table>";
    _result.innerHTML = table;
}


const notification = document.getElementById('notification');
const form = document.getElementById('form-execute');
const inputURL = document.getElementById('url');
const btnExecute = document.getElementById('btn-execute');
const _result = document.getElementById('result');

let pristine;

notification.open = false;

const setPristine = (value) => {
  pristine = value;
};

const setSubmitting = (value) => {
  inputURL.disabled = value;
  btnExecute.disabled = value;
};

const setValidity = (errors = {}) => {
  notification.open = 'url' in errors || 'password' in errors;
};

const execute = () => {
  const formElement = document.querySelector("form");
  const namedFormFields = formElement.querySelectorAll("*[name]");
  var dictV = {};
  namedFormFields.forEach((field) => {
      let key = field.getAttribute('name');
      let value = field.value;
      if(value==null){
         console.log('Skipping '+key );
      } else {
         //submittedFormValuesMap.set(key, value);
         dictV[key] = value;
         console.log(key, value);
      }
     });

  // Submits the form
  setSubmitting(true);
  postData(dictV['url'],dictV['data']);
  /*
  try {
    postData(dictV['url'],dictV['data']);
    setValidity();
  } catch ({ errors }) {
    setValidity(errors);
  } finally {
    setSubmitting(false);
  }
  */
};

btnExecute.addEventListener('click', async () => {
  execute();
});

