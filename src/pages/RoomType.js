import Page from "./Page"
import homeView from "../templates/room-type.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class RoomType extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default RoomType