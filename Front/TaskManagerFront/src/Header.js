import './App.css';
import searchIcon from './Outline/_search.png';
import bellIcon from './Outline/_bell.png';
import userIcon from './Outline/man.png';

export default function Header() {
  let user = "John Smith"
  return (
    <div className='App-header'>
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
          <section className="user-section">
            <b>{ user }</b>
            <img src={userIcon} alt="user" className="user-icon" />
          </section>
        </div>
      </div>
    </div>
  )
}