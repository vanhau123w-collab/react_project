import React, { useState } from 'react';
import {
  UserPlus,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Globe,
  Sparkles,
  Check
} from 'lucide-react';

// Chức năng 9: Danh sách dữ liệu mẫu để kiểm tra trùng mã nhân viên
const SAMPLE_EMPLOYEES = ['NV001', 'NV002', 'NV003', 'NV004', 'NV005'];

// Định dạng tiền tệ VND
const formatVND = (amount) => {
  if (!amount || isNaN(amount)) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Lấy chữ viết tắt làm Avatar đại diện nếu chưa tải ảnh
const getInitials = (name) => {
  if (!name || !name.trim()) return 'NV';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Chức năng 5: Cấu hình phòng ban và các chức vụ tương ứng
const DEPARTMENTS = {
  'Phòng Kỹ thuật - Công nghệ': ['Lập trình viên Frontend', 'Lập trình viên Backend', 'Kỹ sư DevOps', 'QA / QC Tester', 'Trưởng nhóm kỹ thuật'],
  'Phòng Kinh doanh': ['Nhân viên Kinh doanh (Sales)', 'Chuyên viên Phát triển thị trường', 'Trưởng phòng Kinh doanh'],
  'Phòng Nhân sự': ['Chuyên viên Tuyển dụng', 'Chuyên viên C&B', 'Trưởng phòng Nhân sự'],
  'Phòng Marketing': ['Content Creator', 'SEO / Digital Ads Specialist', 'UI/UX Designer', 'Brand Manager'],
  'Phòng Kế toán': ['Kế toán tổng hợp', 'Kế toán thuế', 'Kế toán trưởng']
};

const SKILLS_LIST = [
  'JavaScript / TypeScript', 'React / Next.js', 'Node.js / Express',
  'Python / Django', 'Java / Spring Boot', 'SQL & Database',
  'Docker & K8s', 'Git & CI/CD', 'Kỹ năng giao tiếp', 'Quản lý thời gian'
];

export default function Bai4ThemNhanVien() {
  const [formData, setFormData] = useState({
    maNV: '',
    hoTen: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    email: '',
    soDienThoai: '',
    diaChi: '',
    phongBan: 'Phòng Kỹ thuật - Công nghệ',
    chucVu: 'Lập trình viên Frontend',
    ngayBatDau: '',
    loaiHopDong: 'Chính thức', // 'Chính thức' | 'Thời vụ' | 'Thực tập'
    ngayKetThuc: '',
    mucLuong: '',
    trangThai: 'Đang làm việc',
    ngoaiNgu: 'Tiếng Anh (Giao tiếp tốt)'
  });

  const [kyNang, setKyNang] = useState(['JavaScript / TypeScript', 'React / Next.js']);
  const [chungChi, setChungChi] = useState(['AWS Certified Cloud Practitioner', 'IELTS 6.5']);
  const [newChungChi, setNewChungChi] = useState('');
  const [fileAnh, setFileAnh] = useState(null);
  const [previewAnhUrl, setPreviewAnhUrl] = useState('');

  const [errors, setErrors] = useState({});
  const [savedData, setSavedData] = useState(null);

  // Chức năng 5: Khi chọn phòng ban, tự động cập nhật danh sách chức vụ
  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    const availablePositions = DEPARTMENTS[dept] || [];
    setFormData(prev => ({
      ...prev,
      phongBan: dept,
      chucVu: availablePositions[0] || ''
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Chức năng 7: Chọn nhiều kỹ năng chuyên môn
  const handleSkillToggle = (skill) => {
    setKyNang(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  // Chức năng 8: Thêm & xóa nhiều chứng chỉ
  const handleAddChungChi = () => {
    if (newChungChi.trim() && !chungChi.includes(newChungChi.trim())) {
      setChungChi(prev => [...prev, newChungChi.trim()]);
      setNewChungChi('');
    }
  };

  const handleRemoveChungChi = (index) => {
    setChungChi(prev => prev.filter((_, i) => i !== index));
  };

  // Ảnh nhân viên
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileAnh(file);
      setPreviewAnhUrl(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const errs = {};

    // 1. Mã nhân viên không được để trống
    const ma = formData.maNV.trim().toUpperCase();
    if (!ma) {
      errs.maNV = 'Mã nhân viên không được để trống';
    } else {
      // 9. Kiểm tra trùng mã nhân viên
      if (SAMPLE_EMPLOYEES.includes(ma)) {
        errs.maNV = `Mã nhân viên "${ma}" đã tồn tại trong hệ thống (Dữ liệu mẫu: ${SAMPLE_EMPLOYEES.join(', ')})`;
      }
    }

    if (!formData.hoTen.trim()) errs.hoTen = 'Họ và tên không được để trống';

    // 2. Kiểm tra email đúng định dạng
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email không được để trống';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Email không đúng định dạng (vd: nv@company.com)';
    }

    // 3. Mức lương lớn hơn 0
    if (formData.mucLuong === '') {
      errs.mucLuong = 'Vui lòng nhập mức lương';
    } else {
      const salary = parseFloat(formData.mucLuong);
      if (isNaN(salary) || salary <= 0) {
        errs.mucLuong = 'Mức lương phải là số lớn hơn 0';
      }
    }

    // 4. Kiểm tra ngày bắt đầu làm việc
    if (!formData.ngayBatDau) {
      errs.ngayBatDau = 'Vui lòng chọn ngày bắt đầu làm việc';
    }

    // 6. Nếu chọn hợp đồng thời vụ, kiểm tra ngày kết thúc
    if (formData.loaiHopDong === 'Thời vụ') {
      if (!formData.ngayKetThuc) {
        errs.ngayKetThuc = 'Hợp đồng thời vụ bắt buộc phải chọn ngày kết thúc';
      } else if (formData.ngayBatDau && new Date(formData.ngayKetThuc) <= new Date(formData.ngayBatDau)) {
        errs.ngayKetThuc = 'Ngày kết thúc phải sau ngày bắt đầu làm việc';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Chức năng 10: Hiển thị thông tin nhân viên sau khi lưu
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSavedData({
        ...formData,
        maNV: formData.maNV.trim().toUpperCase(),
        kyNang: [...kyNang],
        chungChi: [...chungChi],
        tenFileAnh: fileAnh ? fileAnh.name : '(Chưa tải ảnh)',
        previewAnhUrl
      });
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setSavedData(null);
    setFormData({
      maNV: '',
      hoTen: '',
      ngaySinh: '',
      gioiTinh: 'Nam',
      email: '',
      soDienThoai: '',
      diaChi: '',
      phongBan: 'Phòng Kỹ thuật - Công nghệ',
      chucVu: 'Lập trình viên Frontend',
      ngayBatDau: '',
      loaiHopDong: 'Chính thức',
      ngayKetThuc: '',
      mucLuong: '',
      trangThai: 'Đang làm việc',
      ngoaiNgu: 'Tiếng Anh'
    });
    setKyNang([]);
    setChungChi([]);
    setFileAnh(null);
    setPreviewAnhUrl('');
    setErrors({});
  };

  return (
    <div className="two-column-layout">
      {/* CỘT TRÁI: FORM NHẬP LIỆU */}
      <div className="card" style={{ marginBottom: 0 }}>
        <h2 className="card-title">
          <UserPlus size={22} /> Bài 4: Web Thêm Mới Nhân Viên
        </h2>
        <p className="card-subtitle">Hồ sơ nhân sự, phân quyền phòng ban, kỹ năng & hợp đồng lao động</p>
      <form onSubmit={handleSubmit}>
        {/* Thông tin cá nhân */}
        <fieldset className="form-section">
          <legend>1. Thông tin cá nhân</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Mã nhân viên <span className="required">*</span></label>
              <input
                type="text"
                name="maNV"
                placeholder="VD: NV006"
                value={formData.maNV}
                onChange={handleChange}
                className={errors.maNV ? 'input-error' : ''}
              />
              {errors.maNV && <div className="error-msg"><AlertCircle size={14} />{errors.maNV}</div>}
            </div>

            <div className="form-group">
              <label>Họ và tên <span className="required">*</span></label>
              <input
                type="text"
                name="hoTen"
                placeholder="Trần Thị Lan"
                value={formData.hoTen}
                onChange={handleChange}
                className={errors.hoTen ? 'input-error' : ''}
              />
              {errors.hoTen && <div className="error-msg"><AlertCircle size={14} />{errors.hoTen}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày sinh</label>
              <input type="date" name="ngaySinh" value={formData.ngaySinh} onChange={handleChange} />
            </div>

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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                placeholder="lan.tran@company.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <div className="error-msg"><AlertCircle size={14} />{errors.email}</div>}
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="soDienThoai"
                placeholder="0918123456"
                value={formData.soDienThoai}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="diaChi"
                placeholder="Hà Nội / TP.HCM"
                value={formData.diaChi}
                onChange={handleChange}
              />
            </div>
          </div>
        </fieldset>

        {/* Thông tin công việc */}
        <fieldset className="form-section">
          <legend>2. Thông tin công việc</legend>
          <div className="form-row">
            {/* Chức năng 5: Khi chọn phòng ban, hiển thị các chức vụ tương ứng */}
            <div className="form-group">
              <label>Phòng ban <span className="required">*</span></label>
              <select name="phongBan" value={formData.phongBan} onChange={handleDepartmentChange}>
                {Object.keys(DEPARTMENTS).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Chức vụ tương ứng <span className="required">*</span></label>
              <select name="chucVu" value={formData.chucVu} onChange={handleChange}>
                {(DEPARTMENTS[formData.phongBan] || []).map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày bắt đầu làm việc <span className="required">*</span></label>
              <input
                type="date"
                name="ngayBatDau"
                value={formData.ngayBatDau}
                onChange={handleChange}
                className={errors.ngayBatDau ? 'input-error' : ''}
              />
              {errors.ngayBatDau && <div className="error-msg"><AlertCircle size={14} />{errors.ngayBatDau}</div>}
            </div>

            {/* Chức năng 6: Khi chọn loại hợp đồng thời vụ, hiển thị thêm trường ngày kết thúc */}
            <div className="form-group">
              <label>Loại hợp đồng</label>
              <select name="loaiHopDong" value={formData.loaiHopDong} onChange={handleChange}>
                <option value="Chính thức">Chính thức (Vô thời hạn)</option>
                <option value="Xác định thời hạn 1 năm">Xác định thời hạn 1 năm</option>
                <option value="Thời vụ">Thời vụ</option>
                <option value="Thực tập sinh">Thực tập sinh</option>
              </select>
            </div>

            {formData.loaiHopDong === 'Thời vụ' && (
              <div className="form-group" style={{ backgroundColor: '#fffbeb', padding: '8px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                <label style={{ color: '#b45309' }}>Ngày kết thúc hợp đồng thời vụ <span className="required">*</span></label>
                <input
                  type="date"
                  name="ngayKetThuc"
                  value={formData.ngayKetThuc}
                  onChange={handleChange}
                  className={errors.ngayKetThuc ? 'input-error' : ''}
                />
                {errors.ngayKetThuc && <div className="error-msg"><AlertCircle size={14} />{errors.ngayKetThuc}</div>}
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mức lương (VNĐ) <span className="required">*</span> (Lớn hơn 0)</label>
              <input
                type="number"
                min="1"
                step="500000"
                name="mucLuong"
                placeholder="15000000"
                value={formData.mucLuong}
                onChange={handleChange}
                className={errors.mucLuong ? 'input-error' : ''}
              />
              {errors.mucLuong && <div className="error-msg"><AlertCircle size={14} />{errors.mucLuong}</div>}
            </div>

            <div className="form-group">
              <label>Trạng thái làm việc</label>
              <select name="trangThai" value={formData.trangThai} onChange={handleChange}>
                <option value="Đang làm việc">Đang làm việc</option>
                <option value="Đang thử việc">Đang thử việc</option>
                <option value="Tạm hoãn">Tạm hoãn</option>
                <option value="Đã nghỉ việc">Đã nghỉ việc</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Thông tin bổ sung */}
        <fieldset className="form-section">
          <legend>3. Thông tin bổ sung</legend>

          {/* Chức năng 7: Cho phép chọn nhiều kỹ năng chuyên môn */}
          <div className="form-group">
            <label>Kỹ năng chuyên môn (Chọn nhiều kỹ năng):</label>
            <div className="checkbox-group">
              {SKILLS_LIST.map(skill => (
                <label key={skill} className="checkbox-label" style={{ minWidth: '180px' }}>
                  <input
                    type="checkbox"
                    checked={kyNang.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngoại ngữ</label>
              <input
                type="text"
                name="ngoaiNgu"
                placeholder="Tiếng Anh, Tiếng Nhật N2,..."
                value={formData.ngoaiNgu}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Ảnh nhân viên</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {previewAnhUrl && (
                <img
                  src={previewAnhUrl}
                  alt="Avatar preview"
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', marginTop: '6px', border: '2px solid #3b82f6' }}
                />
              )}
            </div>
          </div>

          {/* Chức năng 8: Cho phép thêm nhiều chứng chỉ */}
          <div className="form-group">
            <label>Danh sách chứng chỉ:</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                placeholder="Nhập tên chứng chỉ (VD: PMP, CCNA, TOEIC 850)..."
                value={newChungChi}
                onChange={(e) => setNewChungChi(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddChungChi(); } }}
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddChungChi}>
                <Plus size={16} /> Thêm Chứng Chỉ
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {chungChi.map((cc, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                    padding: '4px 10px',
                    borderRadius: '16px',
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {cc}
                  <button
                    type="button"
                    onClick={() => handleRemoveChungChi(idx)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', padding: 0 }}
                  >
                    <Trash2 size={13} />
                  </button>
                </span>
              ))}
              {chungChi.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>(Chưa có chứng chỉ nào)</span>}
            </div>
          </div>
        </fieldset>

        <div className="actions-row">
          <button type="submit" className="btn btn-primary">
            <UserPlus size={18} /> Lưu Nhân Viên
          </button>
        </div>
      </form>

      {/* Chức năng 10: Hiển thị thông tin nhân viên sau khi lưu */}
      {savedData && (
        <div style={{ marginTop: '30px', borderTop: '2px dashed #94a3b8', paddingTop: '20px' }}>
          <div className="alert-success" style={{ marginBottom: '16px' }}>
            <CheckCircle size={32} style={{ margin: '0 auto 8px', display: 'block' }} />
            <h3>ĐÃ LƯU THÔNG TIN NHÂN VIÊN THÀNH CÔNG</h3>
            <p>Hồ sơ nhân viên <strong>{savedData.maNV} - {savedData.hoTen}</strong> đã được lưu trữ thành công.</p>
          </div>

          <table className="summary-table">
            <tbody>
              <tr><th colSpan="2" style={{ background: '#f1f5f9' }}>1. Cá nhân</th></tr>
              <tr><th>Mã nhân viên</th><td><strong style={{ color: '#2563eb' }}>{savedData.maNV}</strong></td></tr>
              <tr><th>Họ và tên</th><td>{savedData.hoTen}</td></tr>
              <tr><th>Ngày sinh</th><td>{savedData.ngaySinh || 'Chưa cập nhật'}</td></tr>
              <tr><th>Giới tính</th><td>{savedData.gioiTinh}</td></tr>
              <tr><th>Email</th><td>{savedData.email}</td></tr>
              <tr><th>Số điện thoại</th><td>{savedData.soDienThoai || 'Chưa cập nhật'}</td></tr>
              <tr><th>Địa chỉ</th><td>{savedData.diaChi || 'Chưa cập nhật'}</td></tr>

              <tr><th colSpan="2" style={{ background: '#f1f5f9' }}>2. Công việc</th></tr>
              <tr><th>Phòng ban</th><td>{savedData.phongBan}</td></tr>
              <tr><th>Chức vụ</th><td><strong>{savedData.chucVu}</strong></td></tr>
              <tr><th>Ngày bắt đầu làm việc</th><td>{savedData.ngayBatDau}</td></tr>
              <tr><th>Loại hợp đồng</th><td>{savedData.loaiHopDong} {savedData.ngayKetThuc && `(Đến ngày: ${savedData.ngayKetThuc})`}</td></tr>
              <tr><th>Mức lương</th><td><strong style={{ color: '#16a34a' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(savedData.mucLuong)}</strong></td></tr>
              <tr><th>Trạng thái</th><td>{savedData.trangThai}</td></tr>

              <tr><th colSpan="2" style={{ background: '#f1f5f9' }}>3. Kỹ năng & Khác</th></tr>
              <tr><th>Kỹ năng chuyên môn</th><td>{savedData.kyNang.join(', ') || '(Không)'}</td></tr>
              <tr><th>Chứng chỉ</th><td>{savedData.chungChi.join(', ') || '(Không)'}</td></tr>
              <tr><th>Ngoại ngữ</th><td>{savedData.ngoaiNgu || '(Không)'}</td></tr>
              <tr><th>File ảnh</th><td>{savedData.tenFileAnh}</td></tr>
            </tbody>
          </table>

          <div className="actions-row">
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              <RefreshCw size={16} /> Thêm Nhân Viên Khác
            </button>
          </div>
        </div>
      )}
      </div>

      <aside className="sticky-preview">
        <div className="employee-preview-card">
          <div className="preview-top-bar">
            <span className="preview-label">Thẻ Nhân Sự</span>
            {savedData ? (
              <span className="preview-status-pill saved">
                <Check size={12} /> ĐÃ LƯU
              </span>
            ) : (
              <span className="preview-status-pill live">
               
              </span>
            )}
          </div>

          {/* Avatar & Thông tin cơ bản */}
          <div className="preview-avatar-section">
            <div className="preview-avatar-box">
              {previewAnhUrl ? (
                <img src={previewAnhUrl} alt="Avatar Preview" className="preview-avatar-img" />
              ) : (
                <span>{getInitials(formData.hoTen)}</span>
              )}
            </div>
            <div className="preview-name-box">
              <div className="preview-name">
                {formData.hoTen.trim() || 'Họ và tên nhân sự'}
              </div>
              <div className="preview-role">{formData.chucVu}</div>
              <div className="preview-dept">{formData.phongBan}</div>
              <span className="preview-code-badge">
                {formData.maNV.trim() ? formData.maNV.trim().toUpperCase() : 'NV---'}
              </span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="preview-stats-grid">
            <div className="preview-stat-item">
              <span className="preview-stat-label">Mức lương</span>
              <span className="preview-stat-value">{formatVND(formData.mucLuong)}</span>
            </div>
            <div className="preview-stat-item">
              <span className="preview-stat-label">Hợp đồng</span>
              <span className="preview-stat-value" title={formData.loaiHopDong}>{formData.loaiHopDong}</span>
            </div>
            <div className="preview-stat-item">
              <span className="preview-stat-label">Trạng thái</span>
              <span className="preview-stat-value" title={formData.trangThai}>{formData.trangThai}</span>
            </div>
          </div>

          {/* Danh sách thông tin chi tiết */}
          <div className="preview-info-list">
            <div className="preview-info-row">
              <span className="preview-info-key"><Mail size={13} /> Email:</span>
              <span className="preview-info-val">{formData.email.trim() || '—'}</span>
            </div>
            <div className="preview-info-row">
              <span className="preview-info-key"><Phone size={13} /> Điện thoại:</span>
              <span className="preview-info-val">{formData.soDienThoai.trim() || '—'}</span>
            </div>
            <div className="preview-info-row">
              <span className="preview-info-key"><Calendar size={13} /> Ngày sinh:</span>
              <span className="preview-info-val">
                {formData.ngaySinh || '—'} {formData.gioiTinh ? `(${formData.gioiTinh})` : ''}
              </span>
            </div>
            <div className="preview-info-row">
              <span className="preview-info-key"><MapPin size={13} /> Địa chỉ:</span>
              <span className="preview-info-val">{formData.diaChi.trim() || '—'}</span>
            </div>
            <div className="preview-info-row">
              <span className="preview-info-key"><Briefcase size={13} /> Ngày bắt đầu:</span>
              <span className="preview-info-val">{formData.ngayBatDau || '—'}</span>
            </div>
            {formData.loaiHopDong === 'Thời vụ' && (
              <div className="preview-info-row">
                <span className="preview-info-key"><Calendar size={13} /> Ngày kết thúc:</span>
                <span className="preview-info-val" style={{ color: '#b45309' }}>
                  {formData.ngayKetThuc || '(Chưa chọn)'}
                </span>
              </div>
            )}
            <div className="preview-info-row">
              <span className="preview-info-key"><Globe size={13} /> Ngoại ngữ:</span>
              <span className="preview-info-val">{formData.ngoaiNgu.trim() || '—'}</span>
            </div>
          </div>

          {/* Kỹ năng chuyên môn */}
          <div className="preview-subgroup-title">
            Kỹ năng chuyên môn ({kyNang.length})
          </div>
          <div className="preview-pills-wrap">
            {kyNang.length > 0 ? (
              kyNang.map(s => (
                <span key={s} className="preview-pill">{s}</span>
              ))
            ) : (
              <span className="preview-pill-empty">Chưa chọn kỹ năng nào</span>
            )}
          </div>

          {/* Chứng chỉ */}
          <div className="preview-subgroup-title">
            Chứng chỉ ({chungChi.length})
          </div>
          <div className="preview-pills-wrap">
            {chungChi.length > 0 ? (
              chungChi.map((c, i) => (
                <span key={i} className="preview-pill">{c}</span>
              ))
            ) : (
              <span className="preview-pill-empty">Chưa có chứng chỉ nào</span>
            )}
          </div>

          {/* Dữ liệu mẫu kiểm tra trùng lặp */}
          <div className="preview-sample-box">
            <div className="preview-sample-title">Mã NV đã có (thử trùng lặp):</div>
            <div>
              {SAMPLE_EMPLOYEES.map(code => (
                <button
                  key={code}
                  type="button"
                  className="sample-code-chip"
                  title={`Điền nhanh mã ${code} để kiểm tra validate trùng`}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, maNV: code }));
                    if (errors.maNV) setErrors(prev => ({ ...prev, maNV: '' }));
                  }}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {savedData && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '16px' }}
              onClick={handleReset}
            >
              <RefreshCw size={14} /> Thêm Nhân Viên Khác
            </button>
          )}
        </div>
      </aside>
      </div>

      {/* CỘT PHẢI: CARD THỂ HIỆN THÔNG TIN NHÂN VIÊN (LIVE PREVIEW & SUMMARY) */}
      <aside className="sticky-preview">
        <div className="employee-preview-card">
          <div className="preview-top-bar">
            <span className="preview-label">Thẻ Nhân Sự</span>
            {savedData ? (
              <span className="preview-status-pill saved">
                <Check size={12} /> ĐÃ LƯU
              </span>
            ) : (
              <span className="preview-status-pill live">
                <Sparkles size={12} /> LIVE PREVIEW
              </span>
            )}
          </div>

          {/* Avatar & Thông tin cơ bản */}
          <div className="preview-avatar-section">
            <div className="preview-avatar-box">
              {previewAnhUrl ? (
                <img src={previewAnhUrl} alt="Avatar Preview" className="preview-avatar-img" />
              ) : (
                <span>{getInitials(formData.hoTen)}</span>
              )}
            </div>
            <div className="preview-name-box">
              <div className="preview-name">
                {formData.hoTen.trim() || 'Họ và tên nhân sự'}
              </div>
              <div className="preview-role">{formData.chucVu}</div>
              <div className="preview-dept">{formData.phongBan}</div>
              <span className="preview-code-badge">
                {formData.maNV.trim() ? formData.maNV.trim().toUpperCase() : 'NV---'}
              </span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="preview-stats-grid">
            <div className="preview-stat-item">
              <span className="preview-stat-label">Mức lương</span>
              <span className="preview-stat-value">{formatVND(formData.mucLuong)}</span>
            </div>
            <div className="preview-stat-item">
              <span className="preview-stat-label">Hợp đồng</span>
              <span className="preview-stat-value" title={formData.loaiHopDong}>{formData.loaiHopDong}</span>
            </div>
            <div className="preview-stat-item">
              <span className="preview-stat-label">Trạng thái</span>
              <span className="preview-stat-value" title={formData.trangThai}>{formData.trangThai}</span>
            </div>
          </div>

          {/* Danh sách thông tin chi tiết */}
          <div className="preview-info-list">
            <div className="preview-info-row">
              <span className="preview-info-key"><Mail size={13} /> Email:</span>
              <span className="preview-info-val">{formData.email.trim() || '—'}</span>
            </div>
            <div className="preview-info-row">
              <span className="preview-info-key"><Phone size={13} /> Điện thoại:</span>
              <span className="preview-info-val">{formData.soDienThoai.trim() || '—'}</span>
            </div>
            <div className="preview-info-row">
              <span className="preview-info-key"><Calendar size={13} /> Ngày sinh:</span>
              <span className="preview-info-val">
                {formData.ngaySinh || '—'} {formData.gioiTinh ? `(${formData.gioiTinh})` : ''}
              </span>
            </div>
            <div className="preview-info-row">
              <span className="preview-info-key"><MapPin size={13} /> Địa chỉ:</span>
              <span className="preview-info-val">{formData.diaChi.trim() || '—'}</span>
            </div>
            <div className="preview-info-row">
              <span className="preview-info-key"><Briefcase size={13} /> Ngày bắt đầu:</span>
              <span className="preview-info-val">{formData.ngayBatDau || '—'}</span>
            </div>
            {formData.loaiHopDong === 'Thời vụ' && (
              <div className="preview-info-row">
                <span className="preview-info-key"><Calendar size={13} /> Ngày kết thúc:</span>
                <span className="preview-info-val" style={{ color: '#b45309' }}>
                  {formData.ngayKetThuc || '(Chưa chọn)'}
                </span>
              </div>
            )}
            <div className="preview-info-row">
              <span className="preview-info-key"><Globe size={13} /> Ngoại ngữ:</span>
              <span className="preview-info-val">{formData.ngoaiNgu.trim() || '—'}</span>
            </div>
          </div>

          {/* Kỹ năng chuyên môn */}
          <div className="preview-subgroup-title">
            Kỹ năng chuyên môn ({kyNang.length})
          </div>
          <div className="preview-pills-wrap">
            {kyNang.length > 0 ? (
              kyNang.map(s => (
                <span key={s} className="preview-pill">{s}</span>
              ))
            ) : (
              <span className="preview-pill-empty">Chưa chọn kỹ năng nào</span>
            )}
          </div>

          {/* Chứng chỉ */}
          <div className="preview-subgroup-title">
            Chứng chỉ ({chungChi.length})
          </div>
          <div className="preview-pills-wrap">
            {chungChi.length > 0 ? (
              chungChi.map((c, i) => (
                <span key={i} className="preview-pill">{c}</span>
              ))
            ) : (
              <span className="preview-pill-empty">Chưa có chứng chỉ nào</span>
            )}
          </div>

          {/* Dữ liệu mẫu kiểm tra trùng lặp */}
          <div className="preview-sample-box">
            <div className="preview-sample-title">Mã NV đã có (thử trùng lặp):</div>
            <div>
              {SAMPLE_EMPLOYEES.map(code => (
                <button
                  key={code}
                  type="button"
                  className="sample-code-chip"
                  title={`Điền nhanh mã ${code} để kiểm tra validate trùng`}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, maNV: code }));
                    if (errors.maNV) setErrors(prev => ({ ...prev, maNV: '' }));
                  }}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {savedData && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '16px' }}
              onClick={handleReset}
            >
              <RefreshCw size={14} /> Thêm Nhân Viên Khác
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
