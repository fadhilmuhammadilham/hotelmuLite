import Home from "./pages/home"

const routers = [
  { path: "/", view: Home, middlewares: []}
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
//   { path: "/profile", view: Profile, middlewares: [MustLoginMidlleware] },
//   { path: "/settings", view: Settings, middlewares: [MustLoginMidlleware] },
// ]

export default routers