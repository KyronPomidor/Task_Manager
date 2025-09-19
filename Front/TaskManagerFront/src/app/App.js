import "./styles/App.css";
import { useState } from "react";
import { Header } from "../Widgets/Header";
import { SideBar } from "../Widgets/SideBar";
import { Tasks } from "../pages/TaskPage";
import { Welcome } from "../Widgets/Welcome";
import { GraphsPage } from "../pages/GraphPage";
import { TestEndpoint } from "../Features/TestEndpoint/TestEndpoint";

export default function App() {
  return (
    <div className="App">
      <TestEndpoint />
    </div>
  );
}