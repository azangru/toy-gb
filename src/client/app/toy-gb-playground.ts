import './toy-gb';
import './playground/playground-sidebar';

import type { GenomeBrowser } from './toy-gb';

class ToyGBPlayground extends HTMLElement {
  genomeBrowser: GenomeBrowser;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    root.innerHTML = `
      ${styles}
      <div class="canvas-frame">
        <toy-gb></toy-gb>
      </div>
      <div>
        <playground-sidebar></playground-sidebar>
      </div>
    `;
  }

  connectedCallback() {
    this.genomeBrowser = this.shadowRoot?.querySelector('toy-gb') as unknown as GenomeBrowser;
  }



}

const styles = `
<style>

:host {
  display: grid;
  grid-template-columns: 1fr 200px;
  height: 100%;
}

* {
  box-sizing: border-box;
}

.canvas-frame {
  border: 1px solid black;
}
</style>
`;

window.customElements.define('toy-gb-playground', ToyGBPlayground);


export default ToyGBPlayground;
