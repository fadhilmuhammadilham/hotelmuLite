const TransactionLocalStorage = {
  set: (data) => {
    localStorage.setItem('transaction', JSON.stringify(data))
  },
  get: (name) => {
    let data = localStorage.hasOwnProperty('transaction') ? JSON.parse(localStorage.getItem('transaction')): {}

    return typeof data[name] == 'undefined'? false: data[name]
  },
  getAll: () => {
    let data = localStorage.hasOwnProperty('transaction') ? JSON.parse(localStorage.getItem('transaction')): {}

    return data
  },
  remove: (name) => {
    let data = localStorage.hasOwnProperty('transaction') ? JSON.parse(localStorage.getItem('transaction')): {}

    data = data.filter((v, i) => i != name)

    localStorage.setItem('transaction', JSON.stringify(data))
  },
  removeAll: () => {
    localStorage.removeItem('transaction')
  },
}

export default TransactionLocalStorage