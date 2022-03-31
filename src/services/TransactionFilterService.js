import TransactionFilterLocalStorage from "../repositories/localstorage/TransactionFilterLocalStorage";

class TransactionFilterService {
    constructor() {
        const transactionFilterLocalStorage = TransactionFilterLocalStorage.getAll()

        this.code = typeof transactionFilterLocalStorage.code != 'undefined' ? transactionFilterLocalStorage.code : {}
        this.date = typeof transactionFilterLocalStorage.date != 'undefined' ? transactionFilterLocalStorage.date : {}
        this.status = typeof transactionFilterLocalStorage.status != 'undefined' ? transactionFilterLocalStorage.status : {}
    }

    setStatus(status){
        this.status = status

        TransactionFilterLocalStorage.set(this)
    }

    setCode(code) {
        this.code = code

        TransactionFilterLocalStorage.set(this)
    }

    setDate(date) {
        this.date = date
        
        TransactionFilterLocalStorage.set(this)
    }
}

export default TransactionFilterService