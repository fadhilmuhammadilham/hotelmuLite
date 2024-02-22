import Page from "./Page"
import homeView from "../templates/index.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class Home extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default Home