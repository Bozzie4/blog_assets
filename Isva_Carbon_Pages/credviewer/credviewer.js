function getData(url = "") {
      console.log(`Getting data to ${url}`);
      //const myRequest = new Request(url, {"method": "POST", "cache": "no-cache", 'body': JSON.stringify(data)});
      const myRequest = new Request(url, {"method": "GET", "mode": "cors", "cache": "no-cache", "headers": {"Accept": "application/json"}});

      fetch(myRequest)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
              return response.text().then(function (text) {
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
    let table = "<bx-table>";
    table += "<bx-table-head>";
    table += "<bx-table-header-row>";
    table += "<bx-table-header-cell>Attribute name</bx-table-header-cell>";
    table += "<bx-table-header-cell>Attribute Value(s)</bx-table-header-cell>";
    table += "</bx-table-head>";
    table += "</bx-table-header-row>";
    table += "<bx-table-body>";
    for (const [key, value] of Object.entries(inputJSON)) {
        console.log(`Building table ${key}: ${value}`);
        let _value = '';
        if (value === null) {
          _value = '';
        } else if (typeof value === 'object' && Array.isArray(value)) {
          _value = value.join('<br>');
        } else if (typeof value == 'string') {
          _value = value;
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
const _result = document.getElementById('result');
const btnExecute = document.getElementById('btn-execute');

const url = "/credviewer";

notification.open = false;

const execute = () => {
  getData(url);
};

btnExecute.addEventListener('click', async () => {
  execute();
});

window.addEventListener("load", () => {
    execute();
});