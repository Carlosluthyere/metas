
import React from 'react';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { Goal } from '../types';
import { CATEGORIES } from '../constants';

interface GoalItemProps {
  goal: Goal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onToggle, onDelete }) => {
  const categoryInfo = CATEGORIES.find(c => c.name === goal.category);

  return (
    <div className={`flex items-center p-4 mb-3 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all ${goal.completed ? 'opacity-70' : ''}`}>
      <button 
        onClick={() => onToggle(goal.id)}
        className={`mr-4 transition-colors ${goal.completed ? 'text-emerald-500' : 'text-slate-300'}`}
      >
        {goal.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>
      
      <div className="flex-1">
        <h3 className={`text-sm font-medium ${goal.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
          {goal.title}
        </h3>
        <div className="flex items-center mt-1">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${categoryInfo?.color}`}>
            {goal.category}
          </span>
        </div>
      </div>

      <button 
        onClick={() => onDelete(goal.id)}
        className="text-slate-300 hover:text-rose-500 transition-colors p-2"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default GoalItem;
