;; Token Swap Contract - Simple AMM-style token swapping
;; Built with @stacks/transactions

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INSUFFICIENT_BALANCE (err u101))
(define-constant ERR_INVALID_AMOUNT (err u102))

;; Data vars
(define-data-var swap-count uint u0)
(define-data-var total-volume uint u0)
(define-data-var fee-percent uint u3) ;; 0.3%

;; Maps
(define-map swaps uint {
  sender: principal,
  amount-in: uint,
  amount-out: uint,
  timestamp: uint
})

(define-map liquidity principal uint)

;; Read-only functions
(define-read-only (get-swap-count)
  (var-get swap-count))

(define-read-only (get-total-volume)
  (var-get total-volume))

(define-read-only (get-swap (id uint))
  (map-get? swaps id))

(define-read-only (get-liquidity (provider principal))
  (default-to u0 (map-get? liquidity provider)))

(define-read-only (get-fee-percent)
  (var-get fee-percent))

;; Calculate output amount (simple constant product)
(define-read-only (calculate-output (amount-in uint) (reserve-in uint) (reserve-out uint))
  (let (
    (fee (/ (* amount-in (var-get fee-percent)) u1000))
    (amount-after-fee (- amount-in fee))
    (output (/ (* amount-after-fee reserve-out) (+ reserve-in amount-after-fee)))
  )
    output))

;; Public functions
(define-public (add-liquidity (amount uint))
  (begin
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set liquidity tx-sender (+ (get-liquidity tx-sender) amount))
    (ok amount)))

(define-public (swap-stx (amount-in uint))
  (let (
    (new-id (+ (var-get swap-count) u1))
    (output (calculate-output amount-in u1000000 u1000000))
  )
    (asserts! (> amount-in u0) ERR_INVALID_AMOUNT)
    (try! (stx-transfer? amount-in tx-sender (as-contract tx-sender)))
    (map-set swaps new-id {
      sender: tx-sender,
      amount-in: amount-in,
      amount-out: output,
      timestamp: block-height
    })
    (var-set swap-count new-id)
    (var-set total-volume (+ (var-get total-volume) amount-in))
    (ok {id: new-id, output: output})))
