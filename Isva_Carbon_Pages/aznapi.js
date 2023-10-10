function postData(url = "", data = {}) {
      console.log(`Posting data to ${url}`);
      console.log('Posting :' + JSON.stringify(data));

      //const myRequest = new Request(url, {"method": "POST", "cache": "no-cache", 'body': JSON.stringify(data)});
      const myRequest = new Request(url, {"method": "POST", "mode": "cors", "cache": "no-cache", "body": JSON.stringify(data), "headers": {"Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br"}});

      fetch(myRequest)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
              //console.log("Response content " + response.text());
              return response.json().then(function (text) {
		            //throw json;
		            throw new Error(`HTTP error, status = ${response.status}, errorMessage = ${text}`);
              });
          }

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
const inputUserName = document.getElementById('user_name');
const inputObjectName = document.getElementById('object_name');
const btnExecute = document.getElementById('btn-execute');
const btnExecute = document.getElementById('btn-reset');
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
  notification.open = 'url' in errors || 'user_name' in errors || 'object_name' in errors;
  inputURL.invalid = 'url' in errors;
  inputURL.validityMessage = errors.url;
  inputUserName.invalid = 'user_name' in errors;
  inputUserName.validityMessage = errors.user_name;
  inputObjectName.invalid = 'object_name' in errors;
  inputObjectName.validityMessage = errors.object_name;

};

const execute = () => {
  const formElement = document.querySelector("form");
  const namedFormFields = formElement.querySelectorAll("*[name]");
  var dictV = {};
  var doPost = true;
  try {
      namedFormFields.forEach((field) => {
      let key = field.getAttribute('name');
      let value = field.value;
      if (key == 'user_attributes') {
        if (value === null || value == '') {
           console.log('Skipping empty '+key );
        } else {
          dictV[key] = JSON.parse(value);
        }
      } else if( value == null || value == ''){
         console.log('Skipping '+key );
      } else {
         //submittedFormValuesMap.set(key, value);
         dictV[key] = value;
         console.log(key, value);
      }
     });
     if (!dictV.url || dictV.url == '') {
            throw Object.assign(new Error('The url is a required parameter'), {
                errors: {
                    url: 'url is a required parameter',
        },
       });
     };
     if (!dictV.user_name || dictV.user_name == '') {
            throw Object.assign(new Error('Username is a required parameter'), {
                errors: {
                    user_name: 'Username is a required parameter',
        },
       });
     };
     if (!dictV.object_name || dictV.object_name == '') {
            throw Object.assign(new Error('object_name is a required parameter'), {
                errors: {
                    object_name: 'object_name is a required parameter',
        },
       });
     };


  } catch ({ errors }) {
    setValidity(errors);
    doPost = false;
  } finally {
    setSubmitting(false);
  }

  const url = dictV['url'];
  delete dictV.url; //prepare object so I can use it in the post.
  // Submits the form
  if (doPost) {
    postData(url,dictV);
  }


};

const reset = () => {
  notification.open = false;
  inputUsername.invalid = false;
  inputUsername.value = '';
  inputURL.invalid = false;
  inputURL.value = '';
  inputObjectName.invalid = false;
  inputObjectName.value = '';
  setPristine(true);
};

btnExecute.addEventListener('click', async () => {
  execute();
});

btnReset.addEventListener('click', () => {
  reset();
});