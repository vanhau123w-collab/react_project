import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Eye,
  Save,
  AlertCircle,
  CheckCircle,
  Check,
  CheckSquare,
  HelpCircle,
  FileText
} from 'lucide-react';

// Định nghĩa các dạng câu hỏi hỗ trợ
const QUESTION_TYPES = [
  { value: 'single', label: 'Trắc nghiệm đơn (1 đáp án đúng)', badge: 'Trắc nghiệm đơn' },
  { value: 'multiple', label: 'Trắc nghiệm nhiều đáp án (Checkbox)', badge: 'Nhiều đáp án' },
  { value: 'true_false', label: 'Đúng / Sai (True / False)', badge: 'Đúng / Sai' },
  { value: 'fill_blank', label: 'Điền vào chỗ trống (Fill in blank)', badge: 'Điền khuyết' },
  { value: 'essay', label: 'Tự luận ngắn / Trả lời ngắn', badge: 'Tự luận ngắn' }
];

const initialDeThi = {
  tenDeThi: 'Kiểm tra giữa kỳ Công nghệ Phần mềm',
  monHoc: 'Công nghệ Phần mềm',
  thoiGian: 45,
  soLuongCauHoi: 5,
  mucDo: 'Trung bình'
};

const initialQuestions = [
  {
    id: 1,
    noiDung: 'Mô hình phát triển phần mềm nào làm việc lặp lại và phân bổ theo các Sprint ngắn?',
    loai: 'single',
    diem: 2,
    dapAns: [
      { id: 101, text: 'Mô hình Thác nước (Waterfall)', isCorrect: false },
      { id: 102, text: 'Mô hình Scrum (Agile)', isCorrect: true },
      { id: 103, text: 'Mô hình V-Model', isCorrect: false },
      { id: 104, text: 'Mô hình xoắn ốc (Spiral)', isCorrect: false }
    ],
    dapAnDienTu: '',
    goiYChamDiem: ''
  },
  {
    id: 2,
    noiDung: 'Những nguyên lý / quy trình nào sau đây thuộc nhóm phương pháp phát triển Agile? (Chọn nhiều đáp án)',
    loai: 'multiple',
    diem: 2,
    dapAns: [
      { id: 201, text: 'Scrum Framework với các Sprint 2-4 tuần', isCorrect: true },
      { id: 202, text: 'Kanban - Quản lý luồng công việc trực quan', isCorrect: true },
      { id: 203, text: 'Lập kế hoạch cứng nhắc và từ chối mọi thay đổi yêu cầu', isCorrect: false },
      { id: 204, text: 'Extreme Programming (XP) với thực hành TDD & Pair Programming', isCorrect: true }
    ],
    dapAnDienTu: '',
    goiYChamDiem: ''
  },
  {
    id: 3,
    noiDung: 'Git là một hệ thống quản lý phiên bản phân tán (Distributed Version Control System - DVCS)?',
    loai: 'true_false',
    diem: 2,
    dapAns: [
      { id: 301, text: 'Đúng', isCorrect: true },
      { id: 302, text: 'Sai', isCorrect: false }
    ],
    dapAnDienTu: '',
    goiYChamDiem: ''
  },
  {
    id: 4,
    noiDung: 'Quá trình tự động tích hợp mã nguồn của lập trình viên thường xuyên vào nhánh chính và chạy kiểm thử tự động được gọi là Continuous _______?',
    loai: 'fill_blank',
    diem: 2,
    dapAns: [],
    dapAnDienTu: 'Integration',
    goiYChamDiem: ''
  },
  {
    id: 5,
    noiDung: 'Trình bày ngắn gọn mục đích chính của tài liệu SRS (Software Requirements Specification) trong quy trình phát triển phần mềm.',
    loai: 'essay',
    diem: 2,
    dapAns: [],
    dapAnDienTu: '',
    goiYChamDiem: 'Tài liệu SRS mô tả chi tiết các yêu cầu chức năng, yêu cầu phi chức năng và ràng buộc kỹ thuật của phần mềm; đóng vai trò là thỏa thuận pháp lý và kỹ thuật giữa khách hàng và nhóm kỹ sư phát triển.'
  }
];

