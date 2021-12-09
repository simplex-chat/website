(async function () {
  const connURIel = document.getElementById("conn_req_uri_text");
  const connURI = document.location.toString().replace(/\/(contact|invitation)\//, "/$1");
  connURIel.innerText = "/c " + connURI;
  if (document.location.pathname.indexOf("/contact") >= 0) {
    document.querySelector("#conn_req .conn_mode").innerText = "contact address of";
  }
  const els = document.querySelectorAll("#conn_req .content_copy_with_tooltip");
  if (navigator.clipboard) {
    els.forEach(contentCopyWithTooltip)
  } else {
    els.forEach(el => el.style.visibility = "hidden")
  }

  const connQRCode = document.getElementById("conn_req_uri_qrcode");
  try {
    await QRCode.toCanvas(connQRCode, connURI, {errorCorrectionLevel: 'M'});
    connQRCode.style.width = "360px";
    connQRCode.style.height = "360px";
  } catch (err) {
    console.error(err);
  }

  function contentCopyWithTooltip(parent) {
    const content = parent.querySelector(".content");
    const tooltip = parent.querySelector(".tooltiptext");
    const copyButton = parent.querySelector(".content_copy");
    copyButton.addEventListener("click", copyAddress)
    copyButton.addEventListener("mouseout", resetTooltip)

    function copyAddress() {
      navigator.clipboard.writeText(content.innerText || content.value);
      tooltip.innerHTML = "Copied!";
    }
  
    function resetTooltip() {
      tooltip.innerHTML = "Copy to clipboard";
    }  
  }

  // function copyAddress() {
  //   navigator.clipboard.writeText(connURI);
  //   tooltipEl.innerHTML = "Copied!";
  // }

  // function resetTooltip() {
  //   tooltipEl.innerHTML = "Copy to clipboard";
  // }
})();
