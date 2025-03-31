import React from 'react';
import Header from './components/Header';
import Board from './components/Board';
import './../src/index.css'




export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Board />
    </div>
  );
}