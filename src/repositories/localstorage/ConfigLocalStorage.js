const ConfigLocalStorage = {
  set: (name, value) => {
    let data = localStorage.hasOwnProperty('config') ? JSON.parse(localStorage.getItem('config')) : {}

    if (typeof name == 'object') data = Object.assign(data, name)
    else data[name] = value

    localStorage.setItem('config', JSON.stringify(data))
  },
  get: (name) => {
    let data = localStorage.hasOwnProperty('config') ? JSON.parse(localStorage.getItem('config')) : {}

    return typeof data[name] == 'undefined' ? false : data[name]
  },
  getAll: () => {
    let data = localStorage.hasOwnProperty('config') ? JSON.parse(localStorage.getItem('config')) : {}

    return data
  },
  remove: (name) => {
    let data = localStorage.hasOwnProperty('config') ? JSON.parse(localStorage.getItem('config')) : {}

    data = data.filter((v, i) => i != name)

    localStorage.setItem('config', JSON.stringify(data))
  },
  removeAll: () => {
    localStorage.removeItem('config')
  },
}

export default ConfigLocalStorage