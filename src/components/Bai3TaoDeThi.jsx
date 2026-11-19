import React, { useState, useMemo } from 'react';
import { BookOpen, Plus, Trash2, Eye, Save, AlertCircle, CheckCircle } from 'lucide-react';

const initialDeThi = {
  tenDeThi: 'Kiểm tra giữa kỳ Công nghệ Phần mềm',
  monHoc: 'Công nghệ Phần mềm',
  thoiGian: 45,
  soLuongCauHoi: 2,
  mucDo: 'Trung bình'
};

const initialQuestions = [
  {
    id: 1,
    noiDung: 'Mô hình phát triển phần mềm nào lặp lại qua các Sprint?',
    loai: 'Trắc nghiệm đơn',
    diem: 5,
    dapAns: [
      { id: 101, text: 'Mô hình Thác nước (Waterfall)', isCorrect: false },
      { id: 102, text: 'Mô hình Scrum (Agile)', isCorrect: true },
      { id: 103, text: 'Mô hình V-Model', isCorrect: false }
    ]
  },
  {
    id: 2,
    noiDung: 'Đâu KHÔNG phải là một nguyên lý cơ bản của lập trình hướng đối tượng (OOP)?',
    loai: 'Trắc nghiệm đơn',
    diem: 5,
    dapAns: [
      { id: 201, text: 'Tính đóng gói (Encapsulation)', isCorrect: false },
      { id: 202, text: 'Tính trừu tượng (Abstraction)', isCorrect: false },
      { id: 203, text: 'Tính tiếp biến (Transmutation)', isCorrect: true },
      { id: 204, text: 'Tính kế thừa (Inheritance)', isCorrect: false }
    ]
  }
];

