import React, { useState } from 'react';

const ActiveVotesComponent = () => {
  const [text, setText] = useState(''); // Initialize state to hold the text

  const handleChange = (event) => {
    setText(event.target.value); // Update the state with the new text
  };

  return (
    <div>
      <input
        type='text'
        value={text}
        onChange={handleChange}
        placeholder='Enter some text'
      />
      <p>You entered: {text}</p>
    </div>
  );
};

export default MinerIdInputComponent;
