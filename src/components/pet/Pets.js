import React from 'react';
import PetList from './PetList';
import { useAuth0 } from '@auth0/auth0-react';

const Pets = () => {
  const { user } = useAuth0();

  return (
    <div>
      <PetList owner={user.sub} />
    </div>
  );
};

export default Pets;