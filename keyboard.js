import {DomNode} from './domnode.js';
import {NodeList} from './nodelist.js';

export class KeyBoard {
    constructor(keys = []) {
      this.tags = new NodeList(['form', 'div', 'textarea', 'button', 'span', 'sup']);
      this.classes = new NodeList(['board', 'keyboardInput', 'textMain', 'textAlt', 'keyMain', 'keyOption'], ['board', 'keyboard-input', 'text-main', 'text-alt', 'key-main', 'key-option']);
      this.idMasks = new NodeList(['board', 'keyboard', 'text', 'key'], ['board', 'keyboard-input', '-text', '-button']);
      this.button = { width: { value: 6.3, type: '%' }, height: { value: '50', type: 'px' } }
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
        document.getElementById(`${key}${this.idMasks.nodeLabel.key}`).classList.value = this.classes.nodeLabel.keyOption;
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
      this.domNode.addNode({ tag: this.tags.nodeName.div, className: this.classes.nodeName.board })
        .setNewParent()
        .addNode({ tag: this.tags.nodeName.form })
        .setNewParent()
        .addNode({ tag: this.tags.nodeName.textarea, className : this.classes.nodeLabel.keyboardInput, id: this.idMasks.nodeLabel.keyboard })
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
        const keyWidth = `${Number(width) * this.button.width.value}${this.button.width.type}`;
        const keyHeight = `${this.button.height.value}${this.button.height.type}`;
        const buttonClass = (inverse) ? this.classes.nodeLabel.keyOption : this.classes.nodeLabel.keyMain;

        this.domNode.addNode({ tag: this.tags.nodeName.button, className: buttonClass, id: `${code}${this.idMasks.nodeLabel.key}` })
         .setStyle({ width: keyWidth, height: keyHeight })
          .setNewParent();
        if (shiftValue && !hideShiftValue) {
          this.domNode.addNode({ tag: this.tags.nodeName.sup, className: this.classes.nodeLabel.textAlt, innerText: shiftValue });
        }
        this.domNode.addNode({ tag: this.tags.nodeName.span, className: this.classes.nodeLabel.textMain, innerText: label, id: `${code}${this.idMasks.nodeLabel.text}` })
          .setParent();

      }

      return this;
    }

    nextLanguage() {
      this.languageIndex++;
      this.languageIndex %= this.languages.length;

      for (let key of this.keyOrder) {
        const { code, inverse = false, value = this.languages[this.languageIndex] } = this.keys[key];
        const keyId = `${code}${this.idMasks.nodeLabel.text}`;
        const index = Math.min(value.length - 1, this.languageIndex);
        const keyText = (inverse) ? value : String(value).charAt(index);
        if (inverse === false) {
          document.getElementById(keyId).innerText = keyText;
        } else if (code === this.keys.Language.code) {
          document.getElementById(keyId).innerText = this.languages[index];
        }
      }
      return this;
    }
  }
