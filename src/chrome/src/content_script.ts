try {
  const c = document.head || document.documentElement;
  const s = document.createElement("script");
  s.setAttribute("async", "false");
  s.setAttribute("type", "text/javascript");
  s.setAttribute("src", chrome.extension.getURL("/chrome/lib/injection.js"));
  c.appendChild(s);
} catch (e) {
  console.error("Injection failed", e);
}

window.addEventListener("message", event => {
  switch (event.data.type) {
    case "GET_PUBKEY":
    case "POST_STDTX":
      chrome.runtime.sendMessage(event.data, response => {
        window.postMessage(
          {
            type: "CALLBACK",
            value: response
          },
          "*"
        );
      });
      break;
  }
});
