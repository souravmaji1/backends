'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";

export default function BreedPage() {
  const [duckCount, setDuckCount] = useState(null);
  const [males, setMales] = useState([]);
  const [females, setFemales] = useState([]);
  const [selectedMale, setSelectedMale] = useState(null);
  const [selectedFemale, setSelectedFemale] = useState(null);
  const [cookie] = useCookies(["token"]);

  useEffect(() => {
    const fetchDucks = async () => {
      try {
        const response = await axios.get('/duck/duck-count', {
          headers: {
            Authorization: `Bearer ${cookie.token}`,
          },
        });

        setDuckCount(response.data.duckCount);

        if (response.data.duckCount >= 2) {
          const ducksResponse = await axios.get('/duck/ducks', {
            headers: {
              Authorization: `Bearer ${cookie.token}`,
            },
          });

          const maleDucks = ducksResponse.data.filter((duck) => duck.gender === 'MALE');
          const femaleDucks = ducksResponse.data.filter((duck) => duck.gender === 'FEMALE');

          setMales(maleDucks);
          setFemales(femaleDucks);
        }
      } catch (error) {
        console.error('Error fetching duck count:', error.message);
      }
    };

    fetchDucks();
  }, []);

  const handleMaleSelect = (duck) => {
    setSelectedMale(duck);
  };

  const handleFemaleSelect = (duck) => {
    setSelectedFemale(duck);
  };

  const handleBreedClick = async () => {
    try {
      const response = await axios.post('/duck/breed', {
        male_id: selectedMale.id,
        female_id: selectedFemale.id,
      }, {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      });

      console.log('Breeding success:', response.data);
    } catch (error) {
      console.error('Error breeding ducks:', error.message);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Breeding Page</h1>
      {duckCount !== null ? (
        duckCount >= 2 ? (
          <div>
            <p className="mb-4">Your duck count: {duckCount}</p>
            <div className="flex justify-between">
              <div className="w-1/2">
                <h2 className="text-xl font-bold mb-4">Select Male Duck</h2>
                <ul>
                  {males.map((duck) => (
                    <li
                      key={duck.id}
                      onClick={() => handleMaleSelect(duck)}
                      className={`cursor-pointer p-2 rounded ${selectedMale && selectedMale.id === duck.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      {duck.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-1/2">
                <h2 className="text-xl font-bold mb-4">Select Female Duck</h2>
                <ul>
                  {females.map((duck) => (
                    <li
                      key={duck.id}
                      onClick={() => handleFemaleSelect(duck)}
                      className={`cursor-pointer p-2 rounded ${selectedFemale && selectedFemale.id === duck.id ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
                    >
                      {duck.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {selectedMale && selectedFemale && (
              <button
                onClick={handleBreedClick}
                className="mt-6 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 cursor-pointer"
              >
                Start Breeding
              </button>
            )}
          </div>
        ) : (
          <p>You need at least 2 ducks to start breeding.</p>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
