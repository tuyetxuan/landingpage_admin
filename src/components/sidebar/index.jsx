/* eslint-disable */

import { HiX } from 'react-icons/hi';
import Links from './components/Links';
import routes from 'routes.js';
import React from 'react';
import LOGO from 'assets/img/logo/logo.png';

const Sidebar = ({ open, onClose }) => {
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? 'translate-x-0' : '-translate-x-96'
      }`}
    >
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>
      
      <div className={`mx-[15px] mt-[20px] flex flex-col items-center `}>
        <div className="ml-1 mt-1 h-2.5 text-center font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          <img
            src={LOGO}
            alt="Admin Icon"
            className="mr-2 inline-block h-14 w-14 align-middle"
          />
          <span className="font-bold text-brand-800">LANDING PAGE</span>
        </div>
      </div>
      <div className="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />
      <ul className="mb-auto pt-1">
        <Links routes={routes} />
      </ul>
    </div>
  );
};

export default Sidebar;
