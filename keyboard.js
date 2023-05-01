import {DomNode} from './domnode.js';
import {NodeList} from './nodelist.js';

export class KeyBoard {
    constructor(keys = []) {
      this.tags = new NodeList(['form', 'div', 'textarea', 'button', 'span', 'sup']);
      this.CapsLock = false;
      this.ShiftLeft = false;
      this.ShiftRight = false;
      this.keyOrder = [];
      this.keys = Object.fromEntries(keys.map((key, index) => { 
        const keyDetails = { ...key, order: index };
        this.keyOrder.push(key.code); 
        return [key.code, keyDetails];
      }));
  
      this.languages = ['En', 'Ru'];
      this.languageIndex = 0;
    }
    
    resetSequenceKeys() {
      const keyList = [
        this.keys.ShiftLeft.code,
        this.keys.ShiftRight.code,
        this.keys.ControlLeft.code,
        this.keys.ControlRight.code,
        this.keys.AltLeft.code,
        this.keys.AltRight.code
      ];
      
      for (const key of keyList) {
        this[key] = false;
        document.getElementById(`${key}-button`).classList.value = 'key-button2';
      }
        
      return this;
    } 
    setEndBoardKey(key) {
      this.endBoardKeys.push(key);
      return this;
    }
  
    setParent(parent) {
      this.parent = parent;
      this.domNode = new DomNode(this.parent);
      return this;
    }
  
    createNode() {
      this.domNode.addNode({ tag: this.tags.nodeName.div, className: 'board' })
        .setNewParent()
        .addNode({ tag: this.tags.nodeName.form })
        .setNewParent()
        .addNode({ tag: this.tags.nodeName.textarea, className : 'keyboard-input', id: 'keyboard-input' })
        .setParent();
      for (let key of this.keyOrder) {
        const  {
          code, 
          value = this.languages[this.languageIndex],
          shiftValue, 
          width = '1', 
          hideShiftValue = false, 
          inverse = false 
        } = this.keys[key];
        const label = (inverse) ? value : String(value).charAt(this.languageIndex);
        const keyWidth = `${+width * 6.3}%`;
        const keyHeight = '50px';

        this.domNode.addNode({ tag: this.tags.nodeName.button, className: ((inverse) ? 'key-button2' : 'key-button'), id: `${code}-button` })
          .setStyle({ width: keyWidth, height: keyHeight })
          .setNewParent();
        if (shiftValue && !hideShiftValue) {
          this.domNode.addNode({ tag: this.tags.nodeName.sup, className: 'key-small', innerText: shiftValue });
        }
        this.domNode.addNode({ tag: this.tags.nodeName.span, className: 'key-main', innerText: label, id: `${code}-label` })
          .setParent();

      }

      return this;
    }

    nextLanguage() {
      this.languageIndex++;
      this.languageIndex %= this.languages.length;
      return this;
    }
  }
