console.log("content-script.js loaded");

const preEls = document.querySelectorAll("pre");

[...preEls].forEach((preEl) => {
  const root = document.createElement("div");

  root.style.position = "relative";
  const shadowRoot = root.attachShadow({ mode: "open" });

  const cssUrl = chrome.runtime.getURL("content-script.css");

  shadowRoot.innerHTML = `<link rel="stylesheet" href="${cssUrl}"></link>`;

  const btn = document.createElement("button");
  btn.innerText = "Copy";
  btn.type = "button";

  shadowRoot.append(btn);

  preEl.prepend(root);

  const codeEl = preEl.querySelector("code");

  btn.addEventListener("click", () => {
    navigator.clipboard.writeText(codeEl.innerText);

    notify();
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message, sender, sendResponse);
  if (message.action === "copy-all") {
    const codeAll = getCodeAll();
    navigator.clipboard.writeText(codeAll).then(() => {
      notify();
      sendResponse(codeAll);
    });
    return true;
  }
});

function getCodeAll() {
  return [...preEls]
    .map((preEl) => preEl.querySelector("code").innerText)
    .join("");
}

const notify = () => {
  const scriptEl = document.createElement("script");
  scriptEl.src = chrome.runtime.getURL("execute.js");

  document.body.appendChild(scriptEl);

  scriptEl.onload = () => {
    scriptEl.remove();
  };
};
