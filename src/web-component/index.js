import { LitElement } from "lit-element";

class Pdb3dComplex extends LitElement {

  static get properties() {
    return {
      pdbId: { type: String, attribute: 'pdb-id' },
      assemblyId: { type: String, attribute: 'assembly-id' },
      summaryView: { type: Boolean, attribute: 'summary-view' }
    };
  }

  validateParams() {
    if(typeof this.pdbId == 'undefined' || typeof this.assemblyId == 'undefined') return false;
    return true
  }

  connectedCallback() {
    super.connectedCallback();

    let paramValidatity = this.validateParams();
    if(!paramValidatity) return

    // create an instance of the plugin
    this.viewInstance = new Pdb3dComplexPlugin();    
    this.viewInstance.render(this, this.pdbId, this.assemblyId, this.summaryView);
  }

  createRenderRoot() {
    return this;
  }

}

export default Pdb3dComplex;

customElements.define('pdb-3d-complex', Pdb3dComplex);