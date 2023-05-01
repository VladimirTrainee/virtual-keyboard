export class DomNode {
  constructor(parent, properties = { NAME: 'name', TAG: 'tag', FUNCTION: 'function', STYLE: 'style' }) {
    this.properties = properties; 
    this.parent = parent;
  }

  addNode(node) {
    if (node && Object.prototype.hasOwnProperty.call(node, this.properties.TAG) && node[this.properties.TAG] > '') {
      this.node = document.createElement(node[this.properties.TAG]);
      for (const [key, value] of Object.entries(node)) {
        if (key !== this.properties.TAG) this.node[key] = value;
      }
      this.parent.appendChild(this.node);
    }
    return this;
  }

  getNode() {
    return this.node;
  }

  setParent() {
    this.parent = this.parent?.parentNode;
    return this;
  }
  
  setNewParent() {
    this.parent = this.node;
    return this;
  }

  setEvent(eventDetails) {
    if (eventDetails && Object.prototype.hasOwnProperty.call(eventDetails, this.properties.NAME)) {
      if (Object.prototype.hasOwnProperty.call(eventDetails, this.properties.FUNCTION)) {
        this.node.addEventListener(eventDetails[this.properties.NAME], eventDetails[this.properties.FUNCTION]);
      }
    }
    return this;
  }

  setStyle(styles = {}) {
    const node = this.getNode();

    for (const [styleX] of Object.entries(styles)) {
      if (node && node[this.properties.STYLE]) node[this.properties.STYLE][styleX] = styles[styleX]; 
    }

    return this;
  }
}
