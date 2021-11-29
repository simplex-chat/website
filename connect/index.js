(async function () {
  const connURIel = document.getElementById("connection_request_uri");
  const connURI = connURIel.innerText = document.location.toString();

  const connQRCode = document.getElementById("connection_request_qrcode");
  try {
    await QRCode.toCanvas(connQRCode, connURI, {errorCorrectionLevel: 'M'});
    console.log('success!');
  } catch (err) {
    console.error(err);
  }
})();
