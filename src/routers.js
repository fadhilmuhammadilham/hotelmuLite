import PilihReservasi from "./pages/PilihReservasi"
import Checkin from "./pages/Checkin"
import formReservasi from "./pages/FormReservasi"
import Home from "./pages/Home"
import Kamar from "./pages/KamarCheckin"
import PreviewCheckin from "./pages/PreviewCheckin"
import Profile from "./pages/Profile"
import Setting from "./pages/Settings"
import inventory from "./pages/inventory"
import TentativeReservasi from "./pages/TentativeReservasi"
import GuaranteedReservasi from "./pages/GuaranteedReservasi"
import VoidReservasi from "./pages/VoidReservasi"
import DetailVoid from "./pages/DetailVoid"
import Kasir from "./pages/Kasir"
import DetailKasir from "./pages/DetailKasir"

const routers = [
  { path: "/", view: Home, middlewares: []},
  { path: "/checkin", view: Checkin, middlewares: []},
  { path: "/kamarcheckin", view: Kamar, middlewares: []},
  { path: "/previewcheckin", view: PreviewCheckin, middlewares: []},
  { path: "/formReservasi", view: formReservasi, middlewares: []},
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