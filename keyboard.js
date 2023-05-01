import {DomNode} from './domnode.js';
import {NodeList} from './nodelist.js';

export class KeyBoard {
    constructor(keys = []) {
      this.tags = new NodeList(['form', 'div', 'textarea', 'button', 'span', 'sup']);
      this.classes = new NodeList(['board', 'keyboardInput', 'textMain', 'textAlt', 'keyMain', 'keyOption'], ['board', 'keyboard-input', 'text-main', 'text-alt', 'key-main', 'key-option']);
      this.idMasks = new NodeList(['board', 'keyboard', 'text', 'key', 'pressed', 'digit'], ['board', 'keyboard-input', '-text', '-button', '-pressed', 'Digit']);
      this.button = { width: { value: 6.3, type: '%' }, height: { value: '50', type: 'px' }, space: ' ', tab: '	' }
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
      this.events = {};
      this.functions = {};
      this.functions.getButton = (keyCode) => {
        const keyId = `${keyCode}${this.idMasks.nodeLabel.key}`;
        const element = (keyId) ? document.getElementById(keyId) : undefined;
        return element;
      }

      this.functions.updateButtonClass = (keyCode, pressed = false) => {
        if (!keyCode) return;
        const keyName = (this.keys[keyCode].inverse) ? this.classes.nodeLabel.keyOption : this.classes.nodeLabel.keyMain;
        const element = this.functions.getButton(keyCode);
        const pressedMask = (pressed) ? this.idMasks.nodeLabel.pressed : '';
        if (element) {
           element.classList.value = `${keyName}${pressedMask}`;
        }
      }

      this.functions.moveSelector = (input, offSet) => {
        if (input.selectionStart + offSet >= 0) { input.selectionStart += offSet; }
        input.selectionEnd = input.selectionStart;
      }

      this.functions.updateSelector = (input, offSet = 0, value = '') => {
        const noSelection = (input.selectionStart === input.selectionEnd);
        const valueStart = String(input.value).substring(0, input.selectionStart + ((offSet < 0 && noSelection) ? offSet : 0) , input.selectionEnd);
        const valueFinish = String(input.value).substring(input.selectionEnd  + ((offSet > 0  && noSelection) ? offSet : 0) );
  
        const position = input.selectionStart + String(value).length + ((offSet < 0  && noSelection) ? offSet : 0);
        input.value = valueStart + value + valueFinish;
        input.selectionStart = position;
        input.selectionEnd = input.selectionStart;
   
      }
      
      this.events.keydown = (event) => {
        const key = event.code;
        switch(key) {
          case this.keys.Tab.code:
            event.preventDefault();
            this.functions.updateButtonClass(key, true);
            break;
          case this.keys.CapsLock.code:
            this[key] = !this[key];
            this.functions.updateButtonClass(key, this[key]);
            break;
          default:
            this.functions.updateButtonClass(key, true);
            break;

        }
        this.lastKey = key;
        this.lastKeyDown = true;
      }

      this.events.keyup = (event) => {
        const key = event.code;
        switch(key) {
          case this.keys.Tab.code:
            event.preventDefault();
            this.functions.updateButtonClass(key, false);
            break;
          case this.keys.CapsLock.code:
            this.functions.updateButtonClass(key, this[key]);
            break;
          default:
            this.functions.updateButtonClass(key, false);
            break;

        }
        this.lastKeyDown = false;
      }

      this.events.focusout = (event) => {
        event.preventDefault();
        for (const keyName of this.keyOrder) {
          this.functions.updateButtonClass(keyName, false);
        }

      }

      this.events.mousedown = (event) => {
        event.preventDefault();
        
        const key = event.currentTarget.id.split('-')[0];
        const input = document.getElementById(this.idMasks.nodeLabel.keyboard);
        const button = this.functions.getButton(key);
        let shift;
        let shiftCase;
        let values;
        let value;
        let index;
        let updateClass = true;
        button.focus();
        switch (key) {
          case this.keys.Language.code:
            this.nextLanguage();
            this.functions.updateButtonClass(key, false);
            break;
          case this.keys.CapsLock.code:
          case this.keys.ShiftLeft.code:
          case this.keys.ShiftRight.code:
          case this.keys.ControlLeft.code:
          case this.keys.ControlRight.code:
          case this.keys.AltLeft.code:
          case this.keys.AltRight.code:
            this[key] = !this[key];
            updateClass = false;
            this.functions.updateButtonClass(key, this[key]);
            break;
          case this.keys.Space.code:
            this.functions.updateSelector(input, 0, this.button.space);
            break;
          case this.keys.Enter.code:
            this.functions.updateSelector(input, 0, '\n');
            break;
          case this.keys.MetaLeft.code:
            break;
          case this.keys.Tab.code:
            this.functions.updateSelector(input, 0, this.button.tab);
            break;  
          case this.keys.Backspace.code:
            this.functions.updateSelector(input, -1);
            break;
          case this.keys.Delete.code:
            this.functions.updateSelector(input, 1);
            break;
          case this.keys.ArrowLeft.code:
            this.functions.moveSelector(input, -1);
            break;
          case this.keys.ArrowRight.code:
            this.functions.moveSelector(input, 1);
            break;
          case this.keys.ArrowUp.code:
          case this.keys.ArrowDown.code:
            break;
          default:
            shift = (this.ShiftLeft || this.ShiftRight) ? true : false;
            shiftCase = (String(key).startsWith(this.idMasks.nodeLabel.digit)) ? !shift : (this.CapsLock && !shift) || (!this.CapsLock && shift) ;
            values = (shiftCase) ? this.keys[key].value : this.keys[key].shiftValue;
            index = Math.min(values?.length - 1, this.languageIndex);
            value = values[index];
            input.value += value;
            this.sequenceKeys('reset');
            break;

        }
        if (updateClass) { this.functions.updateButtonClass(key, true); }
        this.lastKey = key;
        this.lastKeyDown = true;
      }

      this.events.mouseup = (event) => {

        event.preventDefault();
        const input = document.getElementById(this.idMasks.nodeLabel.keyboard);
        const key = event.currentTarget.id.split('-')[0];

        switch (key) {
          case this.keys.CapsLock.code:
          case this.keys.ShiftLeft.code:
          case this.keys.ShiftRight.code:
          case this.keys.ControlLeft.code:
          case this.keys.ControlRight.code:
          case this.keys.AltLeft.code:
          case this.keys.AltRight.code:
           // this.functions.updateButtonClass(key, this[key]);
            break;
          default:
            this.functions.updateButtonClass(key, false);
            break;
        }
        input.focus();
        this.lastKeyDown = false;
      }
      this.events.mouseout = (event) => {
        event.preventDefault();
        if ( this.lastKeyDown) {
          this.functions.updateButtonClass(this.lastKey, false);
        }
      }
    }

    sequenceKeys(type = 'reset', values = {}) {
      const resetKeys = [
        this.keys.ShiftLeft.code,
        this.keys.ShiftRight.code,
        this.keys.ControlLeft.code,
        this.keys.ControlRight.code,
        this.keys.AltLeft.code,
        this.keys.AltRight.code,
      ];
      const updateKeys = [
        this.keys.CapsLock.code
      ];
      const keyList = (type === 'reset') ? resetKeys : updateKeys;
      for (const key of keyList) {
        this[key] = (type === 'reset') ? false : values[key];
        this.functions.updateButtonClass(key, this[key]);
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
        .setEvent({ name: 'keydown', function: this.events.keydown })
        .setEvent({ name: 'keyup', function: this.events.keyup })
        .setEvent({ name: 'focusout', function: this.events.focusout })
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
          .setEvent({ name: 'mousedown', function: this.events.mousedown})
          .setEvent({ name: 'mouseup', function: this.events.mouseup })
          .setEvent({ name: 'mouseout', function: this.events.mouseout })
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
