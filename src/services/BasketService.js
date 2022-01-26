import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage"

class BasketService {
  constructor() {
    const basketLocalStorage = BasketLocalStorage.getAll()
    
    this.type = typeof basketLocalStorage.type != 'undefined' ? basketLocalStorage.type: {}
    this.items = typeof basketLocalStorage.items != 'undefined' ? basketLocalStorage.items: []
    this.totalPrice = typeof basketLocalStorage.totalPrice != 'undefined' ? basketLocalStorage.totalPrice: 0
    this.totalQty = typeof basketLocalStorage.totalQty != 'undefined' ? basketLocalStorage.totalQty: 0
    this.payment = typeof basketLocalStorage.payment != 'undefined' ? basketLocalStorage.payment: {}

  }

  clear() {
    BasketLocalStorage.clear()
    this.calculateTotal()
  }

  calculateTotal() {
    this.totalPrice = this.items.map(item => item.total).reduce((a, b) => a + b, 0)
    this.totalQty = this.items.map(item => item.qty).reduce((a, b) => a + b, 0)
  }

  addItem(_item) {
    let exist = this.items.filter(item => item.id === _item.id)

    if (exist.length) {
      this.items = this.items.map((item) => {
        if (_item.id === item.id) {
          item.qty += 1
          item.total = item.price * item.qty
        }

        return item
      })
    } else {
      _item = { ..._item, qty: 1, total: _item.price }

      this.items = [...this.items, _item]
    }

    this.calculateTotal()
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

    this.calculateTotal()
    BasketLocalStorage.save(this)
  }

  removeItem(id) {
    this.items = this.items.filter((item) => item.id !== id)

    this.calculateTotal()
    BasketLocalStorage.save(this)
  }

  setType(type) {
    this.type = type

    BasketLocalStorage.save(this)
  }

  setPayment(payment) {
    this.payment = payment

    BasketLocalStorage.save(this)
  }
}

export default BasketService