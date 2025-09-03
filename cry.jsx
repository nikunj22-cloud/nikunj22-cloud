import React, { useState } from 'react';

const LagrangeInterpolationSolver = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const convertToDecimal = (value, base) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = 0n;
    const baseNum = BigInt(base);
    
    for (let i = 0; i < value.length; i++) {
      const char = value[i].toLowerCase();
      const digit = chars.indexOf(char);
      if (digit >= base || digit === -1) {
        throw new Error(`Invalid digit '${char}' for base ${base}`);
      }
      result = result * baseNum + BigInt(digit);
    }
    return result;
  };

  const lagrangeInterpolation = (points) => {
    let result = 0n;
    const k = points.length;
    
    for (let i = 0; i < k; i++) {
      let numerator = 1n;
      let denominator = 1n;
      
      for (let j = 0; j < k; j++) {
        if (i !== j) {
          numerator *= (0n - BigInt(points[j].x));
          denominator *= (BigInt(points[i].x) - BigInt(points[j].x));
        }
      }
      
      result += points[i].y * numerator / denominator;
    }
    
    return result;
  };

  const processData = async () => {
    if (!input.trim()) {
      setError('Please provide input data');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = JSON.parse(input);
      const { k } = data.keys;
      
      const points = [];
      const allKeys = Object.keys(data)
        .filter(key => key !== 'keys')
        .map(Number)
        .sort((a, b) => a - b)
        .slice(0, k);

      for (const key of allKeys) {
        const point = data[key];
        const x = key;
        const y = convertToDecimal(point.value, parseInt(point.base));
        points.push({ x, y });
      }

      const secret = lagrangeInterpolation(points);
      setResult(secret.toString());
      
    } catch (err) {
      setError(err.message || 'Invalid input format');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sample) => {
    const samples = {
      1: `{
  "keys": {
    "n": 4,
    "k": 3
  },
  "1": {
    "base": "10",
    "value": "4"
  },
  "2": {
    "base": "2",
    "value": "111"
  },
  "3": {
    "base": "10",
    "value": "12"
  },
  "6": {
    "base": "4",
    "value": "213"
  }
}`,
      2: `{
  "keys": {
    "n": 10,
    "k": 7
  },
  "1": {
    "base": "6",
    "value": "13444211440455345511"
  },
  "2": {
    "base": "15",
    "value": "aed7015a346d635"
  },
  "3": {
    "base": "15",
    "value": "6aeeb69631c227c"
  },
  "4": {
    "base": "16",
    "value": "e1b5e05623d881f"
  },
  "5": {
    "base": "8",
    "value": "316034514573652620673"
  },
  "6": {
    "base": "3",
    "value": "2122212201122002221120200210011020220200"
  },
  "7": {
    "base": "3",
    "value": "20120221122211000100210021102001201112121"
  },
  "8": {
    "base": "6",
    "value": "20220554335330240002224253"
  },
  "9": {
    "base": "12",
    "value": "45153788322a1255483"
  },
  "10": {
    "base": "7",
    "value": "1101613130313526312514143"
  }
}`
    };
    setInput(samples[sample]);
    setError('');
    setResult(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      processData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">
              Lagrange Interpolation Calculator
            </h1>
            <p className="text-blue-100 mt-2">
              Calculate polynomial constant term using interpolation
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => loadSample(1)}
                      className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Sample 1
                    </button>
                    <button
                      onClick={() => loadSample(2)}
                      className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Sample 2
                    </button>
                    <button
                      onClick={() => {setInput(''); setResult(null); setError('');}}
                      className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Paste JSON data here... (Ctrl+Enter to calculate)"
                    spellCheck={false}
                  />
                </div>

                <button
                  onClick={processData}
                  disabled={loading || !input.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-md transition-colors"
                >
                  {loading ? 'Processing...' : 'Calculate'}
                </button>
              </div>

              <div className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <h3 className="text-red-800 font-medium">Error</h3>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                )}

                {result && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <h3 className="text-green-800 font-medium mb-2">Result</h3>
                    <div className="bg-white p-3 rounded border font-mono text-sm break-all">
                      {result}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h3 className="text-gray-800 font-medium mb-2">How it works</h3>
                  <div className="text-gray-600 text-sm space-y-2">
                    <p>1. Converts values from different bases to decimal</p>
                    <p>2. Uses first k points for interpolation</p>
                    <p>3. Applies Lagrange interpolation formula</p>
                    <p>4. Calculates f(0) as the constant term</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h3 className="text-gray-800 font-medium mb-2">Formula</h3>
                  <div className="text-gray-600 text-sm font-mono">
                    f(0) = Σ yᵢ × Π(j≠i) (-xⱼ)/(xᵢ-xⱼ)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LagrangeInterpolationSolver;
