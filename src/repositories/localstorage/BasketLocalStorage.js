const BasketLocalStorage = {
  save: (basket) => {
    localStorage.setItem('basket', JSON.stringify(basket))
  },
  getAll: () => {
    return localStorage.getItem('basket') ? JSON.parse(localStorage.getItem('basket')) : {}
  },
  get: (name) => {
    let data = localStorage.hasOwnProperty('basket') ? JSON.parse(localStorage.getItem('basket')): {}

    return typeof data[name] == 'undefined'? false: data[name]
  },
  clear: () => {
    localStorage.removeItem('basket')
  }
}

export default BasketLocalStorage