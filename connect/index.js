(async function () {
  const connURIel = document.getElementById("connection_request_uri");
  connURIel.innerText = document.location;
  const connURI = "https://simplex.chat";

  const connQRCode = document.getElementById("connection_request_qrcode");
  try {
    await QRCode.toCanvas(connQRCode, connURI, {errorCorrectionLevel: 'M'});
    console.log('success!');
  } catch (err) {
    console.error(err);
  }
})();
