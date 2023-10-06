// Example POST method implementation:
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST",
    mode: "no-cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br"
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data)
  });
  return response.json    // Example POST method implementation:
}

postData("http://172.16.73.201/aznapi", {
  "user_name": "user1",
  "permission_bits": "Tr",
  "object_name": "/WebSEAL/cloudinit.verifyaccess.local-default/aznapi"}).then((data) => {
    console.log(data);
 });