export default function Bai3TaoDeThi() {
  const [deThi, setDeThi] = useState(initialDeThi);
  const [questions, setQuestions] = useState(initialQuestions);
  const [showPreview, setShowPreview] = useState(false);
  const [savedJson, setSavedJson] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  // Tự động tính tổng điểm tất cả các câu hỏi
  const tongDiem = useMemo(() => {
    return questions.reduce((sum, q) => sum + (parseFloat(q.diem) || 0), 0);
  }, [questions]);

  const handleDeThiChange = (e) => {
    const { name, value } = e.target;
    setDeThi(prev => ({ ...prev, [name]: value }));
  };

  // Thêm câu hỏi mới
  const handleAddQuestion = () => {
    const newQ = {
      id: Date.now(),
      noiDung: '',
      loai: 'single',
      diem: 1,
      dapAns: [
        { id: Date.now() + 1, text: '', isCorrect: true },
        { id: Date.now() + 2, text: '', isCorrect: false }
      ],
      dapAnDienTu: '',
      goiYChamDiem: ''
    };
    setQuestions(prev => [...prev, newQ]);
  };

  // Xóa câu hỏi
  const handleDeleteQuestion = (qId) => {
    setQuestions(prev => prev.filter(q => q.id !== qId));
  };

  // Sửa nội dung hoặc điểm
  const handleQuestionFieldChange = (qId, field, value) => {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, [field]: value } : q));
  };

  // Thay đổi loại câu hỏi và thiết lập cấu trúc đáp án tương ứng
  const handleQuestionTypeChange = (qId, newType) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q;

      let updatedDapAns = q.dapAns || [];
      let dapAnDienTu = q.dapAnDienTu || '';
      let goiYChamDiem = q.goiYChamDiem || '';

      if (newType === 'true_false') {
        // Dạng Đúng / Sai: Cố định 2 đáp án
        updatedDapAns = [
          { id: 1, text: 'Đúng', isCorrect: true },
          { id: 2, text: 'Sai', isCorrect: false }
        ];
      } else if (newType === 'single') {
        // Dạng trắc nghiệm đơn: chỉ 1 đáp án đúng
        if (!updatedDapAns || updatedDapAns.length < 2) {
          updatedDapAns = [
            { id: Date.now() + 1, text: '', isCorrect: true },
            { id: Date.now() + 2, text: '', isCorrect: false }
          ];
        } else {
          let hasOne = false;
          updatedDapAns = updatedDapAns.map(a => {
            if (a.isCorrect && !hasOne) {
              hasOne = true;
              return a;
            }
            return { ...a, isCorrect: false };
          });
          if (!hasOne && updatedDapAns.length > 0) {
            updatedDapAns[0].isCorrect = true;
          }
        }
      } else if (newType === 'multiple') {
        // Dạng trắc nghiệm nhiều đáp án
        if (!updatedDapAns || updatedDapAns.length < 2) {
          updatedDapAns = [
            { id: Date.now() + 1, text: '', isCorrect: true },
            { id: Date.now() + 2, text: '', isCorrect: true }
          ];
        }
      } else if (newType === 'fill_blank') {
        if (!dapAnDienTu) dapAnDienTu = '';
      } else if (newType === 'essay') {
        if (!goiYChamDiem) goiYChamDiem = '';
      }

      return {
        ...q,
        loai: newType,
        dapAns: updatedDapAns,
        dapAnDienTu,
        goiYChamDiem
      };
    }));
  };

  // Thêm đáp án cho câu hỏi trắc nghiệm
  const handleAddAnswer = (qId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        const newAns = { id: Date.now(), text: '', isCorrect: false };
        return { ...q, dapAns: [...q.dapAns, newAns] };
      }
      return q;
    }));
  };

  // Xóa đáp án
  const handleDeleteAnswer = (qId, aId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return { ...q, dapAns: q.dapAns.filter(a => a.id !== aId) };
      }
      return q;
    }));
  };

  // Sửa nội dung đáp án
  const handleAnswerTextChange = (qId, aId, text) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          dapAns: q.dapAns.map(a => a.id === aId ? { ...a, text } : a)
        };
      }
      return q;
    }));
  };

  // Chọn đáp án đúng cho Trắc nghiệm đơn (Single choice - Radio)
  const handleSelectSingleCorrect = (qId, aId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          dapAns: q.dapAns.map(a => ({
            ...a,
            isCorrect: a.id === aId
          }))
        };
      }
      return q;
    }));
  };

  // Toggle đáp án đúng cho Trắc nghiệm nhiều đáp án (Multiple choice - Checkbox)
  const handleToggleMultipleCorrect = (qId, aId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          dapAns: q.dapAns.map(a => a.id === aId ? { ...a, isCorrect: !a.isCorrect } : a)
        };
      }
      return q;
    }));
  };

  // Chọn Đúng hoặc Sai cho câu hỏi True / False
  const handleSelectTrueFalse = (qId, isTrue) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          dapAns: [
            { id: 1, text: 'Đúng', isCorrect: isTrue },
            { id: 2, text: 'Sai', isCorrect: !isTrue }
          ]
        };
      }
      return q;
    }));
  };

  // Kiểm tra tính hợp lệ toàn bộ đề thi theo từng loại câu hỏi
  const validateExam = () => {
    const errs = [];
    if (!deThi.tenDeThi.trim()) errs.push('Tên đề thi không được để trống.');
    if (questions.length === 0) errs.push('Đề thi phải có ít nhất 1 câu hỏi.');

    questions.forEach((q, idx) => {
      const qNum = idx + 1;
      const typeInfo = QUESTION_TYPES.find(t => t.value === q.loai) || QUESTION_TYPES[0];

      if (!q.noiDung.trim()) {
        errs.push(`Câu hỏi ${qNum} (${typeInfo.badge}): Nội dung câu hỏi không được để trống.`);
      }

      if (q.loai === 'single') {
        if (!q.dapAns || q.dapAns.length < 2) {
          errs.push(`Câu hỏi ${qNum} (${typeInfo.badge}): Phải có ít nhất 2 lựa chọn đáp án.`);
        } else {
          if (q.dapAns.some(a => !a.text.trim())) {
            errs.push(`Câu hỏi ${qNum} (${typeInfo.badge}): Vui lòng nhập nội dung cho tất cả các đáp án.`);
          }
          if (!q.dapAns.some(a => a.isCorrect)) {
            errs.push(`Câu hỏi ${qNum} (${typeInfo.badge}): Chưa đánh dấu đáp án đúng.`);
          }
        }
      } else if (q.loai === 'multiple') {
        if (!q.dapAns || q.dapAns.length < 2) {
          errs.push(`Câu hỏi ${qNum} (${typeInfo.badge}): Phải có ít nhất 2 lựa chọn đáp án.`);
        } else {
          if (q.dapAns.some(a => !a.text.trim())) {
            errs.push(`Câu hỏi ${qNum} (${typeInfo.badge}): Vui lòng nhập nội dung cho tất cả các đáp án.`);
          }
          const correctCount = q.dapAns.filter(a => a.isCorrect).length;
          if (correctCount === 0) {
            errs.push(`Câu hỏi ${qNum} (${typeInfo.badge}): Vui lòng tick chọn ít nhất 1 đáp án đúng.`);
          }
        }
      } else if (q.loai === 'true_false') {
        if (!q.dapAns.some(a => a.isCorrect)) {
          errs.push(`Câu hỏi ${qNum} (${typeInfo.badge}): Vui lòng chọn đáp án là Đúng hoặc Sai.`);
        }
      } else if (q.loai === 'fill_blank') {
        if (!q.dapAnDienTu || !q.dapAnDienTu.trim()) {
          errs.push(`Câu hỏi ${qNum} (${typeInfo.badge}): Vui lòng nhập đáp án / từ khóa chính xác cần điền.`);
        }
      } else if (q.loai === 'essay') {
        if (!q.goiYChamDiem || !q.goiYChamDiem.trim()) {
          errs.push(`Câu hỏi ${qNum} (${typeInfo.badge}): Vui lòng nhập gợi ý chấm điểm hoặc đáp án mẫu.`);
        }
      }
    });

    setValidationErrors(errs);
    return errs.length === 0;
  };

  // Lưu đề thi và tạo cấu trúc JSON
  const handleSaveExam = () => {
    if (validateExam()) {
      const exportData = {
        thongTinDeThi: {
          ...deThi,
          soLuongCauHoiThucTe: questions.length,
          tongDiem: tongDiem,
          ngayTao: new Date().toISOString()
        },
        danhSachCauHoi: questions.map((q, idx) => {
          const typeInfo = QUESTION_TYPES.find(t => t.value === q.loai) || QUESTION_TYPES[0];
          const base = {
            stt: idx + 1,
            noiDung: q.noiDung,
            loaiCauHoi: typeInfo.badge,
            maDinhDang: q.loai,
            diem: parseFloat(q.diem)
          };

          if (q.loai === 'single' || q.loai === 'multiple' || q.loai === 'true_false') {
            base.cacLuaChon = q.dapAns.map(a => ({
              noiDung: a.text,
              laDapAnDung: a.isCorrect
            }));
          } else if (q.loai === 'fill_blank') {
            base.dapAnChinhXac = q.dapAnDienTu;
          } else if (q.loai === 'essay') {
            base.goiYChamDiem = q.goiYChamDiem;
          }

          return base;
        })
      };

      setSavedJson(JSON.stringify(exportData, null, 2));
    } else {
      setSavedJson(null);
    }
  };

  return (
    <div className="card single-column-card">
      <h2 className="card-title">
        <BookOpen size={22} /> Bài 3: Giảng Viên Tạo Đề Thi Đa Dạng Hình Thức
      </h2>
      <p className="card-subtitle">
        Hỗ trợ nhiều dạng câu hỏi: Trắc nghiệm đơn, nhiều đáp án, Đúng/Sai, điền khuyết và tự luận ngắn
      </p>

      {/* Thông tin chung đề thi */}
      <fieldset className="form-section">
        <legend>Thông tin đề thi</legend>
        <div className="form-row">
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Tên đề thi <span className="required">*</span></label>
            <input
              type="text"
              name="tenDeThi"
              value={deThi.tenDeThi}
              onChange={handleDeThiChange}
              placeholder="Nhập tên đề thi..."
            />
          </div>
          <div className="form-group">
            <label>Môn học</label>
            <input
              type="text"
              name="monHoc"
              value={deThi.monHoc}
              onChange={handleDeThiChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Thời gian làm bài (phút)</label>
            <input
              type="number"
              name="thoiGian"
              min="1"
              value={deThi.thoiGian}
              onChange={handleDeThiChange}
            />
          </div>
          <div className="form-group">
            <label>Mức độ đề thi</label>
            <select name="mucDo" value={deThi.mucDo} onChange={handleDeThiChange}>
              <option value="Dễ">Dễ</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Khó">Khó</option>
              <option value="Tổng hợp">Tổng hợp</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tổng điểm tự tính</label>
            <input
              type="text"
              readOnly
              value={`${tongDiem} điểm`}
              style={{ backgroundColor: '#f4f4f5', fontWeight: 700, color: 'var(--text-main)' }}
            />
          </div>
        </div>
      </fieldset>

      {/* Danh sách câu hỏi */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Danh sách câu hỏi ({questions.length} câu)
        </h3>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleAddQuestion}>
          <Plus size={16} /> Thêm Câu Hỏi Mới
        </button>
      </div>

      {questions.map((q, qIndex) => {
        const typeInfo = QUESTION_TYPES.find(t => t.value === q.loai) || QUESTION_TYPES[0];

        return (
          <div
            key={q.id}
            className="form-section"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '20px',
              marginBottom: '20px'
            }}
          >
            {/* Header thanh công cụ của từng câu hỏi */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                  Câu {qIndex + 1}:
                </span>

                {/* Chọn dạng câu hỏi */}
                <select
                  value={q.loai}
                  onChange={(e) => handleQuestionTypeChange(q.id, e.target.value)}
                  style={{
                    padding: '5px 10px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    width: 'auto',
                    minWidth: '220px',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  {QUESTION_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Điểm:</span>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={q.diem}
                    onChange={(e) => handleQuestionFieldChange(q.id, 'diem', e.target.value)}
                    style={{ width: '64px', padding: '4px 8px', fontSize: '0.88rem' }}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  title="Xóa câu hỏi này"
                  onClick={() => handleDeleteQuestion(q.id)}
                >
                  <Trash2 size={14} /> Xóa
                </button>
              </div>
            </div>

            {/* Nội dung câu hỏi */}
            <div className="form-group">
              <label>Nội dung câu hỏi <span className="required">*</span></label>
              <textarea
                rows="2"
                placeholder="Nhập nội dung đề bài câu hỏi..."
                value={q.noiDung}
                onChange={(e) => handleQuestionFieldChange(q.id, 'noiDung', e.target.value)}
              />
            </div>

            {/* ======================================================== */}
            {/* CÁC HÌNH THỨC CÂU TRẢ LỜI TƯƠNG ỨNG VỚI TỪNG DẠNG         */}
            {/* ======================================================== */}

            {/* 1. DẠNG TRẮC NGHIỆM ĐƠN (1 ĐÁP ÁN ĐÚNG - RADIO) */}
            {q.loai === 'single' && (
              <div style={{ paddingLeft: '8px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Lựa chọn đáp án (Tích chọn 1 nút tròn để đánh dấu đáp án đúng):
                </div>
                {q.dapAns.map((ans, aIdx) => (
                  <div key={ans.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <input
                      type="radio"
                      name={`correct_single_${q.id}`}
                      checked={ans.isCorrect}
                      onChange={() => handleSelectSingleCorrect(q.id, ans.id)}
                      title="Đánh dấu đáp án đúng"
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--text-main)' }}
                    />
                    <input
                      type="text"
                      placeholder={`Đáp án ${String.fromCharCode(65 + aIdx)}`}
                      value={ans.text}
                      onChange={(e) => handleAnswerTextChange(q.id, ans.id, e.target.value)}
                      style={{
                        borderColor: ans.isCorrect ? '#16a34a' : undefined,
                        backgroundColor: ans.isCorrect ? '#f0fdf4' : undefined
                      }}
                    />
                    {q.dapAns.length > 2 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px' }}
                        onClick={() => handleDeleteAnswer(q.id, ans.id)}
                        title="Xóa lựa chọn này"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '4px' }}
                  onClick={() => handleAddAnswer(q.id)}
                >
                  <Plus size={14} /> Thêm Lựa Chọn Đáp Án
                </button>
              </div>
            )}

            {/* 2. DẠNG TRẮC NGHIỆM NHIỀU ĐÁP ÁN (CHECKBOX) */}
            {q.loai === 'multiple' && (
              <div style={{ paddingLeft: '8px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Lựa chọn đáp án (Tích các ô vuông để đánh dấu các đáp án đúng - cho phép nhiều lựa chọn):
                </div>
                {q.dapAns.map((ans, aIdx) => (
                  <div key={ans.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      checked={ans.isCorrect}
                      onChange={() => handleToggleMultipleCorrect(q.id, ans.id)}
                      title="Đánh dấu đáp án đúng"
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--text-main)' }}
                    />
                    <input
                      type="text"
                      placeholder={`Lựa chọn ${String.fromCharCode(65 + aIdx)}`}
                      value={ans.text}
                      onChange={(e) => handleAnswerTextChange(q.id, ans.id, e.target.value)}
                      style={{
                        borderColor: ans.isCorrect ? '#16a34a' : undefined,
                        backgroundColor: ans.isCorrect ? '#f0fdf4' : undefined
                      }}
                    />
                    {q.dapAns.length > 2 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px' }}
                        onClick={() => handleDeleteAnswer(q.id, ans.id)}
                        title="Xóa lựa chọn này"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '4px' }}
                  onClick={() => handleAddAnswer(q.id)}
                >
                  <Plus size={14} /> Thêm Lựa Chọn Đáp Án
                </button>
              </div>
            )}

            {/* 3. DẠNG ĐÚNG / SAI (TRUE / FALSE) */}
            {q.loai === 'true_false' && (
              <div style={{ padding: '12px 14px', backgroundColor: '#f4f4f5', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Chọn kết luận chính xác cho mệnh đề trên:
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: '1px solid',
                      borderColor: q.dapAns.find(a => a.text === 'Đúng')?.isCorrect ? '#16a34a' : 'var(--border-color)',
                      backgroundColor: q.dapAns.find(a => a.text === 'Đúng')?.isCorrect ? '#f0fdf4' : '#ffffff',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    <input
                      type="radio"
                      name={`tf_${q.id}`}
                      checked={q.dapAns.find(a => a.text === 'Đúng')?.isCorrect || false}
                      onChange={() => handleSelectTrueFalse(q.id, true)}
                      style={{ accentColor: 'var(--text-main)' }}
                    />
                    <span>✓ Đáp án ĐÚNG (True)</span>
                  </label>

                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: '1px solid',
                      borderColor: q.dapAns.find(a => a.text === 'Sai')?.isCorrect ? '#dc2626' : 'var(--border-color)',
                      backgroundColor: q.dapAns.find(a => a.text === 'Sai')?.isCorrect ? '#fef2f2' : '#ffffff',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    <input
                      type="radio"
                      name={`tf_${q.id}`}
                      checked={q.dapAns.find(a => a.text === 'Sai')?.isCorrect || false}
                      onChange={() => handleSelectTrueFalse(q.id, false)}
                      style={{ accentColor: 'var(--text-main)' }}
                    />
                    <span>✗ Đáp án SAI (False)</span>
                  </label>
                </div>
              </div>
            )}

            {/* 4. DẠNG ĐIỀN VÀO CHỖ TRỐNG (FILL IN THE BLANK) */}
            {q.loai === 'fill_blank' && (
              <div style={{ padding: '14px', backgroundColor: '#fafafa', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <div className="form-group" style={{ marginBottom: 8 }}>
                  <label>Từ khóa / Đáp án chính xác cần điền <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="VD: Integration, Scrum, React..."
                    value={q.dapAnDienTu || ''}
                    onChange={(e) => handleQuestionFieldChange(q.id, 'dapAnDienTu', e.target.value)}
                    style={{ fontWeight: 600, letterSpacing: '0.3px' }}
                  />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>* Thí sinh sẽ nhìn thấy ô nhập văn bản tại vị trí chỗ trống để điền câu trả lời.</span>
                </div>
              </div>
            )}

            {/* 5. DẠNG TỰ LUẬN NGẮN (ESSAY) */}
            {q.loai === 'essay' && (
              <div style={{ padding: '14px', backgroundColor: '#fafafa', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <div className="form-group" style={{ marginBottom: 6 }}>
                  <label>Gợi ý chấm điểm / Đáp án mẫu chuẩn <span className="required">*</span></label>
                  <textarea
                    rows="3"
                    placeholder="Nhập dàn ý câu trả lời mẫu, các từ khóa bắt buộc hoặc barem thang điểm..."
                    value={q.goiYChamDiem || ''}
                    onChange={(e) => handleQuestionFieldChange(q.id, 'goiYChamDiem', e.target.value)}
                  />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  * Dùng làm tiêu chuẩn cho giảng viên đối chiếu chấm điểm hoặc hệ thống AI tự động chấm.
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Hiển thị lỗi kiểm tra */}
      {validationErrors.length > 0 && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #fecaca', borderRadius: '4px', padding: '14px 18px', marginBottom: '20px' }}>
          <div style={{ fontWeight: 700, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.92rem' }}>
            <AlertCircle size={16} /> Vui lòng kiểm tra lại các yêu cầu sau:
          </div>
          <ul style={{ paddingLeft: '20px', color: 'var(--danger)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Nút hành động */}
      <div className="actions-row">
        <button type="button" className="btn btn-secondary" onClick={() => setShowPreview(!showPreview)}>
          <Eye size={16} /> {showPreview ? 'Ẩn Bản Xem Trước' : 'Xem Trước Đề Thi'}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSaveExam}>
          <Save size={16} /> Lưu & Xuất Cấu Trúc Đề Thi (JSON)
        </button>
      </div>

      {/* Khối Xem trước đề thi */}
      {showPreview && (
        <div style={{ marginTop: '28px', padding: '24px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              ĐỀ THI TRỰC TUYẾN
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
              {deThi.tenDeThi}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
              Môn học: <strong>{deThi.monHoc}</strong> • Thời gian: <strong>{deThi.thoiGian} phút</strong> • Mức độ: <strong>{deThi.mucDo}</strong> • Tổng điểm: <strong>{tongDiem}</strong>
            </p>
          </div>

          {questions.map((q, idx) => {
            const typeInfo = QUESTION_TYPES.find(t => t.value === q.loai) || QUESTION_TYPES[0];

            return (
              <div key={q.id} style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    Câu {idx + 1} ({q.diem} điểm): {q.noiDung || <em>(Chưa nhập câu hỏi)</em>}
                  </p>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '3px', backgroundColor: '#f4f4f5', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {typeInfo.badge}
                  </span>
                </div>

                <div style={{ paddingLeft: '16px', marginTop: '8px' }}>
                  {/* Trắc nghiệm đơn */}
                  {q.loai === 'single' && q.dapAns.map((a, aIdx) => (
                    <div key={a.id} style={{ margin: '4px 0', fontSize: '0.9rem', color: a.isCorrect ? '#15803d' : 'var(--text-main)' }}>
                      <strong>{String.fromCharCode(65 + aIdx)}.</strong> {a.text || <em>(Trống)</em>}
                      {a.isCorrect && '  ✔ [Đáp án đúng]'}
                    </div>
                  ))}

                  {/* Trắc nghiệm nhiều đáp án */}
                  {q.loai === 'multiple' && q.dapAns.map((a, aIdx) => (
                    <div key={a.id} style={{ margin: '4px 0', fontSize: '0.9rem', color: a.isCorrect ? '#15803d' : 'var(--text-main)' }}>
                      <strong>[ {String.fromCharCode(65 + aIdx)} ]</strong> {a.text || <em>(Trống)</em>}
                      {a.isCorrect && '  ✔ [Đáp án đúng]'}
                    </div>
                  ))}

                  {/* Đúng / Sai */}
                  {q.loai === 'true_false' && (
                    <div style={{ margin: '6px 0', fontSize: '0.9rem' }}>
                      <span style={{ color: q.dapAns.find(a => a.text === 'Đúng')?.isCorrect ? '#15803d' : 'var(--text-muted)' }}>
                        [ {q.dapAns.find(a => a.text === 'Đúng')?.isCorrect ? '✔' : ' '} ] Đúng
                      </span>
                      <span style={{ margin: '0 12px', color: 'var(--border-color)' }}>|</span>
                      <span style={{ color: q.dapAns.find(a => a.text === 'Sai')?.isCorrect ? '#15803d' : 'var(--text-muted)' }}>
                        [ {q.dapAns.find(a => a.text === 'Sai')?.isCorrect ? '✔' : ' '} ] Sai
                      </span>
                    </div>
                  )}

                  {/* Điền vào chỗ trống */}
                  {q.loai === 'fill_blank' && (
                    <div style={{ margin: '6px 0', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Ô nhập của thí sinh:</span>{' '}
                      <span style={{ padding: '2px 14px', borderBottom: '2px solid var(--text-main)', fontFamily: 'monospace' }}>
                        [ ____________ ]
                      </span>{' '}
                      <span style={{ color: '#15803d', fontWeight: 600, marginLeft: 8 }}>
                        ✔ [Đáp án đúng: {q.dapAnDienTu || 'Trống'}]
                      </span>
                    </div>
                  )}

                  {/* Tự luận */}
                  {q.loai === 'essay' && (
                    <div style={{ margin: '6px 0', fontSize: '0.9rem' }}>
                      <div style={{ width: '100%', height: '50px', border: '1px dashed var(--border-color)', borderRadius: '4px', padding: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        (Khu vực thí sinh soạn thảo câu trả lời tự luận...)
                      </div>
                      <div style={{ marginTop: '6px', color: '#15803d', fontSize: '0.85rem' }}>
                        <strong>Gợi ý chấm điểm:</strong> {q.goiYChamDiem || '(Chưa có)'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Khối Hiển thị JSON */}
      {savedJson && (
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 700, fontSize: '0.92rem' }}>
            <CheckCircle size={18} /> Đã kiểm tra tính hợp lệ và xuất cấu trúc đề thi JSON thành công!
          </div>
          <div className="json-viewer">
            <pre>{savedJson}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
