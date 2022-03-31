import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage"

class BasketService {
  constructor() {
    const basketLocalStorage = BasketLocalStorage.getAll()
    
    this.type = typeof basketLocalStorage.type != 'undefined' ? basketLocalStorage.type: {}
    this.items = typeof basketLocalStorage.items != 'undefined' ? basketLocalStorage.items: []
    this.totalPrice = typeof basketLocalStorage.totalPrice != 'undefined' ? basketLocalStorage.totalPrice: 0
    this.totalDiscount = typeof basketLocalStorage.totalDiscount != 'undefined' ? basketLocalStorage.totalDiscount: 0
    this.totalAfterDiscount = typeof basketLocalStorage.totalAfterDiscount != 'undefined' ? basketLocalStorage.totalAfterDiscount: 0
    this.totalQty = typeof basketLocalStorage.totalQty != 'undefined' ? basketLocalStorage.totalQty: 0
    this.payment = typeof basketLocalStorage.payment != 'undefined' ? basketLocalStorage.payment: {}
    this.discount = typeof basketLocalStorage.discount != 'undefined' ? basketLocalStorage.discount: {"discount": 0}
    this.table = typeof basketLocalStorage.table != 'undefined' ? basketLocalStorage.table: {}
    this.guest = typeof basketLocalStorage.guest != 'undefined' ? basketLocalStorage.guest: {}
    this.numberOfGuest = typeof basketLocalStorage.numberOfGuest != 'undefined' ? basketLocalStorage.numberOfGuest: 0
  }

  clear() {
    BasketLocalStorage.clear()
    this.calculateTotal()
    this.calculateDiscount()
    this.discount = {"discount": 0}
    this.numberOfGuest = 0
  }

  calculateTotal() {
    this.totalPrice = this.items.map(item => item.discount > 0 ? item.priceAfterDiscount : item.total).reduce((a, b) => a + b, 0)
    this.totalQty = this.items.map(item => item.qty).reduce((a, b) => a + b, 0)
  }

  addItem(_item) {
    let exist = this.items.filter(item => item.id === _item.id)

    if (exist.length) {
      this.items = this.items.map((item) => {
        if (_item.id === item.id) {
          item.qty += 1
          item.total = item.price * item.qty
          this.calculateDiscountItem(item.id)
        }

        return item
      })
    } else {
      _item = { ..._item, qty: 1, total: _item.price, discount: 0, note: "", priceAfterDiscount: 0 }

      this.items = [...this.items, _item]
    }

    this.calculateDiscountItem(_item.id)
    this.calculateTotal()
    this.calculateDiscount()
    BasketLocalStorage.save(this)
  }

  qtyHandler(id, _type = '+') {
    this.items = this.items.map((item) => {
      if (id == item.id) {
        if (_type === '+') item.qty += 1
        else item.qty -= 1

        item.total = item.price * item.qty
      }

      return item
    })

    this.items = this.items.filter((item) => item.qty > 0)

    this.calculateDiscountItem(id)
    this.calculateTotal()
    this.calculateDiscount()
    BasketLocalStorage.save(this)
  }

  discAndNoteHandler(id, discount, note) {
    this.items = this.items.map((item) => {
      if(id == item.id) {
        item.discount = discount
        item.note = note
      }

      return item
    })

    this.calculateDiscountItem(id)
    BasketLocalStorage.save(this)
  }

  calculateDiscountItem(id) {
    let subTotal = 0
    let priceAfterDiscount = 0

    this.items = this.items.map((item) => {
      let price = item.total 
      if(id == item.id && item.discount > 0) {
        subTotal = (item.discount / 100) * price
        priceAfterDiscount = price - subTotal
        item.priceAfterDiscount = Math.floor(priceAfterDiscount)
      }

      return item

    })

    this.calculateTotal()
    this.calculateDiscount()
    BasketLocalStorage.save(this)
  } 

  calculateDiscount() {
    let price = this.totalPrice
    let totalDisc = 0
    let totalAfterDisc = 0

    if(parseInt(this.discount.discount_type) === 0)
    {
      totalDisc = (this.discount.discount / 100) * price
      totalAfterDisc = price - totalDisc
      totalAfterDisc = Math.floor(totalAfterDisc)

      this.totalDiscount = totalDisc
      this.totalAfterDiscount = totalAfterDisc

      BasketLocalStorage.save(this)
    }
    else
    {
      totalDisc = this.discount.discount
      totalAfterDisc = price - this.discount.discount

      this.totalDiscount = totalDisc
      this.totalAfterDiscount = totalAfterDisc

      BasketLocalStorage.save(this)
    }
  }

  removeItem(id) {
    this.items = this.items.filter((item) => item.id !== id)

    this.calculateDiscountItem(id)
    this.calculateTotal()
    this.calculateDiscount()
    BasketLocalStorage.save(this)
  }

  setDiscount(disc) {
    this.discount = disc

    BasketLocalStorage.save(this)
    this.calculateDiscount()
  }

  setType(type) {
    this.type = type

    BasketLocalStorage.save(this)
  }

  setPayment(payment) {
    this.payment = payment

    BasketLocalStorage.save(this)
  }

  setTable(table) {
    this.table = table

    BasketLocalStorage.save(this)
  }

  setGuest(guest) {
    this.guest = guest

    BasketLocalStorage.save(this)
  }

  setNumberOfGuest(number) {
    this.numberOfGuest = number

    BasketLocalStorage.save(this)
  }
}

export default BasketService