import './App.css';
import { useState } from 'react';
import searchIcon from './Outline/_search.png';
import bellIcon from './Outline/_bell.png';
import userIcon from './Outline/man.png';

export default function Header() {
  // Локальное состояние (только в памяти)
  const [settings, setSettings] = useState({
    name: 'John Smith',
    email: 'john@example.com',
    pricePromptEnabled: true,
    defaultSort: 'dateCreated',   // dateCreated | deadline | priority | alphabetical
    defaultFilter: 'none',        // none | canStart | deadline | completed
  });

  // Модалка + драфт
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(settings);
  const [errors, setErrors] = useState({});

  const openModal = () => {
    setDraft(settings);          // копируем текущее в драфт
    setErrors({});
    setOpen(true);
    document.body.classList.add('no-scroll');
  };

  const closeModal = () => {
    setOpen(false);
    document.body.classList.remove('no-scroll');
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDraft(d => ({
      ...d,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Можно упростить валидацию, но оставим базовую, чтобы UI был аккуратный
  const validate = () => {
    const next = {};
    if (!draft.name.trim()) next.name = 'Name is required.';
    if (!draft.email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) next.email = 'Invalid email.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Никаких сохранений — просто применяем к локальному состоянию и закрываем
  const save = () => {
    if (!validate()) return;
    setSettings(draft);
    closeModal();
  };

  return (
    <div className="App-header">
      <h2 className="header-title">Dashboard</h2>

      {/* right side of header */}
      <div className="header-right">
        {/* search box wrapper */}
        <div className="search-wrapper">
          <input type="search" placeholder="Search..." />
          <img src={searchIcon} alt="search" className="search-icon" />
        </div>

        {/* icons and user */}
        <div className="header-icons">
          <img src={bellIcon} alt="bell" className="bell-icon" />

          {/* Avatar / Username click opens modal */}
          <button className="user-section" onClick={openModal} title="Profile & Settings">
            <b className="user-name">{settings.name}</b>
            <img src={userIcon} alt="user" className="user-icon" />
          </button>
        </div>
      </div>

      {/* Settings Modal  */}
      {open && (
        <>
          <div className="backdrop-dim" onClick={closeModal} />
          <div className="modal-center" role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <h3 id="settings-title" className="modal-title">Profile & Settings</h3>

            <div className="form-row">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                value={draft.name}
                onChange={onChange}
                className={`form-input ${errors.name ? 'has-error' : ''}`}
                placeholder="Your name"
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>

            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                value={draft.email}
                onChange={onChange}
                className={`form-input ${errors.email ? 'has-error' : ''}`}
                placeholder="name@example.com"
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            <div className="form-row checkbox-row">
              <input
                id="pricePromptEnabled"
                name="pricePromptEnabled"
                type="checkbox"
                checked={draft.pricePromptEnabled}
                onChange={onChange}
              />
              <label htmlFor="pricePromptEnabled">
                Enable price prompt when adding to cart
              </label>
            </div>

            <div className="form-grid">
              <div className="form-row">
                <label htmlFor="defaultSort">Default sorting</label>
                <select
                  id="defaultSort"
                  name="defaultSort"
                  value={draft.defaultSort}
                  onChange={onChange}
                  className="form-input"
                >
                  <option value="dateCreated">Date created</option>
                  <option value="deadline">Deadline</option>
                  <option value="priority">Priority</option>
                  <option value="alphabetical">Alphabetical (A–Z)</option>
                </select>
              </div>

              <div className="form-row">
                <label htmlFor="defaultFilter">Default filtering</label>
                <select
                  id="defaultFilter"
                  name="defaultFilter"
                  value={draft.defaultFilter}
                  onChange={onChange}
                  className="form-input"
                >
                  <option value="none">None</option>
                  <option value="canStart">Can Start</option>
                  <option value="deadline">Deadline</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-light" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
