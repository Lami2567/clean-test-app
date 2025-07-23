import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Modal from 'react-modal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faEnvelope, faTableList, faClock, faUsers, faRightToBracket, faEye, faXmark } from '@fortawesome/free-solid-svg-icons';

const API_URL = process.env.REACT_APP_API_URL;
console.log(API_URL);
function Login({ onLogin, isAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const handleForgot = (e) => {
    e.preventDefault();
    // Placeholder for backend integration
    setForgotSent(true);
    toast.info('Password reset link sent (demo).');
  };

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onLogin(email, password, setError, setLoading);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-placeholder"><FontAwesomeIcon icon={faUsers} /></div>
        <h2 className="login-title">Admin Login</h2>
        <form className="login-form" onSubmit={handleSubmit} aria-label="Login form">
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            aria-label="Email address"
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
          <button type="submit" className="login-button" disabled={loading} aria-label="Login">
            {loading ? <ClipLoader size={20} color="#F0E68C" /> : 'Login'}
          </button>
          <button
            type="button"
            className="login-forgot"
            tabIndex={0}
            aria-label="Forgot Password?"
            onClick={() => { setShowForgot(true); setForgotSent(false); setForgotEmail(''); }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setShowForgot(true); setForgotSent(false); setForgotEmail(''); } }}
            style={{ background: 'none', border: 'none', color: '#F0E68C', textDecoration: 'underline', cursor: 'pointer', marginTop: '0.7rem', fontSize: '1rem' }}
          >
            Forgot Password?
          </button>
          {error && <div className="login-error">{error}</div>}
        </form>
        <Modal
          isOpen={showForgot}
          onRequestClose={() => setShowForgot(false)}
          className="forgot-modal"
          overlayClassName="email-preview-overlay"
          ariaHideApp={false}
          contentLabel="Forgot Password Modal"
        >
          <h3><FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8 }} />Forgot Password</h3>
          <form onSubmit={handleForgot} aria-label="Forgot password form">
            <input
              type="email"
              className="login-input"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              required
              aria-label="Email for password reset"
              autoFocus
            />
            <button className="login-button" type="submit" style={{ marginTop: '1rem' }} aria-label="Send reset link">Send Reset Link</button>
            {forgotSent && <div className="login-error" style={{ background: '#4B5320', color: '#F0E68C', marginTop: '0.7rem' }}>Reset link sent! Check your email.</div>}
          </form>
          <button className="email-preview-close" onClick={() => setShowForgot(false)} style={{ marginTop: '1rem' }}><FontAwesomeIcon icon={faXmark} style={{ marginRight: 8 }} />Close</button>
        </Modal>
      </div>
    </div>
  );
}

