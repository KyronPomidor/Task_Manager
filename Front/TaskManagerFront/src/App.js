import './App.css';
import searchIcon from './Outline/_search.png';
import bellIcon from './Outline/_bell.png'
import userIcon from './Outline/man.png'

function Header() {
  let user = "John Smith"
  return (
    <div className='App-header'>
      <h2 style={{ marginLeft: "3vw" }}>Dashboard</h2>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ position: 'relative', width: '350px', marginRight: "4vw" }}>
          <img
            src={searchIcon}
            alt="search"
            style={{
              position: 'absolute',
              top: '57%',
              left: '320px',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              pointerEvents: 'none',
            }}
          />
          <input
            type="search"
            placeholder="Search..."
            style={{
              width: '100%',
              padding: '8px 16px 8px',
              borderRadius: '25px',
              border: '1px solid #ccc',
              outline: 'none',
            }}
          />
        </div>
        <img
        src={bellIcon}
        alt="bell"
        style={{
          width: '24px',
          height: '24px',
          marginRight: '4vw',
          cursor: 'pointer',
        }}
      />

      <section style={{ display: "flex", alignItems: "center" }}>
        <b style={{ marginRight: "1vw" }}>{ user } </b>
        <img
        src={userIcon}
        alt="user"
        style={{
          width: '32px',
          height: '32px',
          marginRight: '3vw',
          cursor: 'pointer',
        }}
      />
      </section>
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
