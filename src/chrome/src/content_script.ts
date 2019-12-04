const LocalMessageDuplexStream = require("post-message-stream");

const injectionStream = new LocalMessageDuplexStream({
  name: "content",
  target: "injection"
});

injectionStream.on("data", (data: any) => {
  chrome.runtime.sendMessage(data, function(response) {
    injectionStream.write(response);
  });
});

function injectScript() {
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
}

chrome.runtime.sendMessage({ type: "INIT" }, function(response: boolean) {
  if (response) {
    injectScript();
  }
});
