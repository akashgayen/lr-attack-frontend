import React, { useState } from 'react';

interface MatrixInputProps {
  rows: number;
  cols: number;
  data: any; 
  setData: (data: any) => void; 
  label: string;
}

export function MatrixInput({ rows, cols, data, setData, label }: MatrixInputProps) {
  const [pasteError, setPasteError] = useState(false);
  
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
  
    const pastedText = e.clipboardData.getData('Text');
  
    const pastedValues = pastedText
      .trim() 
      .split(/[\s,]+/) 
      .map((val) => parseFloat(val.trim())) 
      .filter((val) => !isNaN(val)); 
  
    if (pastedValues.length === rows * cols) {
      if (rows === 1) {
        let newData: number[][] = [];
        for (let i = 0; i < cols; i++) {
          newData.push([pastedValues[i]]);
        }
        setData(newData);
        setPasteError(false);
      } else {
        let newData: number[][] = [];
        for (let i = 0; i < rows; i++) {
          newData.push(pastedValues.slice(i * cols, (i + 1) * cols));
        }
        setData(newData);
        setPasteError(false); 
      }
    } else {
      setPasteError(true);
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-gradient">{label}</h2>
      {pasteError && (
        <p className="text-red-500 text-sm">Invalid values found. Please ensure the pasted data has exactly {rows * cols} numeric values.</p>
      )}

      <div
        className="overflow-x-auto rounded-xl glass-effect p-6 shadow-lg"
        onPaste={handlePaste}
      >
        <table className="min-w-full divide-y divide-gray-700/30">
          <tbody className="divide-y divide-gray-700/30">
            {Array(rows).fill(0).map((_, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-blue-500/5 transition-colors duration-200">
                <td className="py-2 px-3 text-sm text-blue-300/70">{rowIndex + 1}</td>
                {Array(cols).fill(0).map((_, colIndex) => (
                  <td key={colIndex} className="p-1">
                    <input
                      type="number"
                      className="w-40 overflow-clip bg-gray-800/50 text-blue-100 rounded-lg px-3 py-2 
                               focus:ring-2 focus:ring-blue-500/50 focus:outline-none 
                               border border-blue-500/10 hover:border-blue-400/30 
                               transition-all duration-200"
                      value={data[rowIndex]?.[colIndex] || 0}
                      onChange={(e) => {
                        const newData = data.map((row: any) => [...row]);
                        if (!newData[rowIndex]) newData[rowIndex] = [];
                        newData[rowIndex][colIndex] = Number(e.target.value);
                        setData(newData);
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