function DashboardHome({ user }) {
  // Mock stats
  const stats = [
    { label: 'Total Emails Sent', value: 128, icon: faEnvelope, color: '#4B5320' },
    { label: 'Last Email Sent', value: '2024-06-05 13:00', icon: faClock, color: '#808000' },
    { label: 'Recipient Groups', value: 4, icon: faUsers, color: '#013220' },
  ];
  // Mock recent activity
  const activity = [
    { type: 'email', desc: 'Sent "Class Trip" to S2', time: '2024-06-05 13:00', icon: faEnvelope },
    { type: 'login', desc: 'Admin logged in', time: '2024-06-05 12:55', icon: faRightToBracket },
    { type: 'email', desc: 'Sent "Sports Day" to Students', time: '2024-06-04 11:00', icon: faEnvelope },
    { type: 'email', desc: 'Sent "PTA Meeting" to Parents', time: '2024-06-02 14:30', icon: faEnvelope },
  ];
  // Mock chart data
  const chartData = [
    { date: 'Jun 1', emails: 2 },
    { date: 'Jun 2', emails: 1 },
    { date: 'Jun 3', emails: 1 },
    { date: 'Jun 4', emails: 2 },
    { date: 'Jun 5', emails: 1 },
  ];
  // Quick actions
  const quickActions = [
    { label: 'Send to All', recipient: 'all' },
    { label: 'Send to Parents', recipient: 'parents' },
    { label: 'Send to Students', recipient: 'students' },
    { label: 'Send to S1', recipient: 'class', class: 's1' },
  ];
  const handleQuickAction = (action) => {
    toast.info(`Quick action: Pre-fill email sender for ${action.label}`);
    // In a real app, navigate to email sender and pre-fill recipient
  };
  return (
    <div className="dashboard-home-root">
      <div className="dashboard-welcome-card">
        <div className="dashboard-welcome-title">Welcome, Admin!</div>
        <div className="dashboard-welcome-desc">Manage your school notifications and view email activity below.</div>
      </div>
      <div className="dashboard-stats-row">
        {stats.map((stat, idx) => (
          <div className="dashboard-stat-card" key={idx} style={{ borderColor: stat.color }}>
            <div className="dashboard-stat-icon" style={{ color: stat.color }}><FontAwesomeIcon icon={stat.icon} /></div>
            <div className="dashboard-stat-value">{stat.value}</div>
            <div className="dashboard-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="dashboard-quick-actions">
        {quickActions.map((action, idx) => (
          <button key={idx} className="dashboard-quick-btn" onClick={() => handleQuickAction(action)}>{action.label}</button>
        ))}
      </div>
      <div className="dashboard-activity-chart-row">
        <div className="dashboard-activity-feed">
          <div className="dashboard-activity-title">Recent Activity</div>
          <ul>
            {activity.map((item, idx) => (
              <li key={idx} className={`dashboard-activity-item dashboard-activity-${item.type}`}>
                <span className="dashboard-activity-icon"><FontAwesomeIcon icon={item.icon} /></span>
                <span className="dashboard-activity-desc">{item.desc}</span>
                <span className="dashboard-activity-time">{new Date(item.time.replace(' ', 'T')).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="dashboard-activity-chart">
          <div className="dashboard-activity-title">Email Activity</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="emails" fill="#4B5320" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function EmailSender({ user }) {
  const [recipient, setRecipient] = useState('all');
  const [selectedClass, setSelectedClass] = useState('s1');
  const [subject, setSubject] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [groups, setGroups] = useState(['all', 'students', 'parents']);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [resolvedEmails, setResolvedEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);

  // Fetch recipient groups/classes from backend
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    fetch(`${API_URL}/api/email/recipients`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setGroups(data.groups);
        setClasses(data.classes);
      })
      .catch(() => {
        setGroups(['all', 'students', 'parents']);
        setClasses([]);
      });
  }, []);

  // Fetch recipient emails when group/class changes
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    let url = `${API_URL}/api/email/recipients`;
    let params = '';
    if (recipient === 'class' && selectedClass) {
      params = `?group=class&classId=${selectedClass}`;
    } else if (recipient) {
      params = `?group=${recipient}`;
    }
    fetch(`${API_URL}${params ? '/api/email/recipients' + params : '/api/email/recipients'}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setResolvedEmails(data.emails || []);
        setSelectedEmails(data.emails || []);
      })
      .catch(() => {
        setResolvedEmails([]);
        setSelectedEmails([]);
      });
  }, [recipient, selectedClass]);

  const handleAttachment = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleEmailToggle = (email) => {
    setSelectedEmails(selectedEmails.includes(email)
      ? selectedEmails.filter(e => e !== email)
      : [...selectedEmails, email]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setSent(false);
    setError('');
    try {
      const token = localStorage.getItem('jwt');
      const form = new FormData();
      form.append('subject', subject);
      const htmlMessage = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      form.append('message', htmlMessage);
      form.append('recipients', selectedEmails.join(','));
      if (recipient === 'class') {
        form.append('class', selectedClass);
      }
      attachments.forEach(file => form.append('attachments', file));
      const res = await fetch(`${API_URL}/api/email/send`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to send email');
        setSending(false);
        toast.error(data.error || 'Failed to send email');
        return;
      }
      setSending(false);
      setSent(true);
      setSubject('');
      setEditorState(EditorState.createEmpty());
      setRecipient('all');
      setSelectedClass('s1');
      setAttachments([]);
      setResolvedEmails([]);
      setSelectedEmails([]);
      toast.success('Email sent successfully!');
    } catch (err) {
      setError('Failed to send email');
      setSending(false);
      toast.error('Failed to send email');
    }
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  return (
    <form className="email-sender-form" onSubmit={handleSend}>
      <label className="email-label">
        Recipient Group
        <select
          className="email-input"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          required
        >
          {groups.map(group => (
            <option key={group} value={group}>{group.charAt(0).toUpperCase() + group.slice(1)}</option>
          ))}
        </select>
      </label>
      {recipient === 'class' && (
        <label className="email-label">
          Select Class
          <select
            className="email-input"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            required
          >
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls.toUpperCase()}</option>
            ))}
          </select>
        </label>
      )}
      {resolvedEmails.length > 0 && (
        <div className="email-recipients-list">
          <div style={{ fontWeight: 600, color: '#4B5320', marginBottom: 6 }}>Recipients:</div>
          <div style={{ maxHeight: 120, overflowY: 'auto', border: '1px solid #808000', borderRadius: 8, padding: 8, background: '#f7fbe8' }}>
            {resolvedEmails.map(email => (
              <label key={email} style={{ display: 'block', marginBottom: 4 }}>
                <input
                  type="checkbox"
                  checked={selectedEmails.includes(email)}
                  onChange={() => handleEmailToggle(email)}
                  style={{ marginRight: 8 }}
                />
                {email}
              </label>
            ))}
          </div>
        </div>
      )}
      <label className="email-label">
        Subject
        <input
          className="email-input"
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
        />
      </label>
      <label className="email-label">
        Message
        <div className="email-draft-editor">
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="rdw-wrapper"
            editorClassName="rdw-editor"
            toolbarClassName="rdw-toolbar"
            editorStyle={{ minHeight: 120, background: '#fffde4', borderRadius: 8, padding: 8, color: '#013220' }}
          />
        </div>
      </label>
      <label className="email-label">
        Attachments (PDF, Images)
        <input
          className="email-input"
          type="file"
          accept=".pdf,image/*"
          multiple
          onChange={handleAttachment}
        />
        <div className="email-attachments-preview">
          {attachments.map((file, idx) => (
            <div key={idx} className="email-attachment-item">
              {file.type.startsWith('image') ? (
                <img src={URL.createObjectURL(file)} alt={file.name} className="email-attachment-thumb" />
              ) : (
                <span className="email-attachment-file">{file.name}</span>
              )}
            </div>
          ))}
        </div>
      </label>
      {error && <div className="email-sender-error">{error}</div>}
      <div className="email-sender-actions">
        <button type="button" className="email-preview-btn" onClick={handlePreview} disabled={sending} aria-label="Preview">
          <FontAwesomeIcon icon={faEye} style={{ marginRight: 8 }} /> Preview
        </button>
        <button className="email-send-btn" type="submit" disabled={sending} aria-label="Send Email">
          {sending ? <ClipLoader size={20} color="#4B5320" /> : <><FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8 }} />Send Email</>}
        </button>
      </div>
      {sent && <div className="email-sent-confirm">Email sent successfully!</div>}
      <Modal
        isOpen={showPreview}
        onRequestClose={() => setShowPreview(false)}
        className="email-preview-modal"
        overlayClassName="email-preview-overlay"
        ariaHideApp={false}
      >
        <h3>Email Preview</h3>
        <div><b>To:</b> {recipient === 'class' ? selectedClass.toUpperCase() : recipient.charAt(0).toUpperCase() + recipient.slice(1)}</div>
        <div><b>Subject:</b> {subject}</div>
        <div><b>Message:</b></div>
        <div className="email-preview-message" dangerouslySetInnerHTML={{ __html: draftToHtml(convertToRaw(editorState.getCurrentContent())) }} />
        {attachments.length > 0 && <div><b>Attachments:</b></div>}
        <div className="email-attachments-preview">
          {attachments.map((file, idx) => (
            <div key={idx} className="email-attachment-item">
              {file.type.startsWith('image') ? (
                <img src={URL.createObjectURL(file)} alt={file.name} className="email-attachment-thumb" />
              ) : (
                <span className="email-attachment-file">{file.name}</span>
              )}
            </div>
          ))}
        </div>
        <button className="email-preview-close" onClick={() => setShowPreview(false)}><FontAwesomeIcon icon={faXmark} style={{ marginRight: 8 }} />Close</button>
      </Modal>
    </form>
  );
}

function EmailLogs({ user }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [count, setCount] = useState(0);
  const [pageSize] = useState(5);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [detailLog, setDetailLog] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Fetch logs from backend
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    fetch(`${API_URL}/api/email/logs?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setLogs(data.logs);
        setCount(data.count);
      })
      .catch(() => {
        setLogs([]);
        setCount(0);
      });
  }, [page, pageSize, search]);

  // Format date
  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr.replace(' ', 'T'));
    return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  }

  // Bulk selection
  const isAllSelected = logs.length > 0 && logs.every((_, idx) => selectedLogs.includes(idx));
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLogs([
        ...selectedLogs,
        ...logs.map((_, idx) => idx).filter(idx => !selectedLogs.includes(idx))
      ]);
    } else {
      setSelectedLogs(selectedLogs.filter(idx => !logs.map((_, i) => i).includes(idx)));
    }
  };
  const handleSelectRow = (idx) => {
    setSelectedLogs(selectedLogs.includes(idx)
      ? selectedLogs.filter(i => i !== idx)
      : [...selectedLogs, idx]);
  };
  const handleBulkDelete = () => {
    toast.info('Bulk delete is a demo action. Implement backend logic to delete.');
    setSelectedLogs([]);
  };
  // Detailed view
  const openDetail = (log) => {
    setDetailLog(log);
    setShowDetail(true);
  };
  return (
    <div className="email-logs-table-container">
      <h2><FontAwesomeIcon icon={faTableList} style={{ marginRight: 8 }} />Email Logs</h2>
      <div className="email-logs-controls">
        <input
          className="email-logs-search"
          type="text"
          placeholder="Search by subject or recipient..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
      {selectedLogs.length > 0 && (
        <div className="email-logs-bulk-toolbar">
          <span>{selectedLogs.length} selected</span>
          <button className="email-logs-bulk-delete" onClick={handleBulkDelete}>Delete Selected</button>
        </div>
      )}
      <div className="email-logs-table-wrapper">
        <table className="email-logs-table">
          <thead>
            <tr>
              <th><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} /></th>
              <th>Subject</th>
              <th>Date</th>
              <th>Sent To</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#808000' }}>No logs found.</td></tr>
            ) : (
              logs.map((log, idx) => {
                return (
                  <tr key={idx} className="email-log-row" onClick={e => { if (e.target.type !== 'checkbox') openDetail(log); }} style={{ cursor: 'pointer' }}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedLogs.includes(idx)} onChange={() => handleSelectRow(idx)} /></td>
                    <td>{log.subject}</td>
                    <td>{formatDate(log.sentAt)}</td>
                    <td>{log.recipients}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="email-logs-pagination">
        <button
          className="email-logs-page-btn"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >Prev</button>
        <span className="email-logs-page-info">Page {page} of {Math.ceil(count / pageSize)}</span>
        <button
          className="email-logs-page-btn"
          onClick={() => setPage(page + 1)}
          disabled={page === Math.ceil(count / pageSize)}
        >Next</button>
      </div>
      <Modal
        isOpen={showDetail}
        onRequestClose={() => setShowDetail(false)}
        className="email-log-detail-modal"
        overlayClassName="email-preview-overlay"
        ariaHideApp={false}
      >
        <h3><FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8 }} />Email Details</h3>
        {detailLog && (
          <>
            <div><b>Subject:</b> {detailLog.subject}</div>
            <div><b>Date:</b> {formatDate(detailLog.sentAt)}</div>
            <div><b>Sent To:</b> {detailLog.recipients}</div>
            <div style={{ marginTop: '1rem', color: '#808000' }}><i>Full message and attachments would be shown here if available.</i></div>
          </>
        )}
        <button className="email-preview-close" onClick={() => setShowDetail(false)}><FontAwesomeIcon icon={faXmark} style={{ marginRight: 8 }} />Close</button>
      </Modal>
    </div>
  );
}

