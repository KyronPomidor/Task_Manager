import './App.css';
import logo from './arrow-left.svg';
function Header() {
  return (
    <div className='App-header'>
      <img src={logo} className="App-logo" alt="logo" />
      <h2 style={{ marginLeft: "1vw" }}>Dashboard</h2>
      <div style={{ position: 'relative', width: '250px' }}>
        
        <input
          type="search"
          placeholder="Search"
          style={{
            width: '100%',
            padding: '8px 16px 8px 40px',
            borderRadius: '25px',
            border: '1px solid #ccc',
            outline: 'none',
          }}
        />
      </div>
    </div>
  )
}


function App() {
  return (
    <div className="App">
      <Header />
    </div>
  );
}

export default App;
