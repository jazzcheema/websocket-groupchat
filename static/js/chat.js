"use strict";

/** Client-side of groupchat. */

const urlParts = document.URL.split("/");
const roomName = urlParts[urlParts.length - 1];
const ws = new WebSocket(`ws://localhost:3000/chat/${roomName}`);


const name = prompt("Username? (no spaces)");


/** called when connection opens, sends join info to server. */

ws.onopen = function (evt) {
  console.log("open", evt);

  let data = { type: "join", name: name };
  ws.send(JSON.stringify(data));
};


/** called when msg received from server; displays it. */

ws.onmessage = function (evt) {
  console.log("message", evt);

  let msg = JSON.parse(evt.data);
  let $item = document.createElement("li");

  if (msg.type === "note") {
    $item.innerHTML = `<i>${msg.text}</i>`;
  } else if (msg.type === "chat") {
    $item.innerHTML = `<b>${msg.name}: </b>${msg.text}`;
  } else {
    return console.error(`bad message: ${msg}`);
  }

  document.querySelector("#messages").appendChild($item);
};


/** called on error; logs it. */

ws.onerror = function (evt) {
  console.error(`err ${evt}`);
};


/** called on connection-closed; logs it. */

ws.onclose = function (evt) {
  console.log("close", evt);
};


/** send message when button pushed. */

function sendMessage(evt) {
  evt.preventDefault();
  let data = { type: "chat", text: document.querySelector("#m").value };
  let args = data.text.split(' ')
  console.log(args, '***args')
  console.log(data, 'data is ****')

  if (data.text === "/joke") {
    data.type = "joke";
  }
  else if (data.text === "/members") {
    data.type = "members";
  } else if (args[1] === "/priv") {
    data.type = "private"
    data.name = args[2]
    console.log(data.text, 'data.text')
    data.text = args[3].slice(3)
  }

  ws.send(JSON.stringify(data));

  document.querySelector("#m").value = "";
}

document.querySelector("form").addEventListener("submit", sendMessage);
