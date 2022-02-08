import Page from "./Page"
import posTypeView from "../templates/pos-type.handlebars"
import posTypeItemView from "../templates/pos-type-item.handlebars"
import BasketService from "../services/BasketService"
import TypeApi from "../repositories/api/TypeApi"
import $ from 'jquery'
import Redirect from "../core/Redirect"
import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage"

class PosPayment extends Page {
  constructor(params) {
    super(params)
  }

  async action() {
    const basketService = new BasketService()
    basketService.clear()
    const types = await TypeApi.getAll()
    $('#type-items').html(posTypeItemView({types:types.data}))

    $('.type-item').on('click', e => {
      let id = $(e.currentTarget).data('id')
      let type = types.data.find(item => item.id == id)

      basketService.setType(type)
      Redirect('/pos')
    })
  }

  render() {
    return posTypeView()
  }
}

export default PosPayment