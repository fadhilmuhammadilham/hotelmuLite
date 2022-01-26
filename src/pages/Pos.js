import Page from "./Page"
import posView from "../templates/pos.handlebars"
import posItemView from '../templates/pos-item.handlebars'
import posCategoryView from '../templates/pos-nav-cat.handlebars'
import posBasketView from '../templates/pos-basket.handlebars'
import BasketService from "../services/BasketService"
import ItemApi from "../repositories/api/ItemApi"
import $ from "jquery"

class Pos extends Page {
  constructor(params) {
    super(params)
  }

  async getItems() {
    try {
      let res = await ItemApi.getAll()

      return res.data
    } catch (error) {
      console.log(error)
    }
  }

  async action() {
    const basketService = new BasketService()
    const dataItems = await this.getItems()

    const itemsFormat = (items) => {
      let cats = []

      for (const item of items) {
        let catIndex = cats.findIndex((cat) => cat.id == item.category.id)

        if (catIndex >= 0) cats[catIndex].products.push(item)
        else cats.push({
          id: item.category.id,
          name: item.category.name,
          products: [item]
        })
      }

      return cats
    }

    const viewBasket = (basketService) => {
      if (basketService.items.length > 0) {
        $('#app').append(posBasketView({ qty: basketService.totalQty, totalPrice: basketService.totalPrice }))
      } else {
        if ($('#cart').length > 0) $('#cart').remove()
      }
    }

    viewBasket(basketService)

    const viewItem = (items) => {
      items = itemsFormat(items)
      $('#nav-category').html(posCategoryView({ items: items }))
      $('#content-product').html(posItemView({ items: items }))
    }

    viewItem(dataItems)

    $(document).on('keyup', '#searchProduct', () => {
      let searchValue = $('#searchProduct').val()

      if (searchValue.length > 0) $('#eraser-btn').removeClass('d-none')
      else $('#eraser-btn').addClass('d-none')

      let itemsFiltered = dataItems.filter(item => item.name.toLowerCase().match(searchValue.toLocaleLowerCase()))
      viewItem(itemsFiltered)
    })

    $(document).on('click', '#eraser-btn', () => $('#searchProduct').val('').trigger('keyup'))

    $(document).on('submit', '.search-form', (e) => {
      e.preventDefault()
    })

    $(document).on('click', '.product', (even) => {
      let product = $(even.currentTarget).data('id')

      product = dataItems.find((item) => item.id == product)

      basketService.addItem(product)
      viewBasket(basketService)
    })

    // $(document).on('click', '#button-scan-barcode', () => {
    // 	scanBarcode()
    // })
  }

  render() {
    return posView()
  }
}

export default Pos