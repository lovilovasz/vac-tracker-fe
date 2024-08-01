import React from 'react';
import PetList from './PetList';

const Pets = () => {
  const ownerName = 'John Doe';

  return (
    <div>
      <PetList owner={ownerName} />
    </div>
  );
};

export default Pets;