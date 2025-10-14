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
  const [manualMoney, setManualMoney] = useState(0);

  const [data, setData] = useState<PersonType[]>([]);
  const [currentName, setCurrentName] = useState("");
  const [currentScore, setCurrentScore] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isEnteringName, setIsEnteringName] = useState(true);
  const nameSet = useMemo(() => new Set(data.map(p => p.name)), [data]);
  const [selectedCategory, setSelectedCategory] = useState<"🟢" | "🔴" | null>(null);

  const [editingScoreIndex, setEditingScoreIndex] = useState<number | null>(null);
  const [editedScore, setEditedScore] = useState<number>(0);
  const [isScoreInputVisible, setIsScoreInputVisible] = useState(false);
  const scoreInputVisibleRef = useRef<HTMLInputElement | null>(null);

  const [editingEstimateIndex, setEditingEstimateIndex] = useState<number | null>(null);
  const [editedEstimate, setEditedEstimate] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const scoreInputRef = useRef<HTMLInputElement | null>(null);
  const estimateInputRef = useRef<HTMLInputElement | null>(null);

  const [lastSortName, setLastSortName] = useState(false);
  const [lastSortCategory, setLastSortCategory] = useState(false);
  const [lastSortScore, setLastSortScore] = useState(false);
  const [lastSortEstimate, setLastSortEstimate] = useState(false);

  const numberToDot = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(Math.floor(num));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(e.target.value as "🟢" | "🔴");
  };

  const sortName = (): void => {
    const updatedData = [...data];

    if (!lastSortName) {
      updatedData.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      updatedData.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    setData(updatedData);
    setLastSortName(!lastSortName);
    setLastSortCategory(false);
    setLastSortScore(false);
    setLastSortEstimate(false);

  }

  const sortCategory = (): void => {
    const updatedData = [...data];

    if (!lastSortCategory) {
      updatedData.sort((a, b) => a.category.localeCompare(b.category));
    } else {
      updatedData.sort((a, b) => b.category.localeCompare(a.category));
    }
    
    setData(updatedData);
    setLastSortName(false);
    setLastSortCategory(!lastSortCategory);
    setLastSortScore(false);
    setLastSortEstimate(false);
  }

  const sortScore = (): void => {
    const updatedData = [...data];

    if (!lastSortScore) {
      updatedData.sort((a, b) => a.score - b.score);
    } else {
      updatedData.sort((a, b) => b.score - a.score);
    }
    
    setData(updatedData);
    setLastSortName(false);
    setLastSortCategory(false);
    setLastSortScore(!lastSortScore);
    setLastSortEstimate(false);
  }

  const sortEstimate = (): void => {
    const updatedData = [...data];

    if (!lastSortEstimate) {
      updatedData.sort((a, b) => a.estimate - b.estimate);
    } else {
      updatedData.sort((a, b) => b.estimate - a.estimate);
    }
    
    setData(updatedData);
    setLastSortName(false);
    setLastSortCategory(false);
    setLastSortScore(false);
    setLastSortEstimate(!lastSortEstimate);
  }

  const deletePersonData = (index: number) => {
    const personToDelete = data[index];
    const updatedData = data.filter((_, i) => i !== index);

    if (personToDelete.category === "🟡") {
      setManualMoney(prev => prev - personToDelete.estimate);
    }

    updateTotalScoreAndEstimates(updatedData); // This sets the new data and recalculates
  };

  const handleNormalMoneyClick = () => {
    setNormalMoneyInput(normalMoney);
    setIsEditingNormalMoney(true);
  };

  const handleNormalMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setNormalMoneyInput(Number(e.target.value)); // Update normalMoneyInput
};


  const saveNormalMoney = () => {
    if (normalMoneyInput < 0 || normalMoneyInput > initialMoney) {
      setNormalMoneyInput(normalMoney);  // Revert if out of bounds
    } else {
      setNormalMoney(normalMoneyInput);  // Update the state with new value
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
    setInitialMoneyInput(Number(e.target.value)); // This should update `initialMoneyInput`, not `initialMone`
  };

  const saveInitialMoney = () => {
    if (!initialMoneyInput || initialMoneyInput <= 0) {
      setInitialMoneyInput(initialMoney);  // If invalid input, revert to original
    } else {
      setInitialMoney(initialMoneyInput);  // Save the edited value to the `initialMoney` state
    }
    setIsEditingInitialMoney(false);  // Exit editing mode
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
    const greenData = newData.filter(p => p.category === "🟢");
    const redData = newData.filter(p => p.category === "🔴");

    const greenTotal = greenData.reduce((sum, p) => sum + p.score, 0);
    const redTotal = redData.reduce((sum, p) => sum + p.score, 0);

    const updatedData = newData.map(person => {
      let estimate = person.estimate;

      if (person.category === "🟢" && greenTotal > 0) {
        estimate = (person.score / greenTotal) * (initialMoney - normalMoney - manualMoney);
      } else if (person.category === "🔴" && redTotal > 0) {
        estimate = (person.score / redTotal) * normalMoney;
      }

      return {
        ...person,
        estimate,
      };
    });

    setData(updatedData); // ✅ single place we set the state
  };

  const addHandlerButton = () => {
    if (!currentName.trim() || nameSet.has(currentName)) return;

    const category = currentScore === 0 ? "🟡" : selectedCategory || "🟡"; // Default to 🟡 if no radio selected.
    const newPerson: PersonType = {
      name: currentName,
      category: category,
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
    if (updatedData[index].category === "🟢") {
      updatedData[index].category = "🔴";
    } else if (updatedData[index].category === "🔴") {
      updatedData[index].category = "🟢";
    } else {
      updatedData[index].category = "🟢";
      updatedData[index].score = 1;
      setManualMoney(manualMoney - updatedData[index].estimate);
    }
    updateTotalScoreAndEstimates(updatedData);
  };

  const startEditingScore = (index: number, score: number): void => {
    if (data[index].category === "🟡") return;

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

  useEffect(() => {
    if (editingEstimateIndex !== null && estimateInputRef.current) {
      estimateInputRef.current.focus();
    }
  }, [editingEstimateIndex]);

  useEffect(() => {
    // Recalculate estimates after initial, normal, or manual money change.
    updateTotalScoreAndEstimates(data);
  }, [initialMoney, normalMoney, manualMoney]);

  useEffect(() => {
    setSelectedCategory("🟢"); // This will automatically check the 🟢 radio button
  }, []);

  const saveEstimateEdit = (index: number): void => {
    const updatedData = [...data];

    // Ensure valid estimate input
    const validEstimate = isNaN(editedEstimate) || editedEstimate <= 0 ? 0 : editedEstimate;

    // Save the initial value
    let lastEstimate = 0;

    if (updatedData[index].category === "🟡") {
      lastEstimate = updatedData[index].estimate;
    }

    // Manually update the person's estimate
    updatedData[index].estimate = validEstimate;

    // Reset the score to 0 when editing the estimate
    updatedData[index].score = 0;

    // Change the category to neutral (🟡) when manually editing estimate
    updatedData[index].category = "🟡"; // Neutral category

    // Update manual money, ensuring it doesn't exceed the initial money
    const newManualMoney = manualMoney + validEstimate - lastEstimate;
    if (newManualMoney <= initialMoney) {
      setManualMoney(newManualMoney);
    } else {
      setManualMoney(manualMoney); // Don't allow manual money to exceed initial money
    }

    setEditingEstimateIndex(null);
    updateTotalScoreAndEstimates(updatedData);
  };

  const startEditingEstimate = (index: number, estimate: number): void => {
    setEditingEstimateIndex(index);
    setEditedEstimate(estimate);
  };

  return (
    <div className="flex justify-center items-center flex-col p-20 mx-auto bg-black">
      <div className="flex justify-center items-center flex-col bg-[#1d1d1d] p-5 w-[1300px] rounded-xl py-13">
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
          className="font-extrabold bg-black p-5 py-3 border rounded-xl"
          onClick={handleInitMoneyClick}
          title="Click to edit initial money"
        >
          {numberToDot(initialMoney)}
        </button>
      )}
      
      <div className="flex flex-row justify-around items-center align-middle gap-50 my-10">
        <p className="font-semibold text-green-300 bg-black p-5 py-3 border rounded-xl">{numberToDot(initialMoney - normalMoney - manualMoney)}</p>

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
            className="font-semibold text-red-300 bg-black p-5 py-3 border rounded-xl"
            onClick={handleNormalMoneyClick}
            title="Click to edit normal money"
          >
            {numberToDot(normalMoney)}
          </button>
        )}

        <p className="font-semibold text-yellow-200 bg-black p-5 py-3 border rounded-xl">{numberToDot(manualMoney)}</p>
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

        <div className="flex flex-row justify-evenly">
          <label>
            <input
              type="radio"
              name="type"
              value="🟢"
              checked={selectedCategory === "🟢"}
              onChange={handleCategoryChange}
            />{" "}
            🟢
          </label>

          <label>
            <input
              type="radio"
              name="type"
              value="🔴"
              checked={selectedCategory === "🔴"}
              onChange={handleCategoryChange}
            />{" "}
            🔴
          </label>
        </div>

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
              <th className="min-w-[350px]">
                <button
                  className="hover:text-red-900 hover:scale-105"
                  onClick={() => sortName()}
                >
                  Name
                </button>
              </th>
              <th>
                <button
                  className="hover:text-red-900 hover:scale-105"
                  onClick={() => sortCategory()}
                >
                  Status
                </button>
              </th>
              <th>
                <button
                  className="hover:text-red-900 hover:scale-105"
                  onClick={() => sortScore()}
                >
                  Score
                </button>
              </th>
              <th className="min-w-[180px]">
                <button
                  className="hover:text-red-900 hover:scale-105"
                  onClick={() => sortEstimate()}
                >
                  Estimate
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((person, index) => (
              <tr key={index} className="border-t">
                <td>
                  <button 
                    className="w-full hover:bg-red-900 p-2"
                    onClick={() => deletePersonData(index)}
                  >
                      {index + 1}
                  </button>
                </td>
                
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
                    className="text-sm px-2 py-1 rounded text-xl"
                  >
                    {person.category}
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
                <td>
                  {editingEstimateIndex === index ? (
                      <div className="flex gap-2">
                        <input
                          ref={estimateInputRef}
                          type="number"
                          className="border px-2 py-1 w-20"
                          value={editedEstimate === 0 ? "" : editedEstimate}
                          onChange={(e) => setEditedEstimate(Number(e.target.value))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEstimateEdit(index);
                          }}
                        />
                        <button
                          onClick={() => saveEstimateEdit(index)}
                          className="bg-black text-white px-2 rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditingEstimate(index, person.estimate)}
                        className="hover:text-red-800 hover:scale-105"
                      >
                        {numberToDot(person.estimate)}
                      </button>
                    )}
                </td>
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