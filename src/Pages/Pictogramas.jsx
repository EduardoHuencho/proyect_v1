import React from 'react'
import PictogramaCard from '../Components/PictogramaCard'
import PictogramasList from '../Data/Pictogramas.json'
import { useState } from 'react';

function Pictogramas() {
    const [frase, setFrase] = useState([]);

    const pictogramaHandler = (pictograma) => {
        setFrase([...frase, pictograma]);
        console.log("Enviando ID al backend simulado:", pictograma.id);
    };

    const pictogramaLastDelete = () => {
        if (frase.length === 0) return;
    
        setFrase(frase.slice(0, -1));
    };
  return (
    <>
      <div className="p-6">
        <div className="border p-4 bg-white rounded-2xl min-h-[100px] mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
          
          <div className="flex flex-wrap gap-3 flex-grow">
            {frase.length === 0 ? (
              <p className="text-gray-400 my-auto pl-2">Toca los pictogramas para crear tu frase...</p>
            ) : (
              frase.map((pic, index) => (
                <div key={index} className="p-2 border rounded-xl bg-gray-50 text-center w-20 animate-fade-in">
                  <span className="text-2xl">{pic.icon}</span>
                  <p className="text-xs truncate">{pic.label}</p>
                </div>
              ))
            )}
          </div>

          {frase.length > 0 && (
            <button
              onClick={pictogramaLastDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0"
            >
              <span>⌫</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {PictogramasList.map((item) => (
            <PictogramaCard
              key={item.id}         
              label={item.label}    
              icon={item.icon}
              color={item.color}
              star={item.star}
              onClick={() => pictogramaHandler(item)} 
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Pictogramas