const TableLocalStorage = {
    set: (table) => {
      localStorage.setItem('table', JSON.stringify(table))
    },
    get: (name) => {
      let data = localStorage.hasOwnProperty('table') ? JSON.parse(localStorage.getItem('table')): {}
  
      return typeof data[name] == 'undefined'? false: data[name]
    },
    getAll: () => {
      let data = localStorage.hasOwnProperty('table') ? JSON.parse(localStorage.getItem('table')): {}
  
      return data
    },
    remove: (name) => {
      let data = localStorage.hasOwnProperty('table') ? JSON.parse(localStorage.getItem('table')): {}
  
      data = data.filter((v, i) => i != name)
  
      localStorage.setItem('table', JSON.stringify(data))
    },
    removeAll: () => {
      localStorage.removeItem('table')
    },
  }
  
  export default TableLocalStorage