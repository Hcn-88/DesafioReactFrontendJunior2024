import React from "react";
import { Route, Routes } from 'react-router-dom';
import Todos from './components/todos/Todos';
// import All from "./components/todos/allTodos/All";
// import Active from "./components/todos/activeTodos/Active";
// import Completed from "./components/todos/completedTodos/Completed";

function App() {
  return (
    <section>
      <h1>todos</h1>
      <Routes>
        <Route path='/' element={<Todos filter='all' />}></Route>
        <Route path='/active' element={<Todos filter='active' />}></Route>
        <Route path='/completed' element={<Todos filter='completed' />}></Route>
      </Routes>
    </section>
  );
};

export default App;