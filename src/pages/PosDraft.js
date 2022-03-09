import Page from "./Page";
import $ from "jquery";
import ItemApi from "../repositories/api/ItemApi";
import posView from "../templates/pos-draft.handlebars"
import posItemView from '../templates/pos-item.handlebars'
import posCategoryView from '../templates/pos-nav-cat.handlebars'
import posBasketView from '../templates/pos-basket-draft.handlebars'
import TransactionLocalStorage from "../repositories/localstorage/TransactionLocalStorage";
import TransactionService from "../services/TransactionService";
import TransactionApi from "../repositories/api/TransactionApi";

class PosDraft extends Page {
    constructor(params) {
        super(params)
    }

    async getItems() {
        try{
            let res = await ItemApi.getFromTransaction()

            return res.data
        }catch(error) {
            console.log(error);
        }
    }

    async addItems(item) {
        try {
            let res = await TransactionApi.addItem(item)

            return res.status
        } catch (error) {
            console.log(error);
        }
    }

    async updateItem(item_id, item, disc) {
        try {
            let res = await TransactionApi.updateItem(item_id, item, disc)

            return res.status
        } catch (error) {
            console.log(error);            
        }
    }

    async deleteItem(item_id) {
        try {
            let res = await TransactionApi.deleteItem(item_id)

            return res.status
        } catch (error) {
            console.log(error);            
        }
    }

    async action() {
        const transactionService = new TransactionService()
        const dataItems = await this.getItems()
        const transaction = TransactionLocalStorage.getAll();

        const itemsFormat = (items) => {
            let cats = []
            
            for (const item of items) {
                let catIndex = cats.findIndex((cat) => cat.id == item.category.id)

                if(catIndex >= 0) cats[catIndex].products.push(item)
                else cats.push({
                    id: item.category.id,
                    name: item.category.name,
                    products: [item]
                })
            }

            return cats
        }

        const viewBasket = (transaction) => {
            if(transaction.items.length > 0){
                $('#app').append(posBasketView({qty : transaction.totalqty, totalPrice: transaction.total_prices}))
            } else {
                if($('#cart').length > 0) $('#cart').remove()
            }
        }

        viewBasket(transactionService)

        const viewItem = (items) => {
            items = itemsFormat(items)
            $('#nav-category').html(posCategoryView({ items: items }))
            $('#content-product').html(posItemView({ items: items }))
        }

        viewItem(dataItems)

        $('#searchProduct').on('keyup', () => {
            let searchValue = $('#searchProduct').val()

            if (searchValue.length > 0) $('#eraser-btn').removeClass('d-none')
            else $('#eraser-btn').addClass('d-none')

            let itemsFiltered = dataItems.filter(item => item.name.toLowerCase().match(searchValue.toLocaleLowerCase()))
            viewItem(itemsFiltered)
        })

        $('#eraser-btn').on('click', () => $('#searchProduct').val('').trigger('keyup'))

        $('.search-form').on('submit', (e) => {
            e.preventDefault()
        })

        $('.product').on('click', async (even) => {
            let item_id = $(even.currentTarget).data('id')
            let is_exist = transaction.items.filter(item => item.id === parseInt(item_id))
            let product = dataItems.find((item) => item.id == parseInt(item_id))
        
            if(is_exist.length) 
            {
                transactionService.addItem(product)
                let item = transactionService.items.find((item) => item.id == parseInt(item_id))
                let result = await this.updateItem(item_id, item.qty, item.disc)
                if(result){
                    console.log(result);  
                    viewBasket(transactionService) 
                }
            }
            else
            {
                transactionService.addItem(product)
                let result = await this.addItems(product)
                if(result) {
                    console.log(result);
                    viewBasket(transactionService)
                }
            }
            
        })

        $('#cart').on('click', (e) => {
            transactionService.initiateBasket()
        })
    }


    render() {
        return posView()
    }
}

export default PosDraft