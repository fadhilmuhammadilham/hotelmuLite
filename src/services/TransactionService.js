import TransactionLocalStorage from "../repositories/localstorage/TransactionLocalStorage";

class TransactionService {
    constructor() {
        const transactionLocalStorage = TransactionLocalStorage.getAll()

        this.id = transactionLocalStorage.id
        this.discount = {
            'discount_type': transactionLocalStorage.discounttype,
            'discount': transactionLocalStorage.discount,
            'discount_note': transactionLocalStorage.discountketerangan
        }
        this.guest = {}
        this.guest_id = transactionLocalStorage.guest_id
        this.guest_name = transactionLocalStorage.guest_name
        this.outlet_id = transactionLocalStorage.outlet_id
        this.items = transactionLocalStorage.items
        this.total_prices = parseFloat(transactionLocalStorage.total_prices)
        this.totalqty = parseInt(transactionLocalStorage.totalqty)
        this.totalDiscount = typeof transactionLocalStorage.totalDiscount != 'undefined' ? transactionLocalStorage.totalDiscount: 0
        this.totalAfterDiscount = typeof transactionLocalStorage.totalAfterDiscount != 'undefined' ? transactionLocalStorage.totalAfterDiscount: 0
        this.number_of_guest = transactionLocalStorage.number_of_guest
        this.table_id = transactionLocalStorage.table_id
        this.outlet_id = transactionLocalStorage.outlet_id
        this.payment = transactionLocalStorage.payment
        this.status = transactionLocalStorage.status
        this.trx_date = transactionLocalStorage.trx_date
        this.trx_number = transactionLocalStorage.trx_number
    }

    clear() {
        TransactionLocalStorage.removeAll()
        this.calculateTotal()
        this.calculateDiscount()
        this.discount = {"discount": 0}
        this.numberOfGuest = 0
    }

    calculateTotal() {
        this.total_prices = this.items.map(item => item.disc > 0 ? item.priceAfterDiscount : item.total).reduce((a, b) => a + b, 0)
        this.totalqty = this.items.map(item => item.qty).reduce((a, b) => a + b, 0)
    }

    initiateBasket() {
        this.items = this.items.map((item) => {
            if(item.disc > 0){
                this.calculateDiscountItem(item.id)
            }
            item.priceAfterDiscount = 0

            return item
        })

        TransactionLocalStorage.set(this)
    }

    addItem(_item) {
        let exist = this.items.filter(item => item.id === _item.id)

        if (exist.length) {
            this.items = this.items.map((item) => {
                if(_item.id === item.id) {
                    item.qty += 1
                    item.total = item.price * item.qty
                    item.note = _item.note
                }

                return item
            })
        } else {
            _item = { id: _item.id, name: _item.name, qty: 1, price: _item.price, disc: 0, note: "", total: _item.price, priceAfterDiscount: 0}

            this.items = [...this.items, _item]
        }

        this.calculateDiscountItem(_item.id)
        this.calculateTotal()
        this.calculateDiscount()
        TransactionLocalStorage.set(this)
    }

    qtyHandler(id, _type = '+') {
        this.items = this.items.map((item) => {
            if(id == item.id) {
                if(_type === '+') item.qty += 1
                else item.qty -= 1

                item.total = item.price * item.qty
            }

            return item
        })

        this.items = this.items.filter((item) => item.qty > 0)

        this.calculateDiscountItem(id)
        this.calculateTotal()
        this.calculateDiscount()
        TransactionLocalStorage.set(this)
    }
 
    discAndNoteHandler(id, discount, note) {
        this.items = this.items.map((item) => {
            if(id == item.id) {
                item.disc = discount
                item.note = note
            }

            return item
        })

        this.calculateDiscountItem(id)
        TransactionLocalStorage.set(this)
    }

    calculateDiscountItem(id) {
        let subTotal = 0
        let priceAfterDiscount = 0

        this.items = this.items.map((item) => {
            let price = item.total
            if(id == item.id && item.disc > 0) {
                subTotal = (item.disc / 100) * price
                priceAfterDiscount = price - subTotal
                item.priceAfterDiscount = Math.floor(priceAfterDiscount)
            }

            return item
        })

        this.calculateTotal()
        this.calculateDiscount()
        TransactionLocalStorage.set(this)
    }

    calculateDiscount() {
        let price = this.total_prices
        let totalDisc = 0
        let totalAfterDisc = 0

        if(parseInt(this.discount.discount_type) === 0)
        {
            totalDisc = (this.discount.discount / 100) * price
            totalAfterDisc = price - totalDisc
            totalAfterDisc = Math.floor(totalAfterDisc)

            this.totalDiscount = totalDisc
            this.totalAfterDiscount = totalAfterDisc

            TransactionLocalStorage.set(this)
        }
        else
        {
            totalDisc = this.discount.discount
            totalAfterDisc = price - this.discount.discount

            this.totalDiscount = totalDisc
            this.totalAfterDiscount = totalAfterDisc

            TransactionLocalStorage.set(this)
        }
    }

    removeItem(id) {
        this.items = this.items.filter((item) => item.id !== id)

        this.calculateDiscountItem(id)
        this.calculateTotal()
        this.calculateDiscount()
        TransactionLocalStorage.set(this)
    }

    setDiscount(disc) {
        this.discount = disc

        TransactionLocalStorage.set(this)
        this.calculateDiscount()
    }

    setGuest(number) {
        this.numberOfGuest = number

        TransactionLocalStorage.set(this)
    }

    setTable(table) {
        this.table_id = table
        
        TransactionLocalStorage.set(this)
    }

    setPayment(payment) {
        this.payment = payment
        
        TransactionLocalStorage.set(this)
    }

    setGuest(guest) {
        this.guest = guest

        TransactionLocalStorage.set(this)
    }
}

export default TransactionService