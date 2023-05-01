export class NodeList {
  constructor (names = [], labels = [], classes = []) {
    this.nameList = [...names];
    this.nextList = [...names].map((value, index) => index);
    this.labelList = [...labels];
    this.classList = [...classes];
    this.nodeName = Object.fromEntries(names.map((value) => [value, value]));
    this.nodeLabel = Object.fromEntries(labels.map((value, index) => [names[index], labels[index]]));
    this.nodeClass = Object.fromEntries(labels.map((value, index) => [names[index], classes[index]]));
    this.mask = '';
  }

  setMask(mask) {
    this.mask = mask;
    return this;
  }

  add(name) {
    this.index = this.list.indexOf(name);
    return this;
  }

  setByName(name) {
    this.index = this.nameList.indexOf(name);
    return this;
  }

  setByIndex(index) {
    this.index = index;
    return this;
  }

  setNextByName(name, nextName) {
    const nextIndex = this.nameList.indexOf(nextName); 
    
    this.setByIndex(this.nameList.indexOf(name));
    this.nextList[this.index] = nextIndex;
    return this;
  }

  setNext(flag) {
    if (flag) {
      this.index = this.nextList[this.index];
    }
    return this;
  }

  getMask() {
    return this.mask;
  }

  getName() {
    return this.nameList[this.index];
  }

  getLabel() {
    return this.labelList[this.index];
  }

  getClass() {
    return this.classList[this.index];
  }

  getId() {
    const name = this.nameList[this.index];
    return `${this.mask}${name}`;
  }

  getLength () {
    return this.nameList.length;
  }
}

