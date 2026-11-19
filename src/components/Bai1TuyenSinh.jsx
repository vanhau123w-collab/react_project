import React, { useState } from 'react';
import { UserCheck, AlertCircle, ArrowLeft, Check, RefreshCw, Upload } from 'lucide-react';

const initialFormData = {
  hoTen: '',
  ngaySinh: '',
  gioiTinh: 'Nam',
  soDienThoai: '',
  email: '',
  diaChi: '',
  truong: '',
  nganh: '',
  heDaoTao: 'Đại học chính quy',
  namTuyenSinh: '2026',
  diemTB: '',
  ghiChu: ''
};

export default function Bai1TuyenSinh() {
  const [formData, setFormData] = useState(initialFormData);
  const [fileAnh, setFileAnh] = useState(null);
  const [fileHocBa, setFileHocBa] = useState(null);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState('form'); // 'form' | 'confirm' | 'success'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'anh') {
      setFileAnh(file || null);
      if (errors.fileAnh) setErrors(prev => ({ ...prev, fileAnh: '' }));
    } else {
      setFileHocBa(file || null);
      if (errors.fileHocBa) setErrors(prev => ({ ...prev, fileHocBa: '' }));
    }
  };

  const validate = () => {
    const errs = {};

    // 1. Trường bắt buộc
    if (!formData.hoTen.trim()) errs.hoTen = 'Họ và tên không được để trống';
    if (!formData.diaChi.trim()) errs.diaChi = 'Địa chỉ thường trú không được để trống';
    if (!formData.truong) errs.truong = 'Vui lòng chọn trường đăng ký';
    if (!formData.nganh) errs.nganh = 'Vui lòng chọn ngành học';

    // 2. Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email không được để trống';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Email không đúng định dạng (vd: thi_sinh@domain.com)';
    }

    // 3. Số điện thoại (10 số, bắt đầu bằng số 0)
    const phoneRegex = /^0\d{9}$/;
    if (!formData.soDienThoai.trim()) {
      errs.soDienThoai = 'Số điện thoại không được để trống';
    } else if (!phoneRegex.test(formData.soDienThoai.trim())) {
      errs.soDienThoai = 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0';
    }

    // 4. Tuổi thí sinh (quy định giả lập: 18 - 30 tuổi)
    if (!formData.ngaySinh) {
      errs.ngaySinh = 'Vui lòng chọn ngày sinh';
    } else {
      const birthDate = new Date(formData.ngaySinh);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18 || age > 30) {
        errs.ngaySinh = `Tuổi thí sinh phải từ 18 đến 30 tuổi (hiện tại tính được: ${age} tuổi)`;
      }
    }

    // 5. Điểm trung bình (0 - 10)
    if (formData.diemTB === '') {
      errs.diemTB = 'Điểm trung bình không được để trống';
    } else {
      const score = parseFloat(formData.diemTB);
      if (isNaN(score) || score < 0 || score > 10) {
        errs.diemTB = 'Điểm trung bình phải nằm trong khoảng từ 0 đến 10';
      }
    }

    // 6. File tải lên
    if (!fileAnh) {
      errs.fileAnh = 'Vui lòng chọn ảnh đại diện';
    } else {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(fileAnh.type)) {
        errs.fileAnh = 'Ảnh đại diện phải có định dạng JPG, JPEG hoặc PNG';
      } else if (fileAnh.size > 2 * 1024 * 1024) {
        errs.fileAnh = 'Dung lượng ảnh tối đa là 2MB';
      }
    }

    if (!fileHocBa) {
      errs.fileHocBa = 'Vui lòng tải lên file học bạ';
    } else {
      const validDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const ext = fileHocBa.name.split('.').pop().toLowerCase();
      if (!validDocTypes.includes(fileHocBa.type) && !['pdf', 'doc', 'docx'].includes(ext)) {
        errs.fileHocBa = 'File học bạ phải có định dạng PDF, DOC hoặc DOCX';
      } else if (fileHocBa.size > 5 * 1024 * 1024) {
        errs.fileHocBa = 'Dung lượng file học bạ tối đa là 5MB';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setStep('confirm'); // Bước 8: Hiển thị xác nhận
    }
  };

  const handleFinalConfirm = () => {
    setStep('success'); // Bước 10: Thông báo thành công
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setFileAnh(null);
    setFileHocBa(null);
    setErrors({});
    setStep('form');
  };

  return (
    <div className="card single-column-card">
      <h2 className="card-title">
        <UserCheck className="text-primary" /> Bài 1: Web Đăng Ký Tuyển Sinh
      </h2>
      <p className="card-subtitle">Hệ thống tiếp nhận hồ sơ đăng ký tuyển sinh trực tuyến</p>

      {/* GIAO DIỆN FORM ĐIỀN THÔNG TIN */}
      {step === 'form' && (
        <form onSubmit={handleSubmit} noValidate>
          {/* Nhóm 1: Thông tin cá nhân */}
          <fieldset className="form-section">
            <legend>1. Thông tin cá nhân</legend>
            <div className="form-row">
              <div className="form-group">
                <label>Họ và tên <span className="required">*</span></label>
                <input
                  type="text"
                  name="hoTen"
                  placeholder="Nguyễn Văn A"
                  value={formData.hoTen}
                  onChange={handleChange}
                  className={errors.hoTen ? 'input-error' : ''}
                />
                {errors.hoTen && <div className="error-msg"><AlertCircle size={14} />{errors.hoTen}</div>}
              </div>

              <div className="form-group">
                <label>Ngày sinh <span className="required">*</span> (18 - 30 tuổi)</label>
                <input
                  type="date"
                  name="ngaySinh"
                  value={formData.ngaySinh}
                  onChange={handleChange}
                  className={errors.ngaySinh ? 'input-error' : ''}
                />
                {errors.ngaySinh && <div className="error-msg"><AlertCircle size={14} />{errors.ngaySinh}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Giới tính</label>
                <div className="radio-group">
                  {['Nam', 'Nữ'].map(gt => (
                    <label key={gt} className="radio-label">
                      <input
                        type="radio"
                        name="gioiTinh"
                        value={gt}
                        checked={formData.gioiTinh === gt}
                        onChange={handleChange}
                      />
                      {gt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Số điện thoại <span className="required">*</span></label>
                <input
                  type="text"
                  name="soDienThoai"
                  placeholder="0912345678"
                  value={formData.soDienThoai}
                  onChange={handleChange}
                  className={errors.soDienThoai ? 'input-error' : ''}
                />
                {errors.soDienThoai && <div className="error-msg"><AlertCircle size={14} />{errors.soDienThoai}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <div className="error-msg"><AlertCircle size={14} />{errors.email}</div>}
              </div>

              <div className="form-group">
                <label>Địa chỉ thường trú <span className="required">*</span></label>
                <input
                  type="text"
                  name="diaChi"
                  placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
                  value={formData.diaChi}
                  onChange={handleChange}
                  className={errors.diaChi ? 'input-error' : ''}
                />
                {errors.diaChi && <div className="error-msg"><AlertCircle size={14} />{errors.diaChi}</div>}
              </div>
            </div>
          </fieldset>

          {/* Nhóm 2: Thông tin đăng ký */}
          <fieldset className="form-section">
            <legend>2. Thông tin đăng ký</legend>
            <div className="form-row">
              <div className="form-group">
                <label>Trường đăng ký <span className="required">*</span></label>
                <select
                  name="truong"
                  value={formData.truong}
                  onChange={handleChange}
                  className={errors.truong ? 'input-error' : ''}
                >
                  <option value="">-- Chọn trường đại học --</option>
                  <option value="Đại học Bách Khoa">Đại học Bách Khoa</option>
                  <option value="Đại học Khoa học Tự nhiên">Đại học Khoa học Tự nhiên</option>
                  <option value="Đại học Công nghệ Thông tin">Đại học Công nghệ Thông tin</option>
                  <option value="Đại học Kinh tế">Đại học Kinh tế</option>
                  <option value="Đại học Công nghệ Kỹ thuật">Đại học Công nghệ Kỹ thuật</option>
                </select>
                {errors.truong && <div className="error-msg"><AlertCircle size={14} />{errors.truong}</div>}
              </div>

              <div className="form-group">
                <label>Ngành học <span className="required">*</span></label>
                <select
                  name="nganh"
                  value={formData.nganh}
                  onChange={handleChange}
                  className={errors.nganh ? 'input-error' : ''}
                >
                  <option value="">-- Chọn ngành học --</option>
                  <option value="Công nghệ Thông tin">Công nghệ Thông tin</option>
                  <option value="Kỹ thuật Phần mềm">Kỹ thuật Phần mềm</option>
                  <option value="Khoa học Dữ liệu & AI">Khoa học Dữ liệu & AI</option>
                  <option value="Hệ thống Thông tin">Hệ thống Thông tin</option>
                  <option value="An toàn Thông tin">An toàn Thông tin</option>
                  <option value="Quản trị Kinh doanh">Quản trị Kinh doanh</option>
                </select>
                {errors.nganh && <div className="error-msg"><AlertCircle size={14} />{errors.nganh}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Hệ đào tạo</label>
                <select name="heDaoTao" value={formData.heDaoTao} onChange={handleChange}>
                  <option value="Đại học chính quy">Đại học chính quy</option>
                  <option value="Chất lượng cao">Chất lượng cao</option>
                  <option value="Liên kết quốc tế">Liên kết quốc tế</option>
                  <option value="Vừa học vừa làm">Vừa học vừa làm</option>
                </select>
              </div>

              <div className="form-group">
                <label>Năm tuyển sinh</label>
                <input
                  type="number"
                  name="namTuyenSinh"
                  value={formData.namTuyenSinh}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Điểm trung bình (0 - 10) <span className="required">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="diemTB"
                  placeholder="8.5"
                  value={formData.diemTB}
                  onChange={handleChange}
                  className={errors.diemTB ? 'input-error' : ''}
                />
                {errors.diemTB && <div className="error-msg"><AlertCircle size={14} />{errors.diemTB}</div>}
              </div>
            </div>
          </fieldset>

          {/* Nhóm 3: Thông tin bổ sung */}
          <fieldset className="form-section">
            <legend>3. Thông tin bổ sung</legend>
            <div className="form-row">
              <div className="form-group">
                <label>Ảnh đại diện (JPG, PNG &lt; 2MB) <span className="required">*</span></label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => handleFileChange(e, 'anh')}
                  className={errors.fileAnh ? 'input-error' : ''}
                />
                {fileAnh && <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>Đã chọn: {fileAnh.name} ({(fileAnh.size / 1024).toFixed(1)} KB)</span>}
                {errors.fileAnh && <div className="error-msg"><AlertCircle size={14} />{errors.fileAnh}</div>}
              </div>

              <div className="form-group">
                <label>File học bạ (PDF, DOC &lt; 5MB) <span className="required">*</span></label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'hocba')}
                  className={errors.fileHocBa ? 'input-error' : ''}
                />
                {fileHocBa && <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>Đã chọn: {fileHocBa.name} ({(fileHocBa.size / 1024).toFixed(1)} KB)</span>}
                {errors.fileHocBa && <div className="error-msg"><AlertCircle size={14} />{errors.fileHocBa}</div>}
              </div>
            </div>

            <div className="form-group">
              <label>Ghi chú</label>
              <textarea
                name="ghiChu"
                rows="3"
                placeholder="Ghi chú nguyện vọng hoặc thông tin thêm (nếu có)..."
                value={formData.ghiChu}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          <div className="actions-row">
            <button type="submit" className="btn btn-primary">
              <Upload size={18} /> Đăng Ký
            </button>
          </div>
        </form>
      )}

      {/* BƯỚC 8 & 9: XÁC NHẬN THÔNG TIN */}
      {step === 'confirm' && (
        <div>
          <div className="alert-info">
            Vui lòng kiểm tra kỹ lại toàn bộ thông tin đã nhập trước khi xác nhận nộp hồ sơ.
          </div>

          <table className="summary-table">
            <tbody>
              <tr><th colSpan="2" style={{ background: '#e0e7ff', color: '#3730a3' }}>1. Thông tin cá nhân</th></tr>
              <tr><th>Họ và tên</th><td>{formData.hoTen}</td></tr>
              <tr><th>Ngày sinh</th><td>{formData.ngaySinh}</td></tr>
              <tr><th>Giới tính</th><td>{formData.gioiTinh}</td></tr>
              <tr><th>Số điện thoại</th><td>{formData.soDienThoai}</td></tr>
              <tr><th>Email</th><td>{formData.email}</td></tr>
              <tr><th>Địa chỉ thường trú</th><td>{formData.diaChi}</td></tr>

              <tr><th colSpan="2" style={{ background: '#e0e7ff', color: '#3730a3' }}>2. Thông tin đăng ký</th></tr>
              <tr><th>Trường đăng ký</th><td>{formData.truong}</td></tr>
              <tr><th>Ngành học</th><td>{formData.nganh}</td></tr>
              <tr><th>Hệ đào tạo</th><td>{formData.heDaoTao}</td></tr>
              <tr><th>Năm tuyển sinh</th><td>{formData.namTuyenSinh}</td></tr>
              <tr><th>Điểm trung bình học tập</th><td><strong style={{ color: '#2563eb' }}>{formData.diemTB}</strong></td></tr>

              <tr><th colSpan="2" style={{ background: '#e0e7ff', color: '#3730a3' }}>3. Thông tin bổ sung</th></tr>
              <tr><th>Ảnh đại diện</th><td>{fileAnh?.name}</td></tr>
              <tr><th>File học bạ</th><td>{fileHocBa?.name}</td></tr>
              <tr><th>Ghi chú</th><td>{formData.ghiChu || '(Không có)'}</td></tr>
            </tbody>
          </table>

          <div className="actions-row">
            <button type="button" className="btn btn-secondary" onClick={() => setStep('form')}>
              <ArrowLeft size={16} /> Quay Lại Chỉnh Sửa
            </button>
            <button type="button" className="btn btn-success" onClick={handleFinalConfirm}>
              <Check size={16} /> Xác Nhận Đăng Ký
            </button>
          </div>
        </div>
      )}

      {/* BƯỚC 10: THÀNH CÔNG */}
      {step === 'success' && (
        <div className="alert-success">
          <Check size={48} style={{ margin: '0 auto 12px', display: 'block', color: '#16a34a' }} />
          <h3 style={{ color: '#065f46', marginBottom: '8px' }}>ĐĂNG KÝ TUYỂN SINH THÀNH CÔNG!</h3>
          <p>Hồ sơ của thí sinh <strong>{formData.hoTen}</strong> đã được ghi nhận trên hệ thống tuyển sinh năm {formData.namTuyenSinh}.</p>
          <p style={{ marginTop: '6px', fontSize: '0.9rem' }}>Mã xác nhận đăng ký: <strong>TS-{Date.now().toString().slice(-6)}</strong></p>

          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              <RefreshCw size={16} /> Nộp Hồ Sơ Khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
