import PilihReservasi from "./pages/PilihReservasi"
import Checkin from "./pages/Checkin"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Setting from "./pages/Settings"
import inventory from "./pages/inventory"
import TentativeReservasi from "./pages/TentativeReservasi"
import GuaranteedReservasi from "./pages/GuaranteedReservasi"
import VoidReservasi from "./pages/VoidReservasi"
import DetailVoid from "./pages/DetailVoid"
import Kasir from "./pages/Kasir"
import DetailKasir from "./pages/DetailKasir"
import ReservasiList from "./pages/ReservasiList"
import DetailList from "./pages/DetailList"
import GuestInHouse from "./pages/GuestInHouse"
import GuestDetail from "./pages/DetailGuest"
import Login from "./pages/Login"
import LoginUser from "./pages/LoginUser"
import DetailProfile from "./pages/DetailProfile"
import RoomType from "./pages/RoomType"
import DetailRoomType from "./pages/DetailRoomType"
import RatesType from "./pages/RatesType"

const routers = [
  { path: "/", view: Login, middlewares: [] },
  { path: "/login-user", view: LoginUser, middlewares: [] },
  { path: "/homepage", view: Home, middlewares: []},
  { path: "/checkin", view: Checkin, middlewares: []},
  { path: "/settings", view: Setting, middlewares: []},
  { path: "/profil", view: Profile, middlewares: []},
  { path: "/inventory", view: inventory, middlewares: []},
  { path: "/pilih-reservasi", view: PilihReservasi, middlewares: []},
  { path: "/tentative-reservasi", view: TentativeReservasi, middlewares: []},
  { path: "/guaranteed-reservasi", view: GuaranteedReservasi, middlewares: []},
  { path: "/void-reservasi", view: VoidReservasi, middlewares: []},
  { path: "/detail-void", view: DetailVoid, middlewares: []},
  { path: "/kasir", view: Kasir, middlewares: []},
  { path: "/detail-kasir", view: DetailKasir, middlewares: []},
  { path: "/reservasi-list", view: ReservasiList, middlewares: [] },
  { path: "/detail-list", view: DetailList, middlewares: [] },
  { path: "/guest-in-house", view: GuestInHouse, middlewares: [] },
  { path: "/detail-guest", view: GuestDetail, middlewares: [] },
  { path: "/detail-profile", view: DetailProfile, middlewares: [] },
  { path: "/room-type", view: RoomType, middlewares: [] },
  { path: "/detail-room-type", view: DetailRoomType, middlewares: [] },
  { path: "/rates-type", view: RatesType, middlewares: [] },
]

// const routers = [
//   { path: "/", view: Home, middlewares: [MustLoginMidlleware] },
//   { path: "/login", view: Login, middlewares: [MustNotLoginMidlleware, MustChooseHotelMidlleware] },
//   { path: "/setup", view: Setup, middlewares: [MustNotChooseHotelMidlleware] },
//   { path: "/transaction", view: Transaction, middlewares: [MustLoginMidlleware] },
//   { path: "/transaction/filter", view: TransactionFilter, middlewares: [MustLoginMidlleware] },
//   { path: "/transaction/:id", view: TransactionDetail, middlewares: [MustLoginMidlleware] },
//   { path: "/shift/open", view: ShiftOpen, middlewares: [MustLoginMidlleware, MustCloseShiftMiddleware] },
//   { path: "/shift/close", view: ShiftClose, middlewares: [MustLoginMidlleware, MustOpenShiftMidlleware] },
//   { path: "/pos", view: Pos, middlewares: [MustLoginMidlleware, MustSelectTypeMiddleware] },
//   { path: "/pos/type", view: PosType, middlewares: [MustLoginMidlleware, MustOpenShiftMidlleware, MustNotSelectItemMiddleware] },
//   { path: "/pos/basket", view: PosBasket, middlewares: [MustLoginMidlleware, MustHaveSelectedItemsMiddleware, MustHaveTransactionReadyMiddleware] },
//   { path: "/pos/table", view: PosTable, middlewares: [MustLoginMidlleware, MustHaveSelectedItemsMiddleware] },
//   { path: "/pos/payment", view: PosPayment, middlewares: [MustLoginMidlleware, MustHaveTransactionReadyMiddleware, TransactionValidateMiddleware] },
//   { path: "/pos/payment/cash", view: PosPaymentCash, middlewares: [MustLoginMidlleware, MustHaveTransactionReadyMiddleware, MustSelectedPaymentTypeMiddleware] },
//   { path: "/pos/payment/debit", view: PosPaymentDebit, middlewares: [MustLoginMidlleware, MustHaveTransactionReadyMiddleware, MustSelectedPaymentTypeMiddleware] },
//   { path: "/pos/payment/debit/edc", view: PosEDC, middlewares: [MustLoginMidlleware, MustSelectedPaymentTypeMiddleware] },
//   { path: "/pos/payment/guest", view: PosGuest, middlewares: [MustLoginMidlleware, MustHaveTransactionReadyMiddleware, MustHaveSelectedItemsMiddleware] },
//   { path: "/pos/payment/finish/:transaction_id", view: PosPaymentFinish, middlewares: [MustLoginMidlleware] },
//   { path: "/pos/draft", view: PosDraft, middlewares: [MustLoginMidlleware, MustOpenShiftMidlleware, MustHaveTransactionReadyMiddleware] },
//   { path: "/pos/draft/basket", view: PosBasketDraft, middlewares: [MustLoginMidlleware, MustHaveTransactionReadyMiddleware] },
//   { path: "/report", view: Report, middlewares: [MustLoginMidlleware] },
//   { path: "/report/monthly", view: ReportMonthly, middlewares: [MustLoginMidlleware] },
//   { path: "/report/annual", view: ReportAnnual, middlewares: [MustLoginMidlleware] },
//   { path: "/other", view: Other, middlewares: [MustLoginMidlleware] },
//   { path: "/settings", view: Settings, middlewares: [MustLoginMidlleware] },
// ]

export default routers