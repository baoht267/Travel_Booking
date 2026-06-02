export default function VNPayQR({ amount, reference, confirmed, onConfirmChange }) {
  const qrData = encodeURIComponent(`GOCHIP|VCB|1234567890|GOCHIP TRAVEL|${amount}|${reference}`)
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`

  return (
    <div className="vnpay-panel">
      <div className="vnpay-header">
        <div className="vnpay-brand">
          <span className="material-symbols-outlined">qr_code_2</span>
          <div>
            <span className="vnpay-brand-name">VNPAY</span>
            <span className="vnpay-brand-sub">Quét mã để thanh toán nhanh</span>
          </div>
        </div>
        <div className="vnpay-bank-chips">
          <span>VCB</span>
          <span>VPB</span>
          <span>TCB</span>
          <span>BIDV</span>
          <span>ACB</span>
        </div>
      </div>

      <div className="vnpay-body">
        <div className="vnpay-qr-wrap">
          <div className="vnpay-qr-frame">
            <img src={qrSrc} alt="VNPay QR" className="vnpay-qr-img" />
          </div>
          <div className="vnpay-qr-note">
            <span className="material-symbols-outlined">info</span>
            Mở app ngân hàng, chọn Quét QR để quét mã
          </div>
        </div>

        <div className="vnpay-amount-box">
          <span className="vnpay-amount-label">Số tiền thanh toán</span>
          <span className="vnpay-amount-value">{amount}</span>
          <span className="vnpay-ref">Mã giao dịch: {reference}</span>
        </div>

        <div className="vnpay-divider">
          <span>hoặc chuyển khoản ngân hàng</span>
        </div>

        <div className="vnpay-bank-info">
          <div className="vnpay-bank-row">
            <span>Ngân hàng</span>
            <strong>Vietcombank (VCB)</strong>
          </div>
          <div className="vnpay-bank-row">
            <span>Số tài khoản</span>
            <strong>1234 5678 9012 345</strong>
          </div>
          <div className="vnpay-bank-row">
            <span>Chủ tài khoản</span>
            <strong>GOCHIP TRAVEL JSC</strong>
          </div>
          <div className="vnpay-bank-row">
            <span>Nội dung CK</span>
            <strong>{reference}</strong>
          </div>
        </div>

        <div className="vnpay-steps">
          <div className="vnpay-steps-title">Hướng dẫn thanh toán QR:</div>
          {[
            'Mở ứng dụng ngân hàng hoặc ví điện tử (MoMo, ZaloPay, v.v.)',
            'Chọn tính năng "Quét QR" hoặc "Thanh toán QR"',
            'Quét mã QR ở trên, kiểm tra số tiền và nội dung',
            'Xác nhận thanh toán trong ứng dụng của bạn',
          ].map((text, i) => (
            <div key={i} className="vnpay-step-item">
              <span className="vnpay-step-num">{i + 1}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <label className="vnpay-confirm-label" htmlFor="vnpay-confirm">
          <input
            id="vnpay-confirm"
            type="checkbox"
            checked={confirmed}
            onChange={onConfirmChange}
            required
          />
          <span>
            Tôi đã quét mã QR VNPay / chuyển khoản và <strong>hoàn tất thanh toán</strong> thành công
          </span>
        </label>
      </div>
    </div>
  )
}
