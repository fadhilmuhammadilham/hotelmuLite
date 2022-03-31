const ShiftLocalStorage = {
  set: (shift) => {
    localStorage.setItem('shift', JSON.stringify(shift))
  },
  get: (name) => {
    let data = localStorage.hasOwnProperty('shift') ? JSON.parse(localStorage.getItem('shift')): {}

    return typeof data[name] == 'undefined'? false: data[name]
  },
  getAll: () => {
    let data = localStorage.hasOwnProperty('shift') ? JSON.parse(localStorage.getItem('shift')): {}

    return data
  },
  remove: (name) => {
    let data = localStorage.hasOwnProperty('shift') ? JSON.parse(localStorage.getItem('shift')): {}

    data = data.filter((v, i) => i != name)

    localStorage.setItem('shift', JSON.stringify(data))
  },
  removeAll: () => {
    localStorage.removeItem('shift')
  },
}

export default ShiftLocalStorage