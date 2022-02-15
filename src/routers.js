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
import {MustSelectTypeMiddleware, MustHaveSelectedItemsMiddleware, MustSelectedPaymentTypeMiddleware, MustSelectedRoomOrTableMiddleware, MustNotSelectItemMiddleware} from './middlewares/PosMiddleware';
import {MustOpenShiftMidlleware, MustCloseShiftMiddleware} from "./middlewares/ShiftMiddleware"
import PosPayment from "./pages/PosPayment"
import PosPaymentCash from "./pages/PosPaymentCash"
import Report from './pages/Report'
import Other from './pages/Other'
import PosPaymentFinish from "./pages/PosPaymentFinish"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import ShiftOpen from "./pages/ShiftOpen"
import ShiftClose from "./pages/ShiftClose"
import PosTable from "./pages/PosTable"
import TransactionFilter from "./pages/TransactionFilter"
import PosGuest from "./pages/PosGuest"
import TransactionDetail from "./pages/TransactionDetail"

const routers = [
  { path: "/", view: Home, middlewares: [MustLoginMidlleware] },
  { path: "/login", view: Login, middlewares: [MustNotLoginMidlleware, MustChooseHotelMidlleware] },
  { path: "/setup", view: Setup, middlewares: [MustNotChooseHotelMidlleware] },
  { path: "/transaction", view: Transaction, middlewares: [MustLoginMidlleware] },
  { path: "/transaction/filter", view: TransactionFilter, middlewares: [MustLoginMidlleware] },
  { path: "/transaction/detail", view: TransactionDetail, middlewares: [MustLoginMidlleware] },
  { path: "/shift/open", view: ShiftOpen, middlewares: [MustLoginMidlleware, MustCloseShiftMiddleware] },
  { path: "/shift/close", view: ShiftClose, middlewares: [MustLoginMidlleware, MustOpenShiftMidlleware] },
  { path: "/pos", view: Pos, middlewares: [MustLoginMidlleware, MustSelectTypeMiddleware] },
  { path: "/pos/type", view: PosType, middlewares: [MustLoginMidlleware, MustOpenShiftMidlleware, MustNotSelectItemMiddleware] },
  { path: "/pos/basket", view: PosBasket, middlewares: [MustLoginMidlleware, MustHaveSelectedItemsMiddleware] },
  { path: "/pos/table", view: PosTable, middlewares: [MustLoginMidlleware, MustHaveSelectedItemsMiddleware] },
  { path: "/pos/guest", view: PosGuest, middlewares: [MustLoginMidlleware, MustHaveSelectedItemsMiddleware] },
  { path: "/pos/payment", view: PosPayment, middlewares: [MustLoginMidlleware, MustSelectedRoomOrTableMiddleware] },
  { path: "/pos/payment/cash", view: PosPaymentCash, middlewares: [MustLoginMidlleware, MustSelectedPaymentTypeMiddleware] },
  { path: "/pos/payment/finish", view: PosPaymentFinish, middlewares: [MustLoginMidlleware] },
  { path: "/report", view: Report, middlewares: [MustLoginMidlleware] },
  { path: "/other", view: Other, middlewares: [MustLoginMidlleware] },
  { path: "/profile", view: Profile, middlewares: [MustLoginMidlleware] },
  { path: "/settings", view: Settings, middlewares: [MustLoginMidlleware] },
]

export default routers