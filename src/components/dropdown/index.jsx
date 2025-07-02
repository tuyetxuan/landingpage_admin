import React from 'react';
import { Icon } from '@iconify/react';

function useOutsideAlerter(ref, setX) {
  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setX(false);
      }
    }
    
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, setX]);
}

const Dropdown = (props) => {
  const { button, children, classNames, animation } = props;
  const wrapperRef = React.useRef(null);
  const [openWrapper, setOpenWrapper] = React.useState(false);
  useOutsideAlerter(wrapperRef, setOpenWrapper);
  
  return (
    <div ref={wrapperRef} className="relative flex">
      <div className="flex relative" onMouseDown={() => setOpenWrapper(!openWrapper)}>
        {button}
        <span className="absolute -bottom-0 -right-[1px] flex items-center rounded-full bg-gray-400 p-0.5">
        <Icon icon="ep:arrow-down-bold" width="12" height="12" style={{ color: '#fff' }} />
        </span>
      </div>
      <div
        className={`${classNames} absolute z-10 ${
          animation
            ? animation
            : 'origin-top-right transition-all duration-300 ease-in-out'
        } ${openWrapper ? 'scale-100' : 'scale-0'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
