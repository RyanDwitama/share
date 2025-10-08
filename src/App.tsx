import { useState, useRef, useEffect, useMemo } from "react";

interface PersonType {
  name: string;
  category: string;
  score: number;
  estimate: number;
}

const Share = () => {
  const [initialMoney, setInitialMoney] = useState(500_000_000_000_000);
  const [isEditingInitialMoney, setIsEditingInitialMoney] = useState(false);
  const [initialMoneyInput, setInitialMoneyInput] = useState(initialMoney);
  const [normalMoney, setNormalMoney] = useState(0);
  const [isEditingNormalMoney, setIsEditingNormalMoney] = useState(false);
  const [normalMoneyInput, setNormalMoneyInput] = useState(normalMoney);

  const [data, setData] = useState<PersonType[]>([]);
  const [currentName, setCurrentName] = useState("");
  const [currentScore, setCurrentScore] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isEnteringName, setIsEnteringName] = useState(true);
  const nameSet = useMemo(() => new Set(data.map(p => p.name)), [data]);

  const [editingScoreIndex, setEditingScoreIndex] = useState<number | null>(null);
  const [editedScore, setEditedScore] = useState<number>(0);
  const [isScoreInputVisible, setIsScoreInputVisible] = useState(false);
  const scoreInputVisibleRef = useRef<HTMLInputElement | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const scoreInputRef = useRef<HTMLInputElement | null>(null);

  const numberToDot = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(Math.floor(num));
  };

  const handleNormalMoneyClick = () => {
  setNormalMoneyInput(normalMoney);
  setIsEditingNormalMoney(true);
};

const handleNormalMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setNormalMoneyInput(Number(e.target.value));
};

const saveNormalMoney = () => {
  if (!normalMoneyInput || normalMoneyInput < 0) {
    setNormalMoneyInput(normalMoney);
  } else {
    setNormalMoney(normalMoneyInput);
  }
  setIsEditingNormalMoney(false);
};

const handleNormalMoneyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    saveNormalMoney();
  } else if (e.key === "Escape") {
    setIsEditingNormalMoney(false);
    setNormalMoneyInput(normalMoney);
  }
};

const onScoreInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    addHandlerButton();
  }
};

  const handleInitMoneyClick = () => {
    setInitialMoneyInput(initialMoney);
    setIsEditingInitialMoney(true);
  };

  const handleInitialMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialMoneyInput(Number(e.target.value));
  };

  const saveInitialMoney = () => {
    if (!initialMoneyInput || initialMoneyInput <= 0) {
      setInitialMoneyInput(initialMoney);
    } else {
      setInitialMoney(initialMoneyInput);

      const newTotalScore = data.reduce((acc, p) => acc + p.score, 0);
      const updatedData = data.map((person) => ({
        ...person,
        estimate: (person.score / newTotalScore) * initialMoneyInput,
      }));

      setData(updatedData);
    }
    setIsEditingInitialMoney(false);
  };

  const handleInitialMoneyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveInitialMoney();
    } else if (e.key === "Escape") {
      setIsEditingInitialMoney(false);
      setInitialMoneyInput(initialMoney);
    }
  };

  const updateTotalScoreAndEstimates = (newData: PersonType[]) => {
    // Calculate the total score for "✅" and "❌" categories separately
    const totalScoreChecked = newData
      .filter((person) => person.category === "✅")
      .reduce((acc, person) => acc + person.score, 0);

    const totalScoreUnchecked = newData
      .filter((person) => person.category === "❌")
      .reduce((acc, person) => acc + person.score, 0);

    // Update estimates based on categories
    const updatedData = newData.map((person) => {
      const estimate =
        person.category === "✅"
          ? (person.score / totalScoreChecked) * (initialMoney - normalMoney) // Estimate for ✅
          : (person.score / totalScoreUnchecked) * normalMoney; // Estimate for ❌

      return {
        ...person,
        estimate,
      };
    });

    // Set the updated data
    setData(updatedData);
  };


  const addHandlerButton = () => {
    if (!currentName.trim() || nameSet.has(currentName)) return;
    if (!currentScore) return;

    const newPerson: PersonType = {
      name: currentName,
      category: "✅",
      score: currentScore > 10000 ? 10000 : currentScore,
      estimate: 0,
    };

    const updatedData = [...data, newPerson];
    updateTotalScoreAndEstimates(updatedData);

    const newNameSet = new Set(nameSet);
    newNameSet.add(currentName);

    setCurrentName("");
    setCurrentScore(0);
    setIsScoreInputVisible(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const startEditingName = (index: number, name: string) => {
    setEditingIndex(index);
    setEditedName(name);
  };

  const saveEditName = (index: number): void => {
    if (!editedName.trim() || nameSet.has(editedName)) return;

    const updatedData = [...data];
    const oldName = updatedData[index].name;

    updatedData[index].name = editedName;
    updateTotalScoreAndEstimates(updatedData);

    const newNameSet = new Set(nameSet);
    newNameSet.delete(oldName);
    newNameSet.add(editedName);

    setEditingIndex(null);
    setEditedName("");
  };

  const setCategory = (index: number): void => {
    const updatedData = [...data];
    updatedData[index].category = updatedData[index].category === "✅" ? "❌" : "✅";
    updateTotalScoreAndEstimates(updatedData);
  };

  const startEditingScore = (index: number, score: number): void => {
    setEditingScoreIndex(index);
    setEditedScore(score);
  };

  const saveScoreEdit = (index: number): void => {
    const updatedData = [...data];
    const newMax = Math.min(editedScore, 10000);
    updatedData[index].score = newMax;

    updateTotalScoreAndEstimates(updatedData);
    setEditingScoreIndex(null);
  };

  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

  useEffect(() => {
    if (editingScoreIndex !== null && scoreInputRef.current) {
      scoreInputRef.current.focus();
    }
  }, [editingScoreIndex]);

  return (
    <div className="flex justify-center items-center flex-col p-20 mx-auto bg-black">
      <div className="flex justify-center items-center flex-col bg-[#1d1d1d] p-5 w-2/3 rounded-xl py-13">
      {isEditingInitialMoney ? (
        <input
          type="number"
          className="border font-extrabold px-2 py-1 w-64 text-center"
          value={initialMoneyInput === 0 ? "" : initialMoneyInput}
          onChange={handleInitialMoneyChange}
          onBlur={saveInitialMoney}
          onKeyDown={handleInitialMoneyKeyDown}
          autoFocus
          min={1}
          step={1}
        />
      ) : (
        <button
          className="font-extrabold"
          onClick={handleInitMoneyClick}
          title="Click to edit initial money"
        >
          {numberToDot(initialMoney)}
        </button>
      )}
      
      <div className="flex flex-row justify-between items-center align-middle gap-100 my-10">
        <p className="font-semibold">{numberToDot(initialMoney - normalMoney)}</p>

        {isEditingNormalMoney ? (
          <input
            type="number"
            className="border font-semibold px-2 py-1 w-64 text-center"
            value={normalMoneyInput === 0 ? "" : normalMoneyInput}
            onChange={handleNormalMoneyChange}
            onBlur={saveNormalMoney}
            onKeyDown={handleNormalMoneyKeyDown}
            autoFocus
            min={0}
            step={1}
          />
        ) : (
          <button
            className="font-semibold"
            onClick={handleNormalMoneyClick}
            title="Click to edit normal money"
          >
            {numberToDot(normalMoney)}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 mb-5">
        {isEnteringName ? (
          <div className="relative inline-block">
            <input
              ref={inputRef}
              type="text"
              className={`border px-3 py-1 bg-[#1a1a1a] ${
                currentName.trim() !== "" && nameSet.has(currentName.trim())
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Input name"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  currentName.trim() &&
                  !nameSet.has(currentName.trim())
                ) {
                  setIsEnteringName(false);
                  setTimeout(() => {
                    scoreInputRef.current?.focus();
                  }, 0);
                }
              }}
            />
            {currentName.trim() !== "" && nameSet.has(currentName.trim()) && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 text-red-600 text-sm whitespace-nowrap">
                This name is already taken.
              </span>
            )}
          </div>
        ) : (
          <input
            ref={scoreInputRef}
            type="number"
            className="border px-3 py-1"
            placeholder="Input score"
            value={currentScore === 0 ? "" : currentScore}
            onChange={(e) => setCurrentScore(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addHandlerButton();
                setIsEnteringName(true);
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 0);
              }
            }}
          />
        )}


        {isScoreInputVisible && (
          <input
            ref={scoreInputVisibleRef}
            type="number"
            className="border px-3 py-1"
            placeholder="Input score"
            value={currentScore === 0 ? "" : currentScore}
            onChange={(e) => setCurrentScore(Number(e.target.value))}
            onKeyDown={onScoreInputKeyDown}
            min={0}
            max={10000}
            autoFocus
          />
        )}
      </div>

      <div className="border-2 bg-black w-full max-w-5xl overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="!bg-[#1a1a1a] text-left">
              <th>No</th>
              <th className="min-w-[350px]">Name</th>
              <th>Status</th>
              <th>Score</th>
              <th className="min-w-[180px]">Estimate</th>
            </tr>
          </thead>
          <tbody>
            {data.map((person, index) => (
              <tr key={index} className="border-t">
                <td>{index + 1}</td>
                
                <td>
                  {editingIndex === index ? (
                    <div className="flex gap-2 justify-center items-center relative">
                      <input
                        ref={inputRef}
                        type="text"
                        className={`border px-1 py-1 ${
                          editedName.trim() !== "" &&
                          data.some((p, i) => i !== index && p.name === editedName.trim())
                            ? "border-red-500"
                            : ""
                        }`}
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEditName(index);
                        }}
                      />
                      {editedName.trim() !== "" &&
                        data.some((p, i) => i !== index && p.name === editedName.trim()) && (
                          <span className="absolute left-0 ml-2 text-red-600 text-sm whitespace-nowrap">
                            Name is taken.
                          </span>
                        )}
                      <button
                        onClick={() => saveEditName(index)}
                        className="bg-black text-white px-2 rounded"
                        disabled={
                          editedName.trim() === "" ||
                          data.some((p, i) => i !== index && p.name === editedName.trim())
                        }
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditingName(index, person.name)}
                      className="hover:text-red-800 hover:scale-105"
                    >
                      {person.name}
                    </button>
                  )}
                </td>

                <td>
                  <button
                    onClick={() => setCategory(index)}
                    className="text-sm px-2 py-1 rounded"
                  >
                    {person.category === "✅" ? "✅" : "❌"}
                  </button>
                </td>
                <td>
                  {editingScoreIndex === index ? (
                    <div className="flex gap-2">
                      <input
                        ref={scoreInputRef}
                        type="number"
                        className="border px-2 py-1 w-20"
                        value={editedScore === 0 ? "" : editedScore}
                        onChange={(e) => setEditedScore(Number(e.target.value))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveScoreEdit(index);
                        }}
                      />
                      <button
                        onClick={() => saveScoreEdit(index)}
                        className="bg-black text-white px-2 rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditingScore(index, person.score)}
                      className="hover:text-red-800 hover:scale-105"
                    >
                      {person.score}
                    </button>
                  )}
                </td>
                <td>{numberToDot(person.estimate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default Share;
