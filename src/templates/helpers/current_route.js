export default (route) => {
  const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$")

  return location.pathname.match(pathToRegex(route))
}