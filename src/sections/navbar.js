/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-9 bg-black text-white">
      <div className="flex items-center space-x-3">
        <span className="font-medium text-4xl">// PcFacil</span>
      </div>

      {/* Center Section: Links */}
      <ul className="hidden md:flex space-x-12 font-light text-xl">
        <li className="hover:text-gray-400 cursor-pointer">Inicio</li>
        <li className="hover:text-gray-400 cursor-pointer">Componentes</li>
        <li className="hover:text-gray-400 cursor-pointer">Categorías</li>
        <li className="hover:text-gray-400 cursor-pointer">Pipomarico</li>
      </ul>

      {/* Right Section:Icons */}
      <div className="flex items-center space-x-4">
        {/* Icons */}
        <div className="flex space-x-4">
          <button aria-label="Theme toggle" className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1M4.22 4.22l.707.707M1 12h1m-.293 7.071l.707-.707M12 21v1m7.071-1.707l-.707-.707M21 12h1m-1.707-7.071l-.707.707M16.95 6.05l.707-.707M19.07 12a7.07 7.07 0 1 1-14.14 0 7.07 7.07 0 0 1 14.14 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