export default function Bai3TaoDeThi() {
  const [deThi, setDeThi] = useState(initialDeThi);
  const [questions, setQuestions] = useState(initialQuestions);
  const [showPreview, setShowPreview] = useState(false);
  const [savedJson, setSavedJson] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  // Chức năng 8: Tự động tính tổng điểm
  const tongDiem = useMemo(() => {
    return questions.reduce((sum, q) => sum + (parseFloat(q.diem) || 0), 0);
  }, [questions]);

  // Đổi thông tin chung đề thi
  const handleDeThiChange = (e) => {
    const { name, value } = e.target;
    setDeThi(prev => ({ ...prev, [name]: value }));
  };

  // Chức năng 1: Thêm câu hỏi
  const handleAddQuestion = () => {
    const newQ = {
      id: Date.now(),
      noiDung: '',
      loai: 'Trắc nghiệm đơn',
      diem: 1,
      dapAns: [
        { id: Date.now() + 1, text: '', isCorrect: true },
        { id: Date.now() + 2, text: '', isCorrect: false }
      ]
    };
    setQuestions(prev => [...prev, newQ]);
  };

  // Chức năng 2: Xóa câu hỏi
  const handleDeleteQuestion = (qId) => {
    setQuestions(prev => prev.filter(q => q.id !== qId));
  };

  // Chức năng 3 & 7: Sửa nội dung hoặc điểm số của câu hỏi
  const handleQuestionFieldChange = (qId, field, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  // Chức năng 4: Thêm đáp án cho câu hỏi
  const handleAddAnswer = (qId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        const newAns = { id: Date.now(), text: '', isCorrect: false };
        return { ...q, dapAns: [...q.dapAns, newAns] };
      }
      return q;
    }));
  };

  // Chức năng 5: Xóa đáp án
  const handleDeleteAnswer = (qId, aId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return { ...q, dapAns: q.dapAns.filter(a => a.id !== aId) };
      }
      return q;
    }));
  };

  // Sửa text đáp án
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

  // Chức năng 6: Chọn đáp án đúng
  const handleSelectCorrectAnswer = (qId, aId) => {
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

  // Chức năng 9 & 10: Validate câu hỏi
  const validateExam = () => {
    const errs = [];
    if (!deThi.tenDeThi.trim()) errs.push('Tên đề thi không được để trống.');
    if (questions.length === 0) errs.push('Đề thi phải có ít nhất 1 câu hỏi.');

    questions.forEach((q, idx) => {
      const qNum = idx + 1;
      if (!q.noiDung.trim()) {
        errs.push(`Câu hỏi số ${qNum}: Nội dung câu hỏi không được để trống.`);
      }
      // Chức năng 9: Mỗi câu hỏi phải có ít nhất 2 đáp án
      if (!q.dapAns || q.dapAns.length < 2) {
        errs.push(`Câu hỏi số ${qNum}: Phải có ít nhất 2 lựa chọn đáp án.`);
      } else {
        const emptyAns = q.dapAns.some(a => !a.text.trim());
        if (emptyAns) {
          errs.push(`Câu hỏi số ${qNum}: Vui lòng nhập nội dung cho tất cả các đáp án.`);
        }
      }
      // Chức năng 10: Mỗi câu hỏi phải có đáp án đúng
      const hasCorrect = q.dapAns && q.dapAns.some(a => a.isCorrect);
      if (!hasCorrect) {
        errs.push(`Câu hỏi số ${qNum}: Chưa chọn đáp án đúng.`);
      }
    });

    setValidationErrors(errs);
    return errs.length === 0;
  };

  // Chức năng 12: Lưu đề thi và hiển thị JSON
  const handleSaveExam = () => {
    if (validateExam()) {
      const exportData = {
        thongTinDeThi: {
          ...deThi,
          soLuongCauHoiThucTe: questions.length,
          tongDiem: tongDiem,
          ngayTao: new Date().toISOString()
        },
        danhSachCauHoi: questions.map((q, idx) => ({
          stt: idx + 1,
          noiDung: q.noiDung,
          loai: q.loai,
          diem: parseFloat(q.diem),
          dapAn: q.dapAns.map(a => ({
            noiDung: a.text,
            laDapAnDung: a.isCorrect
          }))
        }))
      };

      setSavedJson(JSON.stringify(exportData, null, 2));
    } else {
      setSavedJson(null);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <BookOpen className="text-primary" /> Bài 3: Giảng Viên Tạo Đề Thi Trắc Nghiệm
      </h2>
      <p className="card-subtitle">Hệ thống biên soạn đề thi, quản lý đáp án và xuất dữ liệu JSON</p>

      {/* Thông tin đề thi */}
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
            <label>Tổng điểm tự tính (Chức năng 8)</label>
            <input
              type="text"
              readOnly
              value={`${tongDiem} điểm`}
              style={{ backgroundColor: '#ecfdf5', color: '#16a34a', fontWeight: 'bold' }}
            />
          </div>
        </div>
      </fieldset>

      {/* Danh sách câu hỏi */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#1e293b' }}>Danh sách câu hỏi ({questions.length} câu)</h3>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleAddQuestion}>
          <Plus size={16} /> Thêm Câu Hỏi Mới
        </button>
      </div>

      {questions.map((q, qIndex) => (
        <div key={q.id} className="form-section" style={{ backgroundColor: '#fdfdfd', borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 700, color: '#1d4ed8' }}>Câu {qIndex + 1}:</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.85rem' }}>Điểm:</span>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={q.diem}
                  onChange={(e) => handleQuestionFieldChange(q.id, 'diem', e.target.value)}
                  style={{ width: '70px', padding: '4px 8px' }}
                />
              </div>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                title="Xóa câu hỏi"
                onClick={() => handleDeleteQuestion(q.id)}
              >
                <Trash2 size={14} /> Xóa
              </button>
            </div>
          </div>

          <div className="form-group">
            <textarea
              rows="2"
              placeholder="Nhập nội dung câu hỏi..."
              value={q.noiDung}
              onChange={(e) => handleQuestionFieldChange(q.id, 'noiDung', e.target.value)}
            />
          </div>

          {/* Đáp án */}
          <div style={{ paddingLeft: '12px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
              Danh sách lựa chọn (Tích chọn để đánh dấu đáp án đúng):
            </div>
            {q.dapAns.map((ans, aIdx) => (
              <div key={ans.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <input
                  type="radio"
                  name={`correct_${q.id}`}
                  checked={ans.isCorrect}
                  onChange={() => handleSelectCorrectAnswer(q.id, ans.id)}
                  title="Chọn làm đáp án đúng"
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
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
                    title="Xóa đáp án"
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
        </div>
      ))}

      {/* Hiển thị lỗi kiểm tra (Chức năng 9 & 10) */}
      {validationErrors.length > 0 && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
          <div style={{ fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <AlertCircle size={16} /> Vui lòng hoàn thiện các yêu cầu sau:
          </div>
          <ul style={{ paddingLeft: '24px', color: '#991b1b', fontSize: '0.9rem' }}>
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Nút hành động */}
      <div className="actions-row">
        {/* Chức năng 11: Xem trước đề thi */}
        <button type="button" className="btn btn-secondary" onClick={() => setShowPreview(!showPreview)}>
          <Eye size={18} /> {showPreview ? 'Ẩn Bản Xem Trước' : 'Xem Trước Đề Thi'}
        </button>
        {/* Chức năng 12: Lưu đề thi và hiển thị JSON */}
        <button type="button" className="btn btn-success" onClick={handleSaveExam}>
          <Save size={18} /> Lưu Đề Thi (JSON)
        </button>
      </div>

      {/* Chức năng 11: Khối Xem trước đề thi */}
      {showPreview && (
        <div style={{ marginTop: '24px', padding: '20px', border: '2px dashed #3b82f6', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
          <h3 style={{ textAlign: 'center', color: '#1e3a8a', textTransform: 'uppercase' }}>{deThi.tenDeThi}</h3>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>
            Môn học: <strong>{deThi.monHoc}</strong> | Thời gian: <strong>{deThi.thoiGian} phút</strong> | Mức độ: <strong>{deThi.mucDo}</strong> | Tổng điểm: <strong>{tongDiem}</strong>
          </p>
          <hr style={{ margin: '12px 0', borderColor: '#e2e8f0' }} />

          {questions.map((q, idx) => (
            <div key={q.id} style={{ marginBottom: '14px' }}>
              <p style={{ fontWeight: 600 }}>
                Câu {idx + 1} ({q.diem} điểm): {q.noiDung || <em>(Chưa nhập câu hỏi)</em>}
              </p>
              <div style={{ paddingLeft: '16px', marginTop: '6px' }}>
                {q.dapAns.map((a, aIdx) => (
                  <div key={a.id} style={{ margin: '3px 0', color: a.isCorrect ? '#15803d' : '#334155' }}>
                    <strong>{String.fromCharCode(65 + aIdx)}.</strong> {a.text || <em>(Trống)</em>}
                    {a.isCorrect && '  ✔ [Đáp án đúng]'}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chức năng 12: Khối Hiển thị JSON */}
      {savedJson && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 600 }}>
            <CheckCircle size={18} /> Đã kiểm tra hợp lệ và lưu cấu trúc đề thi thành công!
          </div>
          <div className="json-viewer">
            <pre>{savedJson}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
