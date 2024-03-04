import Page from "./Page"
import homeView from "../templates/detail-room-type.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class DetailRoomType extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default DetailRoomType