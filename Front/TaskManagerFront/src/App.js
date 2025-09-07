import './App.css';
import Header from './Header.js';
import SideBar from './SideBar.js';
import Welcome from './Welcome.js';
import Tasks from './Tasks.js';



function App() {
  return (
    <div className="App" style={{ display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft:"10px", marginRight:"10px" }}>
        <Header />
        <Welcome />
        <Tasks />
      </div>
    </div>
  );
}

export default App;