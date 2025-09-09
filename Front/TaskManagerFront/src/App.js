import './App.css';
import Header from './Header.js';
import SideBar from './SideBar.js';
import Welcome from './Welcome.js';
import Tasks from './Tasks.js';



function App() {
  return (
    <div className="App">
      <Header />
      <div style={{ display: "flex" }}>
        <SideBar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft:"10px", marginRight:"10px" }}>
          <Welcome />
          <Tasks />
        </div>
      </div>
  </div>
  );
}

export default App;