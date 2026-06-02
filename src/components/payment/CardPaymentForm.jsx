export default function CardPaymentForm({ values, onChange }) {
  return (
    <div className="checkout-panel">
      <div className="checkout-payment-head">
        <h2 className="checkout-panel-title">Thông Tin Thẻ</h2>
        <div className="checkout-card-brands">
          <span>VISA</span>
          <span>MC</span>
          <span>JCB</span>
        </div>
      </div>

      <div className="checkout-field" style={{ marginBottom: '16px' }}>
        <label htmlFor="card-cardholder-name">Tên chủ thẻ</label>
        <input
          id="card-cardholder-name"
          name="cardholderName"
          value={values.cardholderName}
          onChange={onChange}
          placeholder="Tên như trên thẻ"
          required
        />
      </div>

      <div className="checkout-field" style={{ marginBottom: '16px' }}>
        <label htmlFor="card-number">Số thẻ</label>
        <div className="checkout-card-input">
          <input
            id="card-number"
            name="cardNumber"
            value={values.cardNumber}
            onChange={onChange}
            placeholder="0000 0000 0000 0000"
            required
          />
          <span className="material-symbols-outlined">lock</span>
        </div>
      </div>

      <div className="checkout-form-grid checkout-form-grid-tight">
        <div className="checkout-field">
          <label htmlFor="card-expiry">Ngày hết hạn</label>
          <input
            id="card-expiry"
            name="expiryDate"
            value={values.expiryDate}
            onChange={onChange}
            placeholder="MM / YY"
            required
          />
        </div>
        <div className="checkout-field">
          <label htmlFor="card-cvv">CVV</label>
          <input
            id="card-cvv"
            name="cvv"
            value={values.cvv}
            onChange={onChange}
            placeholder="123"
            required
          />
        </div>
      </div>
    </div>
  )
}
