const container = document.getElementById("root");
const app = document.createElement("div");
app.id = "app";
container.appendChild(app);

const textNode = document.createTextNode("hello mini-react! ---main0");
app.appendChild(textNode);
