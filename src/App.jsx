import React, { useState, useEffect } from 'react';
import Bai1TuyenSinh from './components/Bai1TuyenSinh';
import Bai2DatPhong from './components/Bai2DatPhong';
import Bai3TaoDeThi from './components/Bai3TaoDeThi';
import Bai4ThemNhanVien from './components/Bai4ThemNhanVien';
import {
  UserCheck,
  BedDouble,
  BookOpen,
  UserPlus,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Home,
  Sparkles,
  Layers
} from 'lucide-react';

// Danh sách định nghĩa 4 bài tập và routes tương ứng
const EXERCISES = [
  {
    id: 'bai-1',
    path: '/bai-1',
    number: 'Bài 01',
    title: 'Web Đăng Ký Tuyển Sinh',
    desc: 'Hệ thống tiếp nhận hồ sơ đăng ký tuyển sinh trực tuyến với đầy đủ kiểm tra tính hợp lệ dữ liệu, tính điểm ưu tiên theo khu vực và kết quả trúng tuyển.',
    icon: <UserCheck size={26} />,
    color: 'blue',
    tags: ['Form Validate', 'Điểm ưu tiên', 'Xét tuyển', 'React Form'],
    component: <Bai1TuyenSinh />
  },
  {
    id: 'bai-2',
    path: '/bai-2',
    number: 'Bài 02',
    title: 'Hệ Thống Đặt Phòng Khách Sạn',
    desc: 'Ứng dụng đặt phòng với tính năng chọn loại phòng, thời gian lưu trú, tính toán chi phí động theo dịch vụ gia tăng và xác nhận thông tin đơn đặt.',
    icon: <BedDouble size={26} />,
    color: 'emerald',
    tags: ['Khách sạn', 'Tính giá động', 'Dịch vụ đi kèm', 'State Hook'],
    component: <Bai2DatPhong />
  },
  {
    id: 'bai-3',
    path: '/bai-3',
    number: 'Bài 03',
    title: 'Trắc Nghiệm & Tạo Đề Thi',
    desc: 'Công cụ quản lý ngân hàng câu hỏi, soạn thảo câu hỏi trắc nghiệm, tạo đề thi ngẫu nhiên theo ma trận độ khó và xem trước nội dung đề thi.',
    icon: <BookOpen size={26} />,
    color: 'amber',
    tags: ['Ngân hàng câu hỏi', 'Tạo đề ngẫu nhiên', 'Độ khó', 'JSON Preview'],
    component: <Bai3TaoDeThi />
  },
  {
    id: 'bai-4',
    path: '/bai-4',
    number: 'Bài 04',
    title: 'Quản Lý & Thêm Nhân Viên',
    desc: 'Hệ thống quản lý nhân sự, form nhập liệu nhân viên với phân cấp phòng ban, chức vụ, hệ số lương, phụ cấp và danh sách hiển thị chuyên nghiệp.',
    icon: <UserPlus size={26} />,
    color: 'purple',
    tags: ['Quản lý nhân sự', 'Bảng lương', 'Phòng ban', 'CRUD Table'],
    component: <Bai4ThemNhanVien />
  }
];

export default function App() {
  // Lấy đường dẫn hiện tại từ URL (hỗ trợ cả pathname và hash)
  const getInitialPath = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash.startsWith('/')) return hash;
    return window.location.pathname || '/';
  };

  const [currentPath, setCurrentPath] = useState(getInitialPath);

  // Điều hướng route mượt mà (cập nhật URL và history)
  const navigate = (path) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Đồng bộ với nút Back / Forward của trình duyệt
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      const path = (hash && hash.startsWith('/')) ? hash : window.location.pathname;
      setCurrentPath(path || '/');
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Tìm bài tập khớp với route hiện tại
  const currentExercise = EXERCISES.find(
    (ex) => currentPath === ex.path || currentPath === `/${ex.id}`
  );

  return (
    <div className="app-container">
      {!currentExercise ? (
        <div>
          {/* Minimalist Header Banner */}
          <header className="dashboard-hero">
            <h1 className="dashboard-hero-title">CÁC CÔNG NGHỆ PHẦN MỀM MỚI - BÀI TẬP TUẦN 3</h1>
          </header>

          {/* Grid lựa chọn bài tập */}
          <main className="dashboard-container">
            <div className="dashboard-grid">
              {EXERCISES.map((ex) => (
                <div
                  key={ex.id}
                  className="dashboard-card"
                  onClick={() => navigate(ex.path)}
                >
                  <div className="dashboard-card-top">
                    <div className={`dashboard-card-icon ${ex.color}`}>
                      {ex.icon}
                    </div>
                    <span className="dashboard-card-badge">{ex.number}</span>
                  </div>

                  <h2 className="dashboard-card-title">{ex.title}</h2>
                  <p className="dashboard-card-desc">{ex.desc}</p>

                  <div className="dashboard-card-action">
                    <span>Mở bài tập</span>
                    <ArrowRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      ) : (
        /* ======================================================== */
        /* ROUTE: GIAO DIỆN BÀI TẬP TƯƠNG ỨNG (/bai-1, /bai-2,...)  */
        /* ======================================================== */
        <div>
          {/* Top Navigation Bar cho từng Route */}
          <nav className="route-navbar">
            <div className="route-navbar-inner">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                  type="button"
                  className="btn-back-home"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft size={16} />
                  <span>Quay lại trang chọn</span>
                </button>

                <div className="route-breadcrumb">
                  <span
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Home size={14} />
                    <span>Trang chủ</span>
                  </span>
                  <ChevronRight size={14} />
                  <strong>{currentExercise.title}</strong>
                </div>
              </div>

              {/* Quick Switch Pills sang các bài khác */}
              <div className="route-quick-switch">
                <span className="quick-switch-label">Chuyển bài:</span>
                {EXERCISES.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    className={`btn-quick-pill ${currentExercise.id === ex.id ? 'active' : ''}`}
                    onClick={() => navigate(ex.path)}
                  >
                    {ex.number}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Nội dung bài tập tương ứng */}
          <main className="main-content">
            {currentExercise.component}
          </main>
        </div>
      )}
    </div>
  );
}
