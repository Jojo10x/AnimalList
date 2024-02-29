export interface Animal {
    animal: string;
    id: number;
    amount: number;
  }
  
  export interface Query {
    animal: string;
    amount: string;
    limit: number;
    offset: number;
  }
  
  const baseQuery: Query = {
    animal: "",
    amount: "",
    limit: 5,
    offset: 0,
  };
  
  export const requestAnimalsWithError = (
    params: Query = baseQuery
  ): Promise<Animal[]> => {
    return new Promise(() => {
      throw new Error("500, unknown server error");
    });
  };
  
  export const requestAnimals = (params: Query = baseQuery): Promise<Animal[]> => {
    const animals: Animal[] = [
      { animal: "Cat", id: 0, amount: 11 },
      { animal: "Dog", id: 1, amount: 7 },
      { animal: "Panda", id: 2, amount: 2 },
      { animal: "Bear", id: 3, amount: 1 },
      { animal: "Tiger", id: 4, amount: 4 },
      { animal: "Lion", id: 5, amount: 1 },
      { animal: "Elephant", id: 6, amount: 1 },
      { animal: "Ostrich", id: 7, amount: 5 },
      { animal: "Crocodile", id: 8, amount: 3 },
      { animal: "Kangaroo", id: 9, amount: 6 },
      { animal: "Flamingo", id: 10, amount: 8 },
    ];
  
    const filtered = animals
      .filter((v) => {
        if (params.animal === "" && params.amount === "") return true;
        const amount = parseInt(params.amount, 10);
        const passedAgeFilter = params.amount === "" ? true : amount === v.amount;
        const passedNameFilter =
          params.animal === "" ||
          (params.animal &&
            v.animal.toLowerCase().includes(params.animal.toLowerCase()));
        return passedAgeFilter && passedNameFilter;
      })
      .slice(params.offset, params.offset + params.limit);
  
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(filtered);
      }, 2000);
    });
  };
  