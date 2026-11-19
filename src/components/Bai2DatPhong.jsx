import React, { useState, useMemo } from 'react';
import { BedDouble, Calendar, DollarSign, CheckCircle2, ArrowLeft } from 'lucide-react';

const ROOM_TYPES = [
  { id: 'standard', name: 'Phòng Standard', price: 500000, desc: 'Phòng tiêu chuẩn, tiện nghi cơ bản' },
  { id: 'deluxe', name: 'Phòng Deluxe', price: 800000, desc: 'Phòng sang trọng, tầm nhìn đẹp' },
  { id: 'vip', name: 'Phòng VIP', price: 1500000, desc: 'Phòng cao cấp bậc nhất, ban công riêng' }
];

const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function Bai2DatPhong() {
  const [formData, setFormData] = useState({
    hoTen: '',
    soDienThoai: '',
    email: '',
    ngayNhan: '',
    ngayTra: '',
    loaiPhong: 'standard',
    soLuongPhong: 1,
    soNguoiLon: 1,
    soTreEm: 0,
    anSang: false,
    duaDonSanBay: false,
    giatUi: false
  });

  const [errors, setErrors] = useState({});
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Tính số đêm lưu trú (Chức năng 3)
  const soDem = useMemo(() => {
    if (!formData.ngayNhan || !formData.ngayTra) return 0;
    const start = new Date(formData.ngayNhan);
    const end = new Date(formData.ngayTra);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [formData.ngayNhan, formData.ngayTra]);

  // Tự động tính chi phí (Chức năng 6)
  const calculation = useMemo(() => {
    const selectedRoom = ROOM_TYPES.find(r => r.id === formData.loaiPhong) || ROOM_TYPES[0];
    const tongSoNguoi = Number(formData.soNguoiLon) + Number(formData.soTreEm);
    const phongCount = Number(formData.soLuongPhong) || 1;

    // Tiền phòng = Giá phòng * số phòng * số đêm
    const tienPhong = soDem > 0 ? selectedRoom.price * phongCount * soDem : 0;

    // Tiền dịch vụ
    // Ăn sáng: 100.000đ / người / đêm
    const tienAnSang = (formData.anSang && soDem > 0) ? 100000 * tongSoNguoi * soDem : 0;
    // Đưa đón sân bay: 300.000đ / lần
    const tienDuaDon = formData.duaDonSanBay ? 300000 : 0;
    // Giặt ủi: 50.000đ / người
    const tienGiatUi = formData.giatUi ? 50000 * tongSoNguoi : 0;

    const tienDichVu = tienAnSang + tienDuaDon + tienGiatUi;
    const tongTien = tienPhong + tienDichVu;

    return {
      selectedRoom,
      tongSoNguoi,
      tienPhong,
      tienAnSang,
      tienDuaDon,
      tienGiatUi,
      tienDichVu,
      tongTien
    };
  }, [formData, soDem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.hoTen.trim()) errs.hoTen = 'Vui lòng nhập họ tên khách hàng';

    // Số điện thoại
    const phoneRegex = /^0\d{9}$/;
    if (!formData.soDienThoai.trim()) {
      errs.soDienThoai = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(formData.soDienThoai.trim())) {
      errs.soDienThoai = 'Số điện thoại gồm 10 số (bắt đầu bằng 0)';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Email không hợp lệ';
    }

    // Ngày nhận & trả phòng (Chức năng 1 & 2)
    if (!formData.ngayNhan) {
      errs.ngayNhan = 'Vui lòng chọn ngày nhận phòng';
    }
    if (!formData.ngayTra) {
      errs.ngayTra = 'Vui lòng chọn ngày trả phòng';
    } else if (formData.ngayNhan) {
      const start = new Date(formData.ngayNhan);
      const end = new Date(formData.ngayTra);
      if (end <= start) {
        errs.ngayTra = 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày';
      }
    }

    if (formData.soLuongPhong < 1) errs.soLuongPhong = 'Số lượng phòng tối thiểu là 1';
    if (formData.soNguoiLon < 1) errs.soNguoiLon = 'Cần ít nhất 1 người lớn';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDatPhong = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsConfirmed(true);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <BedDouble className="text-primary" /> Bài 2: Web Đặt Phòng Khách Sạn
      </h2>
      <p className="card-subtitle">Hệ thống tính toán chi phí và xác nhận đặt phòng trực tuyến</p>

      {!isConfirmed ? (
        <form onSubmit={handleDatPhong}>
          {/* Thông tin khách hàng */}
          <fieldset className="form-section">
            <legend>Thông tin khách hàng</legend>
            <div className="form-row">
              <div className="form-group">
                <label>Họ và tên khách hàng <span className="required">*</span></label>
                <input
                  type="text"
                  name="hoTen"
                  placeholder="Nguyễn Văn B"
                  value={formData.hoTen}
                  onChange={handleChange}
                  className={errors.hoTen ? 'input-error' : ''}
                />
                {errors.hoTen && <div className="error-msg">{errors.hoTen}</div>}
              </div>

              <div className="form-group">
                <label>Số điện thoại <span className="required">*</span></label>
                <input
                  type="text"
                  name="soDienThoai"
                  placeholder="0901234567"
                  value={formData.soDienThoai}
                  onChange={handleChange}
                  className={errors.soDienThoai ? 'input-error' : ''}
                />
                {errors.soDienThoai && <div className="error-msg">{errors.soDienThoai}</div>}
              </div>

              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="khachhang@hotel.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <div className="error-msg">{errors.email}</div>}
              </div>
            </div>
          </fieldset>

          {/* Thời gian và Số lượng phòng/khách */}
          <fieldset className="form-section">
            <legend>Chi tiết đặt phòng</legend>
            <div className="form-row">
              <div className="form-group">
                <label>Ngày nhận phòng <span className="required">*</span></label>
                <input
                  type="date"
                  name="ngayNhan"
                  value={formData.ngayNhan}
                  onChange={handleChange}
                  className={errors.ngayNhan ? 'input-error' : ''}
                />
                {errors.ngayNhan && <div className="error-msg">{errors.ngayNhan}</div>}
              </div>

              <div className="form-group">
                <label>Ngày trả phòng <span className="required">*</span></label>
                <input
                  type="date"
                  name="ngayTra"
                  value={formData.ngayTra}
                  onChange={handleChange}
                  className={errors.ngayTra ? 'input-error' : ''}
                />
                {errors.ngayTra && <div className="error-msg">{errors.ngayTra}</div>}
              </div>

              <div className="form-group">
                <label>Số đêm lưu trú</label>
                <input
                  type="text"
                  readOnly
                  value={soDem > 0 ? `${soDem} đêm` : 'Chưa xác định'}
                  style={{ backgroundColor: '#f1f5f9', fontWeight: 600, color: '#1e40af' }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Loại phòng (Chức năng 4)</label>
                <select name="loaiPhong" value={formData.loaiPhong} onChange={handleChange}>
                  {ROOM_TYPES.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} - {formatVND(r.price)}/đêm
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Số lượng phòng</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  name="soLuongPhong"
                  value={formData.soLuongPhong}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Số người lớn</label>
                <input
                  type="number"
                  min="1"
                  name="soNguoiLon"
                  value={formData.soNguoiLon}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Số trẻ em</label>
                <input
                  type="number"
                  min="0"
                  name="soTreEm"
                  value={formData.soTreEm}
                  onChange={handleChange}
                />
              </div>
            </div>
          </fieldset>

          {/* Dịch vụ bổ sung */}
          <fieldset className="form-section">
            <legend>Dịch vụ bổ sung (Chức năng 5)</legend>
            <div className="checkbox-group" style={{ flexDirection: 'column', gap: '10px' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="anSang"
                  checked={formData.anSang}
                  onChange={handleChange}
                />
                <span><strong>Ăn sáng buffet</strong> (100.000 VNĐ / người / đêm)</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="duaDonSanBay"
                  checked={formData.duaDonSanBay}
                  onChange={handleChange}
                />
                <span><strong>Đưa đón sân bay</strong> (300.000 VNĐ / lần)</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="giatUi"
                  checked={formData.giatUi}
                  onChange={handleChange}
                />
                <span><strong>Dịch vụ giặt ủi</strong> (50.000 VNĐ / người)</span>
              </label>
            </div>
          </fieldset>

          {/* TỔNG KẾT CHI PHÍ THỜI GIAN THỰC (Chức năng 6 & 7) */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '8px', color: '#1e293b' }}>Ước tính chi phí tạm tính:</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.92rem' }}>
              <span>Tiền phòng ({formData.soLuongPhong} phòng x {soDem} đêm):</span>
              <strong>{formatVND(calculation.tienPhong)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.92rem' }}>
              <span>Phí dịch vụ bổ sung:</span>
              <strong>{formatVND(calculation.tienDichVu)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '2px dashed #cbd5e1', fontSize: '1.2rem', color: '#b91c1c' }}>
              <span>TỔNG CHI PHÍ:</span>
              <strong>{formatVND(calculation.tongTien)}</strong>
            </div>
          </div>

          <div className="actions-row">
            <button type="submit" className="btn btn-primary">
              <Calendar size={18} /> Đặt Phòng Ngay
            </button>
          </div>
        </form>
      ) : (
        /* BẢNG TỔNG KẾT VÀ XÁC NHẬN ĐẶT PHÒNG (Chức năng 7 & 8) */
        <div>
          <div className="alert-success" style={{ marginBottom: '16px' }}>
            <CheckCircle2 size={32} style={{ margin: '0 auto 8px', display: 'block' }} />
            <h3>BẢNG TỔNG KẾT ĐẶT PHÒNG</h3>
            <p>Vui lòng đối chiếu lại thông tin hoặc quay lại thay đổi trước khi thanh toán.</p>
          </div>

          <table className="summary-table">
            <tbody>
              <tr><th colSpan="2" style={{ background: '#f1f5f9' }}>1. Khách hàng</th></tr>
              <tr><th>Họ tên</th><td>{formData.hoTen}</td></tr>
              <tr><th>Số điện thoại</th><td>{formData.soDienThoai}</td></tr>
              <tr><th>Email</th><td>{formData.email}</td></tr>

              <tr><th colSpan="2" style={{ background: '#f1f5f9' }}>2. Chi tiết lưu trú</th></tr>
              <tr><th>Ngày nhận phòng</th><td>{formData.ngayNhan}</td></tr>
              <tr><th>Ngày trả phòng</th><td>{formData.ngayTra}</td></tr>
              <tr><th>Số đêm</th><td><strong>{soDem} đêm</strong></td></tr>
              <tr><th>Hạng phòng</th><td>{calculation.selectedRoom.name} ({formatVND(calculation.selectedRoom.price)}/đêm)</td></tr>
              <tr><th>Số lượng phòng</th><td>{formData.soLuongPhong} phòng</td></tr>
              <tr><th>Số lượng khách</th><td>{formData.soNguoiLon} người lớn, {formData.soTreEm} trẻ em (Tổng: {calculation.tongSoNguoi} người)</td></tr>

              <tr><th colSpan="2" style={{ background: '#f1f5f9' }}>3. Chi phí chi tiết</th></tr>
              <tr><th>Tiền phòng</th><td>{formatVND(calculation.tienPhong)}</td></tr>
              <tr><th>Ăn sáng buffet</th><td>{formData.anSang ? formatVND(calculation.tienAnSang) : 'Không chọn'}</td></tr>
              <tr><th>Đưa đón sân bay</th><td>{formData.duaDonSanBay ? formatVND(calculation.tienDuaDon) : 'Không chọn'}</td></tr>
              <tr><th>Giặt ủi</th><td>{formData.giatUi ? formatVND(calculation.tienGiatUi) : 'Không chọn'}</td></tr>
              <tr style={{ background: '#fef2f2' }}>
                <th style={{ color: '#b91c1c', fontSize: '1.05rem' }}>TỔNG THANH TOÁN</th>
                <td style={{ color: '#b91c1c', fontSize: '1.25rem', fontWeight: 'bold' }}>{formatVND(calculation.tongTien)}</td>
              </tr>
            </tbody>
          </table>

          <div className="actions-row">
            {/* Chức năng 8: Cho phép thay đổi thông tin trước khi xác nhận */}
            <button type="button" className="btn btn-secondary" onClick={() => setIsConfirmed(false)}>
              <ArrowLeft size={16} /> Thay Đổi Thông Tin
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => alert(`Đặt phòng thành công! Mã đơn: HTL-${Date.now().toString().slice(-6)}\nCảm ơn quý khách ${formData.hoTen}!`)}
            >
              <CheckCircle2 size={16} /> Xác Nhận Thanh Toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
