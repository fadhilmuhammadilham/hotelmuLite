const UserLocalStorage = {
    set: (user) => {
      localStorage.setItem('user', JSON.stringify(user))
    },
    get: (name) => {
      let data = localStorage.hasOwnProperty('user') ? JSON.parse(localStorage.getItem('user')): {}
  
      return typeof data[name] == 'undefined'? false: data[name]
    },
    getAll: () => {
      let data = localStorage.hasOwnProperty('user') ? JSON.parse(localStorage.getItem('user')): {}
  
      return data
    },
    remove: (name) => {
      let data = localStorage.hasOwnProperty('user') ? JSON.parse(localStorage.getItem('user')): {}
  
      data = data.filter((v, i) => i != name)
  
      localStorage.setItem('user', JSON.stringify(data))
    },
    removeAll: () => {
      localStorage.removeItem('user')
    },
  }
  
  export default UserLocalStorage