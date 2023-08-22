const template = document.createElement("template");

template.innerHTML = `
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        h3 {
            color: inherit;
        }
        p {
            color: red;
        }
        .card {
            background: gold;
        }
    </style>
    <div class="card">
        <h3></h3>
        <div>
            <p><slot name="email" /></p>
            <p><slot name="phone" /></p>
            <p><slot name="address" /></p>
        </div>
    </div>
`;

export class WebComponentCard extends HTMLElement {
  root: ShadowRoot;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.root.appendChild(template.content.cloneNode(true));

    const name = this.getAttribute("name");

    if (name) {
      this.root.querySelector("h3")!.innerText = name;
    }
  }
}

window.customElements.define("web-comp-card", WebComponentCard);
