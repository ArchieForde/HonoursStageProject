
export default function QuestionCard({ question, value, onChange }) {
   
  // Check if an option is selected in a multiple choice question
  const isMultipleSelected = (option) => {
    if (Array.isArray(value)) {
      return value.includes(option);
    }
    return false;
  };

  // Toggle an option on/off for multiple choice questions, respecting maxSelections limit
  const handleMultipleChange = (option) => {
    if (Array.isArray(value)) {
      if (value.includes(option)) {
        onChange(question.key, value.filter(item => item !== option));
      } else {
        if (value.length < question.maxSelections) {
          onChange(question.key, [...value, option]);
        }
      }
    } else {
      onChange(question.key, [option]);
    }
  };

  {/* Main question card with purple gradient background */}
  return (
    <div className="bg-purple-800/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 shadow-xl">
      {/* Question title */}
      <h2 className="text-2xl font-bold mb-2 text-purple-50 leading-tight">
        {question.question}
      </h2>
      {/* text  to explain for multiple choice questions */}
      {question.type === "multiple" && (
        <p className="text-sm text-purple-300 mb-6">Select up to {question.maxSelections} options</p>
      )}

      {/* Single choice questions */}
      {question.type === "single" &&
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={option}
              onClick={() => onChange(question.key, option)}
              className={`w-full text-left px-6 py-4 rounded-lg transition-all duration-200 transform hover:scale-102 border-2 
                ${value === option 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 shadow-lg shadow-purple-500/50" 
                  : "bg-purple-700/20 border-purple-500/30 hover:bg-purple-700/40 hover:border-purple-500/50"
                } font-medium
              `}
              style={{
                animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
              }}
            >
              {option}
            </button>
          ))}
        </div>
      }

      {/* Multiple choice question the user can select multiple options with checkboxes */}
      {question.type === "multiple" &&
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={option}
              onClick={() => handleMultipleChange(option)}
              className={`w-full text-left px-6 py-4 rounded-lg transition-all duration-200 transform hover:scale-102 border-2 flex items-center gap-3
                ${isMultipleSelected(option)
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 shadow-lg shadow-purple-500/50" 
                  : "bg-purple-700/20 border-purple-500/30 hover:bg-purple-700/40 hover:border-purple-500/50"
                } font-medium
              `}
              style={{
                animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
              }}
            >
              {/* Shows the Checkbox has been checked */}
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                ${isMultipleSelected(option) ? "bg-white border-white" : "border-purple-400"}
              `}>
                {isMultipleSelected(option) && <span className="text-purple-600 font-bold">✓</span>}
              </div>
              {option}
            </button>
          ))}
        </div>
      }

      {/* rating / number questions, the user selects a number rating (1-5, 1-10, etc.) */}
      {question.type === "scale" &&
        <div className="flex flex-wrap gap-3 justify-center">
          {question.scale.map((num, index) => (
            <button
              key={num}
              onClick={() => onChange(question.key, num)}
              className={`w-12 h-12 rounded-lg font-bold transition-all duration-200 transform hover:scale-110 border-2
                ${value === num 
                  ? "bg-gradient-to-br from-purple-600 to-pink-600 border-purple-300 shadow-lg shadow-purple-500/50 scale-110" 
                  : "bg-purple-700/20 border-purple-500/30 hover:bg-purple-700/40 hover:border-purple-500/50"
                }
              `}
              style={{
                animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
              }}
            >
              {num}
            </button>
          ))}
        </div>
      }

      {/* Animation styles for option buttons sliding in */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
