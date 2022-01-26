import Home from "./pages/Home"
import Login from "./pages/Login"
import Setup from "./pages/Setup"
import Transaction from "./pages/Transaction"
import Pos from "./pages/Pos"
import PosType from "./pages/PosType"
import PosBasket from './pages/PosBasket'
import MustLoginMidlleware from "./middlewares/MustLoginMiddleware"
import MustNotLoginMidlleware from "./middlewares/MustNotLoginMiddleware"
import { 
  MustChooseHotelMidlleware, MustNotChooseHotelMidlleware
} from './middlewares/SetupMiddleware'
import {MustSelectTypeMiddleware, MustHaveSelectedItemsMiddleware, MustSelectedPaymentTypeMiddleware, MustSelectedRoomOrTableMiddleware} from './middlewares/PosMiddleware';
import PosPayment from "./pages/PosPayment"
import PosPaymentCash from "./pages/PosPaymentCash"
import Report from './pages/Report'
import Other from './pages/Other'
import PosPaymentFinish from "./pages/PosPaymentFinish"

const routers = [
  { path: "/", view: Home, middlewares: [MustLoginMidlleware] },
  { path: "/login", view: Login, middlewares: [MustNotLoginMidlleware, MustChooseHotelMidlleware] },
  { path: "/setup", view: Setup, middlewares: [MustNotChooseHotelMidlleware] },
  { path: "/transaction", view: Transaction, middlewares: [MustLoginMidlleware] },
  { path: "/pos", view: Pos, middlewares: [MustLoginMidlleware, MustSelectTypeMiddleware] },
  { path: "/pos/type", view: PosType, middlewares: [MustLoginMidlleware] },
  { path: "/pos/basket", view: PosBasket, middlewares: [MustLoginMidlleware, MustHaveSelectedItemsMiddleware] },
  { path: "/pos/payment", view: PosPayment, middlewares: [MustLoginMidlleware, MustSelectedRoomOrTableMiddleware] },
  { path: "/pos/payment/cash", view: PosPaymentCash, middlewares: [MustLoginMidlleware, MustSelectedPaymentTypeMiddleware] },
  { path: "/pos/payment/finish", view: PosPaymentFinish, middlewares: [MustLoginMidlleware] },
  { path: "/report", view: Report, middlewares: [MustLoginMidlleware] },
  { path: "/other", view: Other, middlewares: [MustLoginMidlleware] },
]

export default routers