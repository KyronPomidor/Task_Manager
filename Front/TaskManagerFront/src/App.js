import "./App.css";
import { useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import Tasks from "./Tasks";
import Welcome from "./Welcome";

export default function App() {
  // Categories live at the App level so both SideBar and Tasks can share them
  const [categories, setCategories] = useState([
    { id: "work", name: "Work", parentId: null },
    { id: "personal", name: "Personal", parentId: null },
    { id: "projA", name: "Project A", parentId: "work" },
    { id: "projB", name: "Project B", parentId: "work" },
    { id: "fun", name: "Fun", parentId: "personal" },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("inbox");

  return (
    <div className="App">
      <Header />
      <div className="AppBody">
        <SideBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          setCategories={setCategories}
        />
        <div className="MainPanel">
          <Welcome />
          <div className="MainScroll">
            <Tasks
              categories={categories}
              selectedCategory={selectedCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
