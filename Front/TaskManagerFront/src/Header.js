import './App.css';
import { useState, useEffect } from 'react';
import searchIcon from './Outline/_search.png';
import bellIcon from './Outline/_bell.png';
import userIcon from './Outline/man.png';


function StatusFilter({ onChange }) {
  const [status, setStatus] = useState("All");
  
  const handleChange = (e) => {
    setStatus(e.target.value);
    onChange?.(e.target.value);
  };
  
  return (
    <div className="status-filter">
      <label htmlFor="status" style={{ marginRight: "8px" }}>
        Status:
      </label>
      <select
        id="status"
        value={status}
        onChange={handleChange}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          backgroundColor: "white",
          cursor: "pointer",
        }}
        >
        <option value="All">All</option>
        <option value="Completed">Completed</option>
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
      </select>
    </div>
  );
}

function DateRangeHeader() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{ fontWeight: 600 }}>Deadline:</span>

      <input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        style={{
          padding: "6px 10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
        placeholder="From"
        />

      <input
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{
          padding: "6px 10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
        placeholder="To"
        />
    </div>
  );
}

function PriorityFilter({ onChange }) {
  const [priority, setPriority] = useState("All");
  
  const handleChange = (e) => {
    setPriority(e.target.value);
    onChange?.(e.target.value);
  };
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <label htmlFor="priority" style={{ fontWeight: 600 }}>
        Priority:
      </label>
      <select
        id="priority"
        value={priority}
        onChange={handleChange}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          backgroundColor: "white",
          cursor: "pointer",
        }}
        >
        <option value="All">All</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Very High">Very High</option>
      </select>
    </div>
  );
}

function SortFilter({ onChange }) {
  const [sort, setSort] = useState("Creation Date (Newest)");
  
  const handleChange = (e) => {
    setSort(e.target.value);
    onChange?.(e.target.value);
  };
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <label htmlFor="sort" style={{ fontWeight: 600 }}>
        Sort:
      </label>
      <select
        id="sort"
        value={sort}
        onChange={handleChange}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          backgroundColor: "white",
          cursor: "pointer",
          minWidth: "200px",
        }}
        >
        <option value="Creation Date (Newest)">Creation Date (Newest)</option>
        <option value="Creation Date (Oldest)">Creation Date (Oldest)</option>
        <option value="Deadline (Soonest)">Deadline (Soonest)</option>
        <option value="Deadline (Latest)">Deadline (Latest)</option>
        <option value="Alphabetical (A-Z)">Alphabetical (A-Z)</option>
        <option value="Alphabetical (Z-A)">Alphabetical (Z-A)</option>
        <option value="Priority (High)">Priority (High)</option>
        <option value="Priority (Low)">Priority (Low)</option>
        <option value="My Order">My Order</option>
      </select>
    </div>
  );
}