function SeedUsers({ user }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('parent');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [newClass, setNewClass] = useState('');
  const [addingClass, setAddingClass] = useState(false);

  // Fetch classes for dropdown
  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line
  }, []);

  const fetchClasses = async () => {
    const token = localStorage.getItem('jwt');
    fetch(`${API_URL}/api/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setClasses(data))
      .catch(() => setClasses([]));
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClass.trim()) return;
    setAddingClass(true);
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${API_URL}/api/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newClass }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Failed to add class');
        setAddingClass(false);
        return;
      }
      setNewClass('');
      toast.success('Class added!');
      fetchClasses();
      setShowClassModal(false);
    } catch {
      toast.error('Failed to add class');
    }
    setAddingClass(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, password, role, classId: role === 'student' ? classId : undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Failed to add user');
        setLoading(false);
        return;
      }
      setName(''); setEmail(''); setPassword(''); setRole('parent'); setClassId('');
      toast.success('User added!');
    } catch {
      toast.error('Failed to add user');
    }
    setLoading(false);
  };

  return (
    <div className="seed-users-root">
      <h2>Seed Users</h2>
      <button className="add-class-btn" onClick={() => setShowClassModal(true)} style={{ alignSelf: 'flex-end', marginBottom: '1.2rem' }}>+ Add Class</button>
      <form className="seed-users-form" onSubmit={handleSubmit}>
        <label>Name<input className="login-input" value={name} onChange={e => setName(e.target.value)} required /></label>
        <label>Email<input className="login-input" value={email} onChange={e => setEmail(e.target.value)} required type="email" /></label>
        <label>Password<input className="login-input" value={password} onChange={e => setPassword(e.target.value)} required type="password" /></label>
        <label>Role
          <select className="login-input" value={role} onChange={e => setRole(e.target.value)}>
            <option value="parent">Parent</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        {role === 'student' && (
          <label>Class
            <select className="login-input" value={classId} onChange={e => setClassId(e.target.value)} required>
              <option value="">Select Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        )}
        <button className="login-button" type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add User'}</button>
      </form>
      <Modal
        isOpen={showClassModal}
        onRequestClose={() => setShowClassModal(false)}
        className="add-class-modal"
        overlayClassName="email-preview-overlay"
        ariaHideApp={false}
        contentLabel="Add Class Modal"
      >
        <h3>Add Class</h3>
        <form onSubmit={handleAddClass} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input className="login-input" value={newClass} onChange={e => setNewClass(e.target.value)} placeholder="e.g. S1" required />
          <button className="login-button" type="submit" disabled={addingClass}>{addingClass ? 'Adding...' : 'Add Class'}</button>
        </form>
        <button className="email-preview-close" onClick={() => setShowClassModal(false)} style={{ marginTop: '1rem' }}>Close</button>
      </Modal>
    </div>
  );
}

function DashboardLayout({ onLogout, user }) {
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Placeholder for dark mode logic
  return (
    <div className={"dashboard-root" + (darkMode ? " dark-mode" : "") }>
      <nav className="dashboard-navbar">
        <div className="dashboard-school-name">🏫 School Admin Panel</div>
        <div className="dashboard-navbar-actions">
          <button className="dashboard-dark-toggle" onClick={() => setDarkMode(dm => !dm)} title="Toggle dark mode">
            {darkMode ? '🌙' : '☀️'}
          </button>
          <div className="dashboard-profile-wrapper">
            <div className="dashboard-profile-avatar" onClick={() => setShowProfile(p => !p)} title="Profile">A</div>
            {showProfile && (
              <div className="dashboard-profile-dropdown">
                <div className="dashboard-profile-name">Admin</div>
                <button className="dashboard-profile-logout" onClick={onLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="dashboard-body">
        <aside className="dashboard-sidebar">
          <ul>
            <li>
              <span className="sidebar-icon"><FontAwesomeIcon icon={faHouse} /></span>
              <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
            </li>
            <hr className="dashboard-sidebar-divider" />
            <li>
              <span className="sidebar-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
              <NavLink to="/dashboard/email-sender" className={({ isActive }) => isActive ? 'active' : ''}>Email Sender</NavLink>
            </li>
            <li>
              <span className="sidebar-icon"><FontAwesomeIcon icon={faTableList} /></span>
              <NavLink to="/dashboard/email-logs" className={({ isActive }) => isActive ? 'active' : ''}>Email Logs</NavLink>
            </li>
            <li>
              <span className="sidebar-icon"><FontAwesomeIcon icon={faUsers} /></span>
              <NavLink to="/dashboard/seed-users" className={({ isActive }) => isActive ? 'active' : ''}>Seed Users</NavLink>
            </li>
          </ul>
        </aside>
        <main className="dashboard-main">
          <Outlet key={location.pathname} />
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme={darkMode ? 'dark' : 'colored'} />
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const timeoutRef = React.useRef();
  const warningRef = React.useRef();

  // On app load, check for JWT and fetch user
  React.useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setUser(data);
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('jwt');
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      });
  }, []);

  // Session timeout logic (unchanged)
  React.useEffect(() => {
    if (!isAuthenticated) return;
    const TIMEOUT = 5 * 60 * 1000; // 5 minutes
    const WARNING = 30 * 1000; // 30 seconds before logout
    const resetTimers = () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(warningRef.current);
      warningRef.current = setTimeout(() => setShowTimeoutWarning(true), TIMEOUT - WARNING);
      timeoutRef.current = setTimeout(() => {
        setShowTimeoutWarning(false);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('jwt');
        toast.info('Session expired. You have been logged out.');
      }, TIMEOUT);
    };
    resetTimers();
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach(ev => window.addEventListener(ev, resetTimers));
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(warningRef.current);
      events.forEach(ev => window.removeEventListener(ev, resetTimers));
    };
  }, [isAuthenticated]);

  // Login handler
  const handleLogin = async (email, password, setError, setLoading) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Login failed');
        setLoading(false);
        toast.error(data.error || 'Login failed');
        return;
      }
      const data = await res.json();
      localStorage.setItem('jwt', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      setLoading(false);
      toast.success('Login successful!');
    } catch (err) {
      setError('Login failed');
      setLoading(false);
      toast.error('Login failed');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('jwt');
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />} />
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={handleLogout} user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<DashboardHome user={user} />} />
          <Route path="email-sender" element={<EmailSender user={user} />} />
          <Route path="email-logs" element={<EmailLogs user={user} />} />
          <Route path="seed-users" element={<SeedUsers user={user} />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
      <Modal
        isOpen={showTimeoutWarning}
        onRequestClose={() => setShowTimeoutWarning(false)}
        className="timeout-modal"
        overlayClassName="email-preview-overlay"
        ariaHideApp={false}
        contentLabel="Session Timeout Warning"
      >
        <h3><FontAwesomeIcon icon={faClock} style={{ marginRight: 8 }} />Session Timeout</h3>
        <div style={{ margin: '1rem 0' }}>You will be logged out in 30 seconds due to inactivity.</div>
        <button className="email-preview-close" onClick={() => setShowTimeoutWarning(false)}><FontAwesomeIcon icon={faXmark} style={{ marginRight: 8 }} />Stay Logged In</button>
      </Modal>
    </Router>
  );
}

export default App;
