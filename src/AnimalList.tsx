import React, { useState, useEffect } from "react";
import { requestAnimals, requestAnimalsWithError, Animal, Query } from "./api";
import "./App.css"

function debounce(func: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}

function AnimalList() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterAnimal, setFilterAnimal] = useState<string>("");
  const [filterAmount, setFilterAmount] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(4);

  useEffect(() => {
    const offset = (page - 1) * limit;
    setLoading(true);
    const query: Query = { animal: filterAnimal, amount: filterAmount, limit, offset };
    requestAnimals(query)
      .then((data: Animal[]) => {
        if (data.length === 0) {
          setError("Animals not found");
        } else {
          setAnimals(data);
        }
        setLoading(false);
      })
      .catch((error: Error) => {
        setError(error.message);
        setLoading(false);
        requestAnimalsWithError().catch((errorMessage: string) => {
          setError(errorMessage);
        });
      });
  }, [filterAnimal, filterAmount, page, limit]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
  };

  const debouncedAnimalSearch = debounce((value: string) => {
    setFilterAnimal(value);
  }, 1000);

  const debouncedAmountSearch = debounce((value: string) => {
    setFilterAmount(value);
  }, 1000);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="down">
        <input
        className="right"
          type="text"
          placeholder="Search by name"
          onChange={(e) => debouncedAnimalSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by amount"
          onChange={ (e) => debouncedAmountSearch(e.target.value)}
        />
      </div>
      <div className="down flexed">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Previous Page
        </button>
        <button onClick={() => handlePageChange(page + 1)}>Next Page</button>
        <div className="">
        <select value={limit} onChange={(e) => handleLimitChange(Number(e.target.value))}>
          <option value={4}>4 per page</option>
          <option value={8}>8 per page</option>
          <option value={12}>12 per page</option>
        </select>
      </div>
      </div>
      {animals.length === 0 ? (
        <div>Animals not found</div>
      ) : (
        <>
          {animals.map((animal: Animal) => (
            <div key={animal.id}>
              {animal.animal}, {animal.amount}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default AnimalList;