function UserProfile() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");

  // local form state
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);

  // hover/active states
  const [userHover, setUserHover] = useState(false);
  const [userActive, setUserActive] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);
  const [cancelActive, setCancelActive] = useState(false);
  const [saveHover, setSaveHover] = useState(false);
  const [saveActive, setSaveActive] = useState(false);

  const styles = {
    userBtn: (hover, active) => ({
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: active ? "#d1d5db" : hover ? "#e5e7eb" : "transparent",
      border: "none",
      cursor: "pointer",
      borderRadius: "8px",
      padding: "4px 8px",
      transition: "background 0.2s",
    }),

    avatar: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: "#E5E7EB",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 600,
    },

    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    },

    card: {
      background: "white",
      borderRadius: "12px",
      padding: "20px",
      width: "400px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
    },

    labelWrap: { marginBottom: "12px" },
    input: {
      width: "100%",
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    },

    actionBtn: (hover, active) => ({
      padding: "8px 14px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      background: active ? "#e5e7eb" : hover ? "#f3f4f6" : "white",
      cursor: "pointer",
      transition: "background 0.15s",
    }),

    actionPrimary: (hover, active) => ({
      padding: "8px 14px",
      borderRadius: "6px",
      border: "none",
      background: active ? "#0a0a0a" : "#111111",
      opacity: hover && !active ? 0.92 : 1,
      color: "white",
      cursor: "pointer",
      transition: "opacity 0.15s, background 0.15s",
    }),
  };

  const openModal = () => {
    setTempName(name);
    setTempEmail(email);
    setOpen(true);
  };

  const saveChanges = () => {
    setName(tempName);
    setEmail(tempEmail);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div>
      {/* Profile button with avatar + name */}
      <button
        onClick={openModal}
        onMouseEnter={() => setUserHover(true)}
        onMouseLeave={() => {
          setUserHover(false);
          setUserActive(false);
        }}
        onMouseDown={() => setUserActive(true)}
        onMouseUp={() => setUserActive(false)}
        style={styles.userBtn(userHover, userActive)}
      >
        <div style={styles.avatar}>
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
        <span>{name}</span>
      </button>

      {/* Modal */}
      {open && (
        <div style={styles.overlay}>
          <div style={styles.card}>
            <h2 style={{ marginBottom: "16px" }}>Profile Settings</h2>

            <div style={styles.labelWrap}>
              <label>Name</label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Email</label>
              <input
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                onClick={() => setOpen(false)}
                onMouseEnter={() => setCancelHover(true)}
                onMouseLeave={() => {
                  setCancelHover(false);
                  setCancelActive(false);
                }}
                onMouseDown={() => setCancelActive(true)}
                onMouseUp={() => setCancelActive(false)}
                style={styles.actionBtn(cancelHover, cancelActive)}
              >
                Cancel
              </button>

              <button
                onClick={saveChanges}
                onMouseEnter={() => setSaveHover(true)}
                onMouseLeave={() => {
                  setSaveHover(false);
                  setSaveActive(false);
                }}
                onMouseDown={() => setSaveActive(true)}
                onMouseUp={() => setSaveActive(false)}
                style={styles.actionPrimary(saveHover, saveActive)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function DollarButton() {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  
  const dollarButton = (hover, active) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    border: "none",
    background: active ? "#d1d5db" : hover ? "#e5e7eb" : "white", // darker on hover/active
    cursor: "pointer",
    marginLeft: "1vw",
    fontSize: "30px",
    fontWeight: "bold",
    transition: "background 0.2s",
  });
  
  return (
    <button
    style={dollarButton(hover, active)}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => {
      setHover(false);
      setActive(false);
    }}
    onMouseDown={() => setActive(true)}
    onMouseUp={() => setActive(false)}
    >
      $
    </button>
  );
}

export default function Header() {
  // Локальное состояние (только в памяти)
  const [settings, setSettings] = useState({
    name: 'John Smith',
    email: 'john@example.com',
    pricePromptEnabled: true,
    defaultSort: 'dateDeadline',   // dateDeadline | deadline | priority | alphabetical
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
    <div style={{ display:"flex", padding: "1vw", backgroundColor:"white", borderBottom: "1px solid #ccc" }}>
      <DollarButton />
      <div style={{ marginLeft:"10vw", display:"flex", justifyContent: "space-between", width: "100%" }}>
        <div style={{display: "flex", gap:"1vw"}}>
          <StatusFilter onChange={(value) => console.log("Selected:", value)} />
          <DateRangeHeader />
          <PriorityFilter onChange={(value) => console.log("Priority:", value)} />
          <SortFilter onChange={(value) => console.log("Sort by:", value)} />
        </div>
        <UserProfile />
      </div>
      
    </div>
    //   {/* right side of header */}
    //   <div className="header-right">
    //     {/* search box wrapper */}
    //     <div className="search-wrapper">
    //       <input type="search" placeholder="Search..." />
    //       <img src={searchIcon} alt="search" className="search-icon" />
    //     </div>

    //     {/* icons and user */}
    //     <div className="header-icons">
    //       <img src={bellIcon} alt="bell" className="bell-icon" />

    //       {/* Avatar / Username click opens modal */}
    //       <button className="user-section" onClick={openModal} title="Profile & Settings">
    //         <b className="user-name">{settings.name}</b>
    //         <img src={userIcon} alt="user" className="user-icon" />
    //       </button>
    //     </div>
    //   </div>

    //   {/* Settings Modal  */}
    //   {open && (
    //     <>
    //       <div className="backdrop-dim" onClick={closeModal} />
    //       <div className="modal-center" role="dialog" aria-modal="true" aria-labelledby="settings-title">
    //         <h3 id="settings-title" className="modal-title">Profile & Settings</h3>

    //         <div className="form-row">
    //           <label htmlFor="name">Name</label>
    //           <input
    //             id="name"
    //             name="name"
    //             value={draft.name}
    //             onChange={onChange}
    //             className={`form-input ${errors.name ? 'has-error' : ''}`}
    //             placeholder="Your name"
    //           />
    //           {errors.name && <div className="error-text">{errors.name}</div>}
    //         </div>

    //         <div className="form-row">
    //           <label htmlFor="email">Email</label>
    //           <input
    //             id="email"
    //             name="email"
    //             value={draft.email}
    //             onChange={onChange}
    //             className={`form-input ${errors.email ? 'has-error' : ''}`}
    //             placeholder="name@example.com"
    //           />
    //           {errors.email && <div className="error-text">{errors.email}</div>}
    //         </div>

    //         <div className="form-row checkbox-row">
    //           <input
    //             id="pricePromptEnabled"
    //             name="pricePromptEnabled"
    //             type="checkbox"
    //             checked={draft.pricePromptEnabled}
    //             onChange={onChange}
    //           />
    //           <label htmlFor="pricePromptEnabled">
    //             Enable price prompt when adding to cart
    //           </label>
    //         </div>

    //         <div className="form-grid">
    //           <div className="form-row">
    //             <label htmlFor="defaultSort">Default sorting</label>
    //             <select
    //               id="defaultSort"
    //               name="defaultSort"
    //               value={draft.defaultSort}
    //               onChange={onChange}
    //               className="form-input"
    //             >
    //               <option value="dateCreated">Date created</option>
    //               <option value="deadline">Deadline</option>
    //               <option value="priority">Priority</option>
    //               <option value="alphabetical">Alphabetical (A-Z)</option>
    //             </select>
    //           </div>

    //           <div className="form-row">
    //             <label htmlFor="defaultFilter">Default filtering</label>
    //             <select
    //               id="defaultFilter"
    //               name="defaultFilter"
    //               value={draft.defaultFilter}
    //               onChange={onChange}
    //               className="form-input"
    //             >
    //               <option value="none">None</option>
    //               <option value="canStart">Can Start</option>
    //               <option value="deadline">Deadline</option>
    //               <option value="completed">Completed</option>
    //             </select>
    //           </div>
    //         </div>

    //         <div className="modal-actions">
    //           <button className="btn btn-light" onClick={closeModal}>Cancel</button>
    //           <button className="btn btn-primary" onClick={save}>Save</button>
    //         </div>
    //       </div>
    //     </>
    //   )}
    // </div>
  );
}
