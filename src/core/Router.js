import routers from "../routers"

const Router = async () => {
  const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$")

  const getParams = match => {
    const values = match.result.slice(1)
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1])

    return Object.fromEntries(keys.map((key, i) => {
      return [key, values[i]]
    }))
  }

  // Test each route for potential match
  const potentialMatches = routers.map(route => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path))
    }
  })

  let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null)

  if (!match) {
    match = {
      route: routers[0],
      result: [location.pathname]
    }
  }

  for (const middleware of match.route.middlewares) {
    let pro = new Promise(resolve => {
      let instance = new middleware
      let re = instance.before()
      resolve(re)
    })
    let re = await pro
    console.log(middleware)
    console.log(pro)
    if (!re) return
  }

  const _inst = new match.route.view(getParams(match))
  document.querySelector("#app").innerHTML = _inst.render()
  _inst.action()

}

export default Router