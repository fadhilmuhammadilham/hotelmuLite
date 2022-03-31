const TransactionFilterLocalStorage = {
    set: (transaction) => {
      localStorage.setItem('transactionFilter', JSON.stringify(transaction))
    },
    get: (name) => {
      let data = localStorage.hasOwnProperty('transactionFilter') ? JSON.parse(localStorage.getItem('transactionFilter')): {}
  
      return typeof data[name] == 'undefined'? false: data[name]
    },
    getAll: () => {
      let data = localStorage.hasOwnProperty('transactionFilter') ? JSON.parse(localStorage.getItem('transactionFilter')): {}
  
      return data
    },
    remove: (name) => {
      let data = localStorage.hasOwnProperty('transactionFilter') ? JSON.parse(localStorage.getItem('transactionFilter')): {}
  
      data = data.filter((v, i) => i != name)
  
      localStorage.setItem('transactionFilter', JSON.stringify(data))
    },
    removeAll: () => {
      localStorage.removeItem('transactionFilter')
    },
  }
  
  export default TransactionFilterLocalStorage