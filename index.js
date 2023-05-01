import {KeyBoard} from './keyboard.js';

const splitDigit = (val) => { return {code: `Digit${val[0]}`, value: val[0], shiftValue: val[1] }};
const splitLetter = (val) => { return {code: `Key${String(val).charAt(0)}`, value: val, shiftValue: String(val).toLowerCase(), hideShiftValue: true }};

const keyBoard = new KeyBoard([
  { code: 'Backquote', value: '`', shiftValue: '~' },
  ...[['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('], ['0', ')']].map(splitDigit),
  { code: 'Minus', value: '-', shiftValue: '_' },
  { code: 'Equal', value: '=', shiftValue: '+' },
  { code: 'Backspace', value: 'Backspace', width: '2.8', endLine: true, inverse: true },
  { code: 'Tab', value: 'Tab', width: '1.4', inverse: true },
  ...['QЙ', 'WЦ', 'EУ', 'RК', 'TЕ', 'YН', 'UГ', 'IШ', 'OЩ', 'PЗ'].map(splitLetter),
  { code: 'BracketLeft', value: '[Х', shiftValue: '{'} ,
  { code: 'BracketRight', value: ']Ъ', shiftValue: '}' },
  { code: 'Backslash', value: '\\', shiftValue: '|' },
  { code: 'Delete', value: 'DEL', width: '1.4', endLine: true, inverse: true },
  { code: 'CapsLock', value: 'Caps Lock', width: '2.7', inverse: true },
  ...['AФ', 'SЫ', 'DВ', 'FА', 'GП', 'HР', 'JО', 'KЛ', 'LД'].map(splitLetter),
  { code: 'Semicolon', value: ';Ж', shiftValue: ':' },
  { code: 'Quote', value: '\'Э', shiftValue: '"' },
  { code: 'Enter', value: 'ENTER', width: '2.1', endLine: true, inverse: true },
  { code: 'ShiftLeft', value: 'Shift', width: '2.7', inverse: true },
  ...['ZЯ', 'XЧ', 'CС', 'VМ', 'BИ', 'NТ', 'MЬ'].map(splitLetter),
  { code: 'Comma', value: ',Б', shiftValue: '<' },
  { code: 'Period', value: '.Ю', shiftValue: '>' },
  { code: 'Slash', value: '/', shiftValue: '?' },
  { code: 'ArrowUp', value: '↑' },
  { code: 'ShiftRight', value: 'Shift', width: '2.1', endLine: true, inverse: true },
  { code: 'ControlLeft', value: 'Ctrl', width: '1.4', inverse: true } ,
  { code: 'MetaLeft', value: 'Win', width: '1.4', inverse: true },
  { code: 'AltLeft', value: 'Alt', width: '1.3', inverse: true },
  { code: 'Space', value: ' ', width: '4.9', inverse: true },
  { code: 'AltRight', value: 'Alt', width: '1.3', inverse: true },
  { code: 'ControlRight', value: 'Ctrl', width: '1.4', inverse: true },
  { code: 'ArrowLeft', value: '←' },
  { code: 'ArrowDown', value: '↓' },
  { code: 'ArrowRight', value: '→' },
  { code: 'Language', width: '1.1', inverse: true }
]);

keyBoard.setParent(document.getElementById('body'))
  .createNode();

