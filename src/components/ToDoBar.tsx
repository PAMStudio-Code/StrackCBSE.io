import React, { useState } from 'react';
import { ToDoItem, Priority, TaskCategory, Subject, Chapter } from '../types';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Tag, 
  Clock, 
  Filter, 
  Sparkles,
  Calendar,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToDoBarProps {
  toDos: ToDoItem[];
  setToDos: React.Dispatch<React.SetStateAction<ToDoItem[]>>;
  subjects: Subject[];
  chapters: Chapter[];
  onOpenTab?: (tab: string) => void;
}

export const ToDoBar: React.FC<ToDoBarProps> = ({
  toDos,
  setToDos,
  subjects,
  chapters,
  onOpenTab
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('science');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<TaskCategory>('syllabus');
  const [estimatedMins, setEstimatedMins] = useState<number>(30);
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filter available units based on selected subject
  const subjectChapters = chapters.filter(c => c.subjectId === selectedSubject);
  const availableUnits: string[] = Array.from(new Set(subjectChapters.map(c => c.unitName)));

  const handleToggle = (id: string) => {
    setToDos(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextState = !item.completed;
          if (nextState) {
            try {
              confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
            } catch (e) {}
          }
          return { ...item, completed: nextState };
        }
        return item;
      })
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ToDoItem = {
      id: 'todo-' + Date.now(),
      title: newTitle.trim(),
      subjectId: selectedSubject as any,
      unitName: selectedUnit !== 'all' ? selectedUnit : undefined,
      priority,
      category,
      completed: false,
      estimatedMinutes: estimatedMins,
      createdAt: new Date().toISOString()
    };

    setToDos(prev => [newItem, ...prev]);
    setNewTitle('');
  };

  const handleDelete = (id: string) => {
    setToDos(prev => prev.filter(t => t.id !== id));
  };

  // Filter tasks
  const filteredToDos = toDos.filter(t => {
    if (filterSubject !== 'all' && t.subjectId !== filterSubject) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  const completedCount = filteredToDos.filter(t => t.completed).length;

  // Auto Generate To-Do Tasks from Uncompleted Chapters & Units
  const autoGenerateTasks = () => {
    const uncompletedChapters = chapters.filter(c => !c.completed).slice(0, 3);
    const newTasks: ToDoItem[] = uncompletedChapters.map(ch => ({
      id: 'todo-auto-' + ch.id + '-' + Date.now(),
      title: `Ch ${ch.chapterNum}: ${ch.title} - Complete NCERT Intext & Exercise Questions`,
      subjectId: ch.subjectId,
      chapterId: ch.id,
      unitName: ch.unitName,
      priority: ch.confidence === 'low' ? 'urgent' : 'high',
      category: 'syllabus',
      completed: false,
      estimatedMinutes: 45,
      createdAt: new Date().toISOString()
    }));

    const existingTitles = new Set(toDos.map(t => t.title));
    const uniqueNew = newTasks.filter(t => !existingTitles.has(t.title));

    if (uniqueNew.length > 0) {
      setToDos(prev => [...uniqueNew, ...prev]);
      try {
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
      } catch (e) {}
    }
  };

  const priorityColors = {
    urgent: 'bg-rose-100 text-rose-800 border-rose-200',
    high: 'bg-amber-100 text-amber-800 border-amber-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    low: 'bg-stone-100 text-stone-700 border-stone-200'
  };

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-600" /> Daily CBSE Study To-Do Planner
          </h3>
          <p className="text-xs text-stone-500 font-medium">
            {completedCount} of {filteredToDos.length} tasks completed
          </p>
        </div>

        <button
          onClick={autoGenerateTasks}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Auto-Add Remaining Syllabus Tasks
        </button>
      </div>

      {/* Add New Task Form */}
      <form onSubmit={handleAdd} className="space-y-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Add new study task (e.g., Cover Unit 1 Science Intext Questions)..."
            className="flex-1 bg-white border border-stone-200 text-stone-800 text-xs sm:text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-stone-400"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-4 rounded-xl text-xs flex items-center gap-1 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {/* Subject Dropdown */}
          <select
            value={selectedSubject}
            onChange={e => {
              setSelectedSubject(e.target.value);
              setSelectedUnit('all');
            }}
            className="bg-white border border-stone-200 text-stone-700 font-medium rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Unit Dropdown */}
          <select
            value={selectedUnit}
            onChange={e => setSelectedUnit(e.target.value)}
            className="bg-white border border-stone-200 text-stone-700 font-medium rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500 max-w-[180px] truncate"
          >
            <option value="all">Whole Subject / General</option>
            {availableUnits.map((u, i) => (
              <option key={i} value={u}>{u.split(':')[0]} ({u.split(':')[1]?.slice(0, 20)}...)</option>
            ))}
          </select>

          <select
            value={priority}
            onChange={e => setPriority(e.target.value as Priority)}
            className="bg-white border border-stone-200 text-stone-700 font-medium rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="urgent">Urgent</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={category}
            onChange={e => setCategory(e.target.value as TaskCategory)}
            className="bg-white border border-stone-200 text-stone-700 font-medium rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="syllabus">Unit / Syllabus Topic</option>
            <option value="revision">Revision</option>
            <option value="quiz">Quiz Practice</option>
            <option value="sample_paper">Sample Paper</option>
            <option value="homework">School Homework</option>
          </select>

          <div className="flex items-center gap-1 bg-white border border-stone-200 px-2.5 py-1 rounded-xl text-stone-700 text-xs font-medium">
            <Clock className="w-3 h-3 text-stone-400" />
            <input
              type="number"
              min="5"
              max="180"
              value={estimatedMins}
              onChange={e => setEstimatedMins(Number(e.target.value))}
              className="w-10 bg-transparent text-center focus:outline-none font-bold"
            />
            <span className="text-stone-500">mins</span>
          </div>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-stone-500 flex items-center gap-1 font-semibold text-xs">
            <Filter className="w-3 h-3 text-stone-400" /> Filter:
          </span>
          <button
            onClick={() => setFilterSubject('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
              filterSubject === 'all'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            All
          </button>
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => setFilterSubject(s.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                filterSubject === s.id
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filteredToDos.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs space-y-1 bg-stone-50/50 rounded-xl border border-dashed border-stone-200">
            <p className="font-medium text-stone-600">No study tasks found for selected filter.</p>
            <p className="text-stone-400">Click "Auto-Add Remaining Syllabus Tasks" or go to Syllabus Tracker to add tasks for entire Units!</p>
          </div>
        ) : (
          filteredToDos.map(item => {
            const subj = subjects.find(s => s.id === item.subjectId);
            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  item.completed
                    ? 'bg-stone-50/70 border-stone-200 opacity-60'
                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors flex-shrink-0"
                  >
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0 flex-1">
                    <p
                      className={`text-xs sm:text-sm font-semibold leading-snug break-words ${
                        item.completed ? 'line-through text-stone-400' : 'text-stone-800'
                      }`}
                    >
                      {item.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[10px]">
                      {subj && (
                        <span className={`px-2 py-0.5 rounded-md font-bold ${subj.badgeBg}`}>
                          {subj.name}
                        </span>
                      )}

                      {item.unitName && (
                        <span className="px-2 py-0.5 rounded-md font-bold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-purple-600" />
                          {item.unitName.split(':')[0]}
                        </span>
                      )}

                      <span className={`px-2 py-0.5 rounded-md font-bold border ${priorityColors[item.priority]}`}>
                        {item.priority.toUpperCase()}
                      </span>

                      {item.estimatedMinutes && (
                        <span className="text-stone-500 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" /> {item.estimatedMinutes}m
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
