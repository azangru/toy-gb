class PlaygroundSidebar extends HTMLElement {

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    root.innerHTML = `
      ${styles}
      <div class="location-input">
        <label for="location-input">
          Location:
        </label>
        <input id="location-input" />        
      </div>
    `;
  }

}


const styles = `
<style>

:host {
  display: block;
  padding: 1rem 0.6rem;
}

.location-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

</style>
`;


window.customElements.define('playground-sidebar', PlaygroundSidebar);

export default PlaygroundSidebar;
