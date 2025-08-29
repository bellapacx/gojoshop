'use client';

import { AppView } from '@/app/ types/navigation';
import React, { useState, useEffect } from 'react';

const TOTAL_CARDS = 200;

interface CardManagementProps {
  selectedCards: number[];
  setCurrentView: (view: AppView) => void;
}

export default function CardManagementScreen({ selectedCards}: CardManagementProps) {
  const [selectedCardState, setSelectedCardState] = useState<number[]>([]);
  const [bet, setBet] = useState(10);
  const [_commission] = useState('20%');
  const [interval] = useState('4 sec');
  const [pattern, setPattern] = useState('All');
  const [language] = useState('Amharic');
  const [_balance, setBalance] = useState(0);
  const [commission_rate, setCommission] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  console.log(_balance,_commission)
  // Initialize selected cards from props
  useEffect(() => {
    if (selectedCards && selectedCards.length > 0) {
      setSelectedCardState(selectedCards);
    }
  }, [selectedCards]);

  
  // Fetch balance and commission rate
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const shop_id = localStorage.getItem('shop_id');
        const res = await fetch(`https://gojbingoapi.onrender.com/shop/${shop_id}`);
        if (!res.ok) throw new Error('Failed to fetch shop data');

        const { balance, commission_rate } = await res.json();
        setBalance(balance);
        setCommission(commission_rate);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      }
    };
    fetchShopData();
  }, []);
  
  const calculatePrize = () => {
    const numSelected = selectedCardState.length;
    const rate = commission_rate ?? 0.2; // already a number
    return numSelected * bet * (1 - rate);
  };
  
  const toggleCard = (num: number) => {
    setSelectedCardState(prev => 
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
    calculatePrize();
  };

  const handleRefresh = () => setSelectedCardState([]);
  

  

  const startGame = async () => {
  if (selectedCardState.length === 0) {
    alert('Please select at least one card');
    return;
  }

  setIsLoading(true);
  try {
    const shopId = "lidu"; // Replace with actual shop ID retrieval logic
    const res = await fetch("https://gojbingoapi.onrender.com/savegame", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shop_id: shopId,
        bet_per_card: bet,
        prize: calculatePrize(),
        total_cards: selectedCardState.length,
        selected_cards: selectedCardState,
        interval: parseInt(interval) * 1000, // ms
        language,
        commission_rate, // number
        winning_pattern: pattern,
      }),
    });

    if (!res.ok) throw new Error("Game start failed");
   
    alert(`Game started successfully!`);
  } catch (err) {
    console.error("Error:", err);
    alert("Failed to start game");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="w-full min-h-full bg-white text-white flex flex-col">

      {/* Main */}
      <main className="flex-1 flex flex-col items-center mt-2 px-2">
        {/* Title + Refresh */}
        <div className="flex flex-col sm:flex-row items-center mb-4 w-full max-w-xl gap-2">
          <button 
            onClick={handleRefresh}
            className="bg-orange-600 text-white px-4 py-2 rounded-r w-full sm:w-auto hover:bg-orange-700"
          >
            REFRESH
          </button>
        </div>

        {/* Grid + Controls */}
        <div className="flex flex-col md:flex-row items-start gap-4 w-full max-w-6xl">
          {/* Bingo Grid */}
          <div className="grid grid-cols-10 gap-2 overflow-y-auto max-h-[60vh] scrollbar-hide flex-1">
            {Array.from({ length: TOTAL_CARDS }, (_, i) => i + 1).map((num) => {
              const isSelected = selectedCardState.includes(num);
              return (
                <button
                  key={num}
                  onClick={() => toggleCard(num)}
                  className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full border-2 font-bold text-lg
                    ${isSelected 
                      ? 'bg-green-500 text-white border-green-700' 
                      : 'bg-orange-600 text-white border-blue-500 hover:bg-orange-700'}`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex flex-col items-start text-blue-400 space-y-2 w-full md:w-48 mt-4 md:mt-0">

            <label className="flex items-center gap-2 w-full">
              <span className="w-16">Stake:</span>
              <input
                type="number"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                className="w-full py-1 rounded-md text-black bg-white"
              />
            </label>

            <label className="flex items-center gap-2 w-full">
              <span className="w-16">Pattern:</span>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full text-black bg-white rounded px-2 py-1"
              >
                <option>All</option>
                <option>any 1 Line</option>
                <option>any 2 Line</option>
                <option>Full House</option>
              </select>
            </label>

            <button
              onClick={startGame}
              disabled={isLoading}
              className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold mt-2 w-full ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Loading...' : 'Play'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
