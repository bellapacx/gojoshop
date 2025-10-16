"use client";

import React, { useState, ChangeEvent, useEffect } from "react";

type BingoColumns = {
  B: (number | null)[];
  I: (number | null)[];
  N: (number | null)[];
  G: (number | null)[];
  O: (number | null)[];
};

type BingoCard = BingoColumns & {
  card_id: number;
};

const createEmptyCard = (id: number): BingoCard => ({
  B: Array(5).fill(null),
  I: Array(5).fill(null),
  N: Array(5).fill(null),
  G: Array(5).fill(null),
  O: Array(5).fill(null),
  card_id: id,
});

export default function BingoCardCreator() {
  const [cards, setCards] = useState<BingoCard[]>([createEmptyCard(1)]);
  const [shopId, setShopId] = useState<string>("");

  useEffect(() => {
    const storedShopId = localStorage.getItem("shop_id");
    if (storedShopId) setShopId(storedShopId);
  }, []);

  const handleChange = (
    cardIndex: number,
    column: keyof BingoColumns,
    rowIndex: number,
    value: string
  ) => {
    setCards((prev) => {
      const updated = [...prev];
      updated[cardIndex][column][rowIndex] =
        value === "" ? null : Number(value);
      return updated;
    });
  };

  const handleCardIdChange = (cardIndex: number, value: string) => {
    setCards((prev) => {
      const updated = [...prev];
      updated[cardIndex].card_id = Number(value) || 0;
      return updated;
    });
  };

  const addCard = () => {
    setCards((prev) => [...prev, createEmptyCard(prev.length + 1)]);
  };

  const generateJSON = () => {
    if (!shopId) {
      alert("Please enter a Shop ID first.");
      return;
    }
    const jsonData = JSON.stringify(cards, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${shopId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 bg-slate-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4 text-slate-700 text-center">
        Bingo Card Creator
      </h1>

      {/* Shop ID input */}
      <div className="mb-4 flex flex-col gap-2">
        <label className="font-medium text-slate-700 text-sm">Shop ID:</label>
        <input
          type="text"
          value={shopId}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setShopId(e.target.value)
          }
          className="border rounded p-2 w-full"
          placeholder="Enter Shop ID"
        />
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-6">
        {cards.map((card, cardIndex) => (
          <div
            key={cardIndex}
            className="bg-white shadow-md rounded-lg border border-slate-200 overflow-hidden"
          >
            <div className="flex items-center justify-between bg-slate-800 text-white font-bold py-2 px-4 text-sm">
              <span>Card #{card.card_id}</span>
              {/* Editable Card ID */}
              <input
                type="number"
                value={card.card_id}
                onChange={(e) => handleCardIdChange(cardIndex, e.target.value)}
                className="w-16 text-center rounded border border-slate-300 px-1 py-0 text-sm"
              />
            </div>
            <table className="w-full text-center border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-200">
                  {["B", "I", "N", "G", "O"].map((col) => (
                    <th
                      key={col}
                      className="p-2 border border-slate-300 font-bold"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3, 4].map((rowIndex) => (
                  <tr key={rowIndex}>
                    {(["B", "I", "N", "G", "O"] as (keyof BingoColumns)[]).map(
                      (col) => (
                        <td key={col} className="border border-slate-300 p-1">
                          <input
                            type="number"
                            value={card[col][rowIndex] ?? ""}
                            onChange={(e) =>
                              handleChange(
                                cardIndex,
                                col,
                                rowIndex,
                                e.target.value
                              )
                            }
                            className="w-10 sm:w-12 text-center border rounded p-1 text-xs sm:text-sm"
                            disabled={col === "N" && rowIndex === 2} // free space
                          />
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={addCard}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          Add New Card
        </button>
        <button
          onClick={generateJSON}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          Save JSON
        </button>
      </div>
    </div>
  );
}
