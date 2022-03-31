const EDCLocalStorage = {
    set: (edc) => {
      localStorage.setItem('edc', JSON.stringify(edc))
    },
    get: (name) => {
      let data = localStorage.hasOwnProperty('edc') ? JSON.parse(localStorage.getItem('edc')): {}
  
      return typeof data[name] == 'undefined'? false: data[name]
    },
    getAll: () => {
      let data = localStorage.hasOwnProperty('edc') ? JSON.parse(localStorage.getItem('edc')): {}
  
      return data
    },
    remove: (name) => {
      let data = localStorage.hasOwnProperty('edc') ? JSON.parse(localStorage.getItem('edc')): {}
  
      data = data.filter((v, i) => i != name)
  
      localStorage.setItem('edc', JSON.stringify(data))
    },
    removeAll: () => {
      localStorage.removeItem('edc')
    },
  }
  
  export default EDCLocalStorage