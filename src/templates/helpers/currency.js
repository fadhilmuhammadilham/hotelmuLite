import ConfigLocalStorage from "../../repositories/localstorage/ConfigLocalStorage";

export default (number, n, withCurrency = true) => {
  const x = 3;
  const s = '.';
  const c = ',';

  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = number.toFixed(Math.max(0, ~~n));

  const currency = ConfigLocalStorage.get('currency')
  return (withCurrency ? currency.symbol : '') + (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
}