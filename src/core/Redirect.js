import Router from "./Router"

const Redirect = (url, replace = false) => {
  if (!replace) history.pushState(null, null, url)
  else history.replaceState(null, null, url)
  
  Router()
}

export default Redirect
