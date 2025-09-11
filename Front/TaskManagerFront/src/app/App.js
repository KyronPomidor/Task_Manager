import "./styles/App.css";
import { useState } from "react";
import { Header } from "../Widgets/Header";
import { SideBar } from "../Widgets/SideBar";
import { Tasks } from "../pages/TaskPage";
import { Welcome } from "../Widgets/Welcome";
import { GraphsPage } from "../pages/GraphPage";

export default function App() {
  const [categories, setCategories] = useState([
    { id: "work", name: "Work", parentId: null },
    { id: "personal", name: "Personal", parentId: null },
    { id: "projA", name: "Project A", parentId: "work" },
    { id: "projB", name: "Project B", parentId: "work" },
    { id: "fun", name: "Fun", parentId: "personal" },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("inbox");
  // const [a, b] = useState("AAAAAAAAAA");

  return (
    <div className="App">
      <Header />
      {/* <p>{ a }</p>
      <button onClick={a === "AAAAAAAAAA" ? () => b("OLNDSDWD") : b("AAAAAAAAAA")}> New Text </button> */}
      <div className="AppBody">
        <SideBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          setCategories={setCategories}
        />

        <div className="MainPanel">
          {/* show Welcome + Tasks for categories */}
          {selectedCategory !== "graphs" && (
            <>
              <Welcome />
              <div className="MainScroll">
                <Tasks
                  categories={categories}
                  selectedCategory={selectedCategory}
                />
              </div>
            </>
          )}

          {/* show GraphsPage when "Graphs" tab is selected */}
          {selectedCategory === "graphs" && <GraphsPage />}
        </div>
      </div>
    </div>
  );
}
