// components/BreedingComponent.js
import React, { useState } from 'react';
import { client } from "@/app/client";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import DuckyOne from '../../../../public/assets/img/ducky.jpg';
import DuckyTwo from '../../../../public/assets/img/ducky.jpg';
import DuckyThree from '../../../../public/assets/img/ducky.jpg';
import DuckyFour from '../../../../public/assets/img/ducky.jpg';

const BreedingComponent = () => {
  const [parents, setParents] = useState([
    { id: 1, image: DuckyOne, selected: false },
    { id: 2, image: DuckyTwo, selected: false },
    { id: 3, image: DuckyThree, selected: false },
    { id: 4, image: DuckyFour, selected: false },
  ]);

  const [breedingDate, setBreedingDate] = useState(new Date());
  const [responseMessage, setResponseMessage] = useState('');

  const handleParentClick = (id) => {
    const updatedParents = parents.map((parent) =>
      parent.id === id ? { ...parent, selected: !parent.selected } : parent
    );
    setParents(updatedParents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedParents = parents.filter((parent) => parent.selected);

    if (selectedParents.length !== 2) {
      setResponseMessage('Please select exactly two parents.');
      return;
    }

    const parent1 = selectedParents[0];
    const parent2 = selectedParents[1];

    try {
      const response = await client.post('/api/breedingEndpoint', {
        parent1,
        parent2,
        breedingDate,
      });

      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage('Error occurred while making the request.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="inline-table mx-auto mt-8 p-8 bg-dark_light rounded shadow-md flex">
      <div className="max-w-2xl mx-auto mt-8 p-6 rounded-md shadow-md" style={{ background: '#6820C2' }}>
        <h2 className="text-2xl font-semibold mb-4 text-white">Breeding Ducks</h2>

        <div className="grid grid-cols-2 gap-8">
          {parents.map((parent) => (
            <div
              key={parent.id}
              className={`bg-white rounded-md p-4 cursor-pointer ${
                parent.selected ? 'border-4 border-blue-500' : ''
              }`}
              onClick={() => handleParentClick(parent.id)}
            >
           {/*   <h3 className="text-lg font-semibold mb-2">{`Parent ${parent.id}`}</h3>*/}
              <Image src={parent.image} alt={`Parent ${parent.id}`} />
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* ... (existing form fields) */}

          <br></br>

          {/* Breeding Date Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Breeding Date:</label>
            <DatePicker
              selected={breedingDate}
              onChange={(date) => setBreedingDate(date)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <button
            type="submit"
            style={{ background: '#222242' }}
            className="text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Start Breeding
          </button>
        </form>
        {responseMessage && <p className="mt-4 text-green-600">{responseMessage}</p>}
      </div>
    </div>
  );
};

export default BreedingComponent;
