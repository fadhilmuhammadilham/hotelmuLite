import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage"
import ShiftLocalStorage from "../repositories/localstorage/ShiftLocalStorage"

class BasketService {
  constructor() {
    const basketLocalStorage = BasketLocalStorage.getAll()

    this.id = typeof basketLocalStorage.id != 'undefined' ? basketLocalStorage.id : 0;
    this.shift = typeof basketLocalStorage.shift != 'undefined' ? basketLocalStorage.shift : ShiftLocalStorage.getAll()
    this.type = typeof basketLocalStorage.type != 'undefined' ? basketLocalStorage.type : {}
    this.items = typeof basketLocalStorage.items != 'undefined' ? basketLocalStorage.items : []
    this.total = typeof basketLocalStorage.total != 'undefined' ? basketLocalStorage.total : 0
    this.totalSub = typeof basketLocalStorage.totalSub != 'undefined' ? basketLocalStorage.totalSub : 0
    this.totalRound = typeof basketLocalStorage.totalRound != 'undefined' ? basketLocalStorage.totalRound : 0
    this.totalDiscount = typeof basketLocalStorage.totalDiscount != 'undefined' ? basketLocalStorage.totalDiscount : 0
    this.totalQty = typeof basketLocalStorage.totalQty != 'undefined' ? basketLocalStorage.totalQty : 0
    this.payment = typeof basketLocalStorage.payment != 'undefined' ? basketLocalStorage.payment : {}
    this.discount = typeof basketLocalStorage.discount != 'undefined' ? basketLocalStorage.discount : { "discount": 0 }
    this.table = typeof basketLocalStorage.table != 'undefined' ? basketLocalStorage.table : {}
    this.guest = typeof basketLocalStorage.guest != 'undefined' ? basketLocalStorage.guest : {}
    this.numberOfGuest = typeof basketLocalStorage.numberOfGuest != 'undefined' ? basketLocalStorage.numberOfGuest : 0
  }

  clear() {
    BasketLocalStorage.clear()
    this.calculateTotal()
    this.calculateDiscount()
    this.calculateRound()
    this.discount = { "discount": 0 }
    this.numberOfGuest = 0
  }

  calculateTotal() {
    this.totalSub = this.items.map(item => item.discount > 0 ? item.total : item.totalSub).reduce((a, b) => a + b, 0)
    this.total = this.totalSub
    this.totalQty = this.items.map(item => item.qty).reduce((a, b) => a + b, 0)
  }

  calculateRound() {
    this.totalRound = this.round(this.total, 100)
    if (this.totalRound > 0) this.total = this.total + this.totalRound
  }

  round(payment, multiple) {
    let round = payment
    let remains = payment % multiple

    if (remains < multiple && remains > 0) {
      let min = multiple - remains
      round = payment + min
    }

    round = parseFloat(round.toFixed(2))

    return parseFloat((round - payment).toFixed(2))
  }

  addItem(_item) {
    let exist = this.items.filter(item => item.id === _item.id)

    if (exist.length) {
      this.items = this.items.map((item) => {
        if (_item.id === item.id) {
          item.qty += 1
          item.totalSub = item.price * item.qty

          this.calculateDiscountItem(item.id)
        }

        return item
      })
    } else {
      _item = { ..._item, qty: 1, totalSub: _item.price, total: _item.price, discount: 0, note: "" }

      this.items = [...this.items, _item]
    }

    this.calculateDiscountItem(_item.id)
    this.calculateTotal()
    this.calculateDiscount()
    this.calculateRound()
    BasketLocalStorage.save(this)
  }

  qtyHandler(id, _type = '+') {
    this.items = this.items.map((item) => {
      if (id == item.id) {
        if (_type === '+') item.qty += 1
        else item.qty -= 1

        item.totalSub = item.price * item.qty
      }

      return item
    })

    this.items = this.items.filter((item) => item.qty > 0)

    this.calculateDiscountItem(id)
    this.calculateTotal()
    this.calculateDiscount()
    this.calculateRound()
    BasketLocalStorage.save(this)
  }

  discAndNoteHandler(id, discount, note) {
    this.items = this.items.map((item) => {
      if (id == item.id) {
        item.discount = discount
        item.note = note
      }

      return item
    })

    this.calculateDiscountItem(id)
    BasketLocalStorage.save(this)
  }

  calculateDiscountItem(id) {
    this.items = this.items.map((item) => {
      item.total = item.totalSub
      if (item.discount > 0) {
        item.total = parseFloat((item.totalSub - ((item.discount / 100) * item.totalSub)).toFixed(2))
      }

      return item
    })

    this.calculateTotal()
    this.calculateDiscount()
    this.calculateRound()
    BasketLocalStorage.save(this)
  }

  calculateDiscount() {
    let totalDisc = 0
    let totalAfterDisc = 0

    if (parseInt(this.discount.discount_type) === 0) {
      totalDisc = parseFloat(((this.discount.discount / 100) * this.totalSub).toFixed(2))
      totalAfterDisc = parseFloat((this.totalSub - totalDisc).toFixed(2))
    }
    else {
      totalDisc = this.discount.discount
      totalAfterDisc = this.totalSub - this.discount.discount
    }

    this.totalDiscount = totalDisc
    this.total = totalAfterDisc

    BasketLocalStorage.save(this)
  }

  removeItem(id) {
    this.items = this.items.filter((item) => item.id !== id)

    this.calculateDiscountItem(id)
    this.calculateTotal()
    this.calculateDiscount()
    this.calculateRound()
    BasketLocalStorage.save(this)
  }

  setId(id) {
    this.id = id

    BasketLocalStorage.save(this)
  }

  setTrxNumber(trxNumber) {
    this.trxNumber = trxNumber

    BasketLocalStorage.save(this)
  }

  setDiscount(disc) {
    this.discount = disc
    BasketLocalStorage.save(this)

    this.calculateDiscount()
    this.calculateRound()
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