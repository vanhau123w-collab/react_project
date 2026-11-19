import React, { useState } from 'react';
import Bai1TuyenSinh from './components/Bai1TuyenSinh';
import Bai2DatPhong from './components/Bai2DatPhong';
import Bai3TaoDeThi from './components/Bai3TaoDeThi';
import Bai4ThemNhanVien from './components/Bai4ThemNhanVien';
import { UserCheck, BedDouble, BookOpen, UserPlus } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('bai1');

  const tabs = [
    { id: 'bai1', name: 'Bài 1: Tuyển Sinh', icon: <UserCheck size={18} /> },
    { id: 'bai2', name: 'Bài 2: Đặt Phòng', icon: <BedDouble size={18} /> },
    { id: 'bai3', name: 'Bài 3: Tạo Đề Thi', icon: <BookOpen size={18} /> },
    { id: 'bai4', name: 'Bài 4: Thêm Nhân Viên', icon: <UserPlus size={18} /> },
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>BÀI TẬP TUẦN 3 - CÔNG NGHỆ PHẦN MỀM (REACT)</h1>
        <p>Ứng dụng hoàn chỉnh 4 bài thực hành với đầy đủ validate, tính toán động và giao diện trực quan</p>
      </header>

      <nav className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </nav>

      <main className="main-content">
        {activeTab === 'bai1' && <Bai1TuyenSinh />}
        {activeTab === 'bai2' && <Bai2DatPhong />}
        {activeTab === 'bai3' && <Bai3TaoDeThi />}
        {activeTab === 'bai4' && <Bai4ThemNhanVien />}
      </main>
    </div>
  );
}
