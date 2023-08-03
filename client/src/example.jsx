import React from 'react';

const MyComponent = () => {
  const handleOnClick = () => {
    console.log('Clicked!');
  };

  const handleMouseEnter = () => {
    console.log('Mouse entered!');
  };

  const handleMouseLeave = () => {
    console.log('Mouse left!');
  };

  return (
    <div
      className="my-div"
      style={{ backgroundColor: 'blue', color: 'white' }}
      onClick={handleOnClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id="my-div-id"
      role="button"
      aria-label="Clickable Div"
    >
      Click me!
    </div>
  );
};

export default MyComponent;
