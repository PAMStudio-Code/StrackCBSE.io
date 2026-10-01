import React, { useState } from 'react';
import { Subject, Chapter, Topic, ConfidenceLevel, ToDoItem, SubjectId } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronRight, 
  Star, 
  BookOpen, 
  FileText, 
  Sparkles,
  AlertCircle,
  Award,
  Layers,
  Search,
  CheckSquare,
  Plus,
  PlusCircle,
  ListTodo,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SyllabusTrackerProps {
  subjects: Subject[];
  chapters: Chapter[];
  setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>;
  setToDos?: React.Dispatch<React.SetStateAction<ToDoItem[]>>;
  selectedSubjectFilter?: string;
  searchQuery?: string;
}

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({
  subjects,
  chapters,
  setChapters,
  setToDos,
  selectedSubjectFilter = 'all',
  searchQuery = ''
}) => {
  const [activeSubjectId, setActiveSubjectId] = useState<string>(selectedSubjectFilter || 'all');
  const [expandedChapterIds, setExpandedChapterIds] = useState<Set<string>>(
    new Set(chapters.map(c => c.id))
  );
  const [editingNotesChapterId, setEditingNotesChapterId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedSubjectFilter) {
      setActiveSubjectId(selectedSubjectFilter);
    }
  }, [selectedSubjectFilter]);

  const toggleChapterExpand = (id: string) => {
    setExpandedChapterIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleTopicCompleted = (chapterId: string, topicId: string) => {
    let shouldConfetti = false;

    setChapters(prev =>
      prev.map(ch => {
        if (ch.id === chapterId) {
          const updatedTopics = ch.topics.map(t =>
            t.id === topicId ? { ...t, completed: !t.completed } : t
          );
          const allCompleted = updatedTopics.every(t => t.completed);
          
          if (allCompleted && !ch.completed) {
            shouldConfetti = true;
          }

          return {
            ...ch,
            topics: updatedTopics,
            completed: allCompleted
          };
        }
        return ch;
      })
    );

    if (shouldConfetti) {
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    }
  };

  const toggleChapterCompleted = (chapterId: string) => {
    let noticeText = '';
    let shouldConfetti = false;

    setChapters(prev =>
      prev.map(ch => {
        if (ch.id === chapterId) {
          const targetState = !ch.completed;
          if (targetState) {
            shouldConfetti = true;
            noticeText = `Marked Chapter ${ch.chapterNum}: "${ch.title}" as Completed! 🎉`;
          } else {
            noticeText = `Reset Chapter ${ch.chapterNum}: "${ch.title}" progress`;
          }

          return {
            ...ch,
            completed: targetState,
            topics: ch.topics.map(t => ({ ...t, completed: targetState }))
          };
        }
        return ch;
      })
    );

    if (shouldConfetti) {
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    }
    if (noticeText) {
      setAddedNotice(noticeText);
      setTimeout(() => setAddedNotice(null), 3000);
    }
  };

  const setConfidence = (chapterId: string, confidence: ConfidenceLevel) => {
    setChapters(prev =>
      prev.map(ch => (ch.id === chapterId ? { ...ch, confidence } : ch))
    );
  };

  const handleSaveNotes = (chapterId: string) => {
    setChapters(prev =>
      prev.map(ch => (ch.id === chapterId ? { ...ch, notes: tempNotes } : ch))
    );
    setEditingNotesChapterId(null);
  };

  const toggleUnitCompleted = (unitName: string, subjectId: SubjectId) => {
    let noticeText = '';
    let shouldConfetti = false;

    const unitChaps = chapters.filter(c => c.subjectId === subjectId && c.unitName === unitName);
    const isAllDone = unitChaps.every(c => c.completed && c.topics.every(t => t.completed));
    const targetState = !isAllDone;

    if (targetState) {
      shouldConfetti = true;
      noticeText = `Marked unit "${unitName.split(':')[0] || unitName}" as Completed! 🎉`;
    } else {
      noticeText = `Reset progress for unit "${unitName.split(':')[0] || unitName}"`;
    }

    setChapters(prev =>
      prev.map(ch => {
        if (ch.subjectId === subjectId && ch.unitName === unitName) {
          return {
            ...ch,
            completed: targetState,
            topics: ch.topics.map(t => ({ ...t, completed: targetState }))
          };
        }
        return ch;
      })
    );

    if (shouldConfetti) {
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
    if (noticeText) {
      setAddedNotice(noticeText);
      setTimeout(() => setAddedNotice(null), 3000);
    }
  };

  const handleAddChapterToDo = (chapter: Chapter) => {
    if (!setToDos) return;
    const newTodo: ToDoItem = {
      id: 'todo-ch-' + chapter.id + '-' + Date.now(),
      title: `Ch ${chapter.chapterNum}: ${chapter.title} - Full Revision`,
      subjectId: chapter.subjectId,
      chapterId: chapter.id,
      unitName: chapter.unitName,
      priority: chapter.confidence === 'low' ? 'urgent' : 'medium',
      category: 'revision',
      completed: false,
      estimatedMinutes: 45,
      createdAt: new Date().toISOString()
    };
    setToDos(prev => [newTodo, ...prev]);
    setAddedNotice(`Added To-Do for Chapter ${chapter.chapterNum}!`);
    setTimeout(() => setAddedNotice(null), 3000);
    try {
      confetti({ particleCount: 20, spread: 35, origin: { y: 0.8 } });
    } catch (e) {}
  };

  // Filtering
  let displayedChapters = chapters;
  if (activeSubjectId !== 'all') {
    displayedChapters = displayedChapters.filter(c => c.subjectId === activeSubjectId);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedChapters = displayedChapters.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.unitName.toLowerCase().includes(q) ||
      c.topics.some(t => t.title.toLowerCase().includes(q))
    );
  }

  // Calculate totals for active filter
  const totalTopics = displayedChapters.reduce((acc, c) => acc + c.topics.length, 0);
  const completedTopics = displayedChapters.reduce(
    (acc, c) => acc + c.topics.filter(t => t.completed).length,
    0
  );
  const percent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Export syllabus progress to Stracked_CBSE_Progress.json
  const handleExportProgress = () => {
    try {
      const exportPayload = {
        app: 'Stracked',
        title: 'Stracked — CBSE Study & Syllabus Tracker',
        exportedAt: new Date().toISOString(),
        summary: {
          totalTopics,
          completedTopics,
          completionPercentage: percent
        },
        chapters
      };
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Stracked_CBSE_Progress.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setAddedNotice('Exported Stracked_CBSE_Progress.json successfully!');
      setTimeout(() => setAddedNotice(null), 3000);
    } catch (e) {
      console.error('Failed to export syllabus progress:', e);
    }
  };

  // Group chapters by Unit
  const unitsMap = new Map<string, { unitName: string; subjectId: SubjectId; chapters: Chapter[] }>();
  displayedChapters.forEach(ch => {
    const key = `${ch.subjectId}___${ch.unitName}`;
    if (!unitsMap.has(key)) {
      unitsMap.set(key, { unitName: ch.unitName, subjectId: ch.subjectId, chapters: [] });
    }
    unitsMap.get(key)!.chapters.push(ch);
  });
  const groupedUnits = Array.from(unitsMap.values());

  return (
    <div className="space-y-6">
      
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-stone-700 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <ListTodo className="w-4 h-4 text-emerald-400" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Subject Filter Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" /> Filter CBSE Subjects
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              {completedTopics}/{totalTopics} Topics Completed ({percent}%)
            </span>
            <button
              onClick={handleExportProgress}
              className="text-xs font-semibold px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg border border-stone-300/80 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export syllabus data to Stracked_CBSE_Progress.json"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>Export Progress</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubjectId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubjectId === 'all'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/80'
            }`}
          >
            All Subjects
          </button>

          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSubjectId(s.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeSubjectId === s.id
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/80'
              }`}
            >
              <span>{s.name}</span>
              <span className="text-[10px] opacity-80">({s.code})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Units & Chapters Accordion List */}
      <div className="space-y-6">
        {groupedUnits.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 space-y-2">
            <Search className="w-8 h-8 text-stone-400 mx-auto" />
            <p className="text-sm font-semibold text-stone-700">No chapters found for query "{searchQuery}"</p>
            <p className="text-xs text-stone-500">Try adjusting your search terms or clearing filters.</p>
          </div>
        ) : (
          groupedUnits.map((group, groupIdx) => {
            const subj = subjects.find(s => s.id === group.subjectId);
            const unitTotalTopics = group.chapters.reduce((acc, c) => acc + c.topics.length, 0);
            const unitCompletedTopics = group.chapters.reduce(
              (acc, c) => acc + c.topics.filter(t => t.completed).length,
              0
            );
            const unitPercent = unitTotalTopics > 0 ? Math.round((unitCompletedTopics / unitTotalTopics) * 100) : 0;
            const unitTotalMarks = group.chapters.reduce((acc, c) => acc + c.weightageMarks, 0);

            return (
              <div key={groupIdx} className="space-y-3">
                
                {/* Unit Header Block */}
                <div className="bg-stone-100/90 border border-stone-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {subj && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${subj.badgeBg}`}>
                            {subj.name}
                          </span>
                        )}
                        <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                          Unit Group
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {unitTotalMarks} Marks in Board Exam
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
                        {group.unitName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-700">
                        {unitCompletedTopics}/{unitTotalTopics} Topics ({unitPercent}%)
                      </div>
                      <div className="w-28 bg-stone-200 h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className="bg-emerald-600 h-full transition-all duration-500" 
                          style={{ width: `${unitPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Complete Full Unit Checkmark Button */}
                    <button
                      onClick={() => toggleUnitCompleted(group.unitName, group.subjectId)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all whitespace-nowrap cursor-pointer ${
                        unitPercent === 100
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-stone-200/90 hover:bg-emerald-600 hover:text-white text-stone-700'
                      }`}
                      title={unitPercent === 100 ? "Unit completed! Click to reset unit progress." : "Mark entire unit as completed"}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${unitPercent === 100 ? 'text-white' : 'text-stone-500'}`} />
                      <span>{unitPercent === 100 ? 'Unit Completed' : 'Complete Unit'}</span>
                    </button>
                  </div>
                </div>

                {/* Chapters in this Unit */}
                <div className="space-y-3 pl-1 sm:pl-3 border-l-2 border-stone-200/80">
                  {group.chapters.map(chapter => {
                    const isExpanded = expandedChapterIds.has(chapter.id);
                    const chapterDoneTopics = chapter.topics.filter(t => t.completed).length;
                    const chapterTotalTopics = chapter.topics.length;
                    const chapterPercent = chapterTotalTopics > 0 
                      ? Math.round((chapterDoneTopics / chapterTotalTopics) * 100) 
                      : 0;

                    return (
                      <div
                        key={chapter.id}
                        className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs transition-all"
                      >
                        {/* Chapter Header */}
                        <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/80 transition-colors border-b border-stone-100">
                          <div className="flex items-start gap-3 flex-1 cursor-pointer" onClick={() => toggleChapterExpand(chapter.id)}>
                            <button className="mt-1 text-stone-400 hover:text-stone-700">
                              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </button>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold text-stone-500">
                                  Chapter {chapter.chapterNum}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                                  {chapter.weightageMarks} Marks
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleChapterCompleted(chapter.id);
                                  }}
                                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all cursor-pointer ${
                                    chapter.completed
                                      ? 'text-emerald-800 bg-emerald-100 border-emerald-300 hover:bg-emerald-200'
                                      : 'text-stone-500 bg-stone-100 border-stone-200 hover:bg-stone-200'
                                  }`}
                                  title="Toggle chapter completion"
                                >
                                  <CheckCircle2 className={`w-3.5 h-3.5 ${chapter.completed ? 'text-emerald-700' : 'text-stone-400'}`} />
                                  <span>{chapter.completed ? 'Completed' : 'Incomplete'}</span>
                                </button>
                              </div>

                              <h4 className="text-sm sm:text-base font-bold text-stone-900 mt-0.5">
                                {chapter.title}
                              </h4>
                            </div>
                          </div>

                          {/* Right Chapter Controls & Stats */}
                          <div className="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 justify-between sm:justify-end">
                            
                            {/* Confidence Status Selector */}
                            <div className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded-xl border border-stone-200">
                              <span className="text-[10px] text-stone-500 font-medium">Confidence:</span>
                              <button
                                onClick={() => setConfidence(chapter.id, 'low')}
                                className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                                  chapter.confidence === 'low'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                    : 'text-stone-400 hover:text-rose-600'
                                }`}
                              >
                                Low
                              </button>
                              <button
                                onClick={() => setConfidence(chapter.id, 'medium')}
                                className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                                  chapter.confidence === 'medium'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'text-stone-400 hover:text-amber-600'
                                }`}
                              >
                                Med
                              </button>
                              <button
                                onClick={() => setConfidence(chapter.id, 'high')}
                                className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                                  chapter.confidence === 'high'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'text-stone-400 hover:text-emerald-600'
                                }`}
                              >
                                High
                              </button>
                            </div>

                            {/* Chapter Complete Checkmark Toggle Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleChapterCompleted(chapter.id);
                              }}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                                chapter.completed
                                  ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                                  : 'bg-white hover:bg-emerald-50 text-stone-700 border-stone-200/90 hover:border-emerald-300 hover:text-emerald-800'
                              }`}
                              title={chapter.completed ? 'Click to mark chapter as Incomplete' : 'Click to mark entire chapter as Complete'}
                            >
                              <CheckCircle2 className={`w-4 h-4 ${chapter.completed ? 'text-white' : 'text-stone-400'}`} />
                              <span>{chapter.completed ? 'Chapter Done' : 'Complete Chapter'}</span>
                            </button>

                            {/* Add Chapter To-Do button */}
                            {setToDos && (
                              <button
                                onClick={() => handleAddChapterToDo(chapter)}
                                className="p-1.5 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-600 rounded-xl border border-stone-200 hover:border-emerald-300 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                                title="Add To-Do task for this Chapter"
                              >
                                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="hidden md:inline">Chapter To-Do</span>
                              </button>
                            )}

                            {/* Progress Badge */}
                            <div className="text-right pl-1">
                              <div className="text-xs font-bold text-emerald-700">
                                {chapterDoneTopics}/{chapterTotalTopics}
                              </div>
                              <div className="text-[10px] text-stone-500">
                                {chapterPercent}%
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Topics & Notes View */}
                        {isExpanded && (
                          <div className="p-4 bg-stone-50/70 space-y-4 border-t border-stone-100">
                            
                            {/* Formulae / Key Concept Highlights */}
                            {chapter.keyFormulae && chapter.keyFormulae.length > 0 && (
                              <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl space-y-1.5">
                                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Key Formulas & NCERT Equations:
                                </span>
                                <ul className="text-xs text-amber-900 space-y-1 font-mono pl-3 list-disc">
                                  {chapter.keyFormulae.map((kf, i) => (
                                    <li key={i}>{kf}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Topic Checkboxes Grid */}
                            <div className="space-y-2">
                              <h5 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                                Chapter Syllabus Topics Checklist
                              </h5>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {chapter.topics.map(topic => (
                                  <div
                                    key={topic.id}
                                    onClick={() => toggleTopicCompleted(chapter.id, topic.id)}
                                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                                      topic.completed
                                        ? 'bg-emerald-50/80 border-emerald-200 text-stone-700'
                                        : 'bg-white border-stone-200 hover:border-emerald-300 text-stone-800'
                                    }`}
                                  >
                                    <button className="mt-0.5 text-emerald-600">
                                      {topic.completed ? (
                                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-stone-400" />
                                      )}
                                    </button>

                                    <div className="flex-1 space-y-0.5">
                                      <p className={`text-xs font-medium ${topic.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                                        {topic.title}
                                      </p>
                                      {topic.ncertRef && (
                                        <span className="text-[10px] text-stone-500">
                                          Ref: {topic.ncertRef}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Personal Notes Section */}
                            <div className="pt-2 border-t border-stone-200/80">
                              {editingNotesChapterId === chapter.id ? (
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-stone-700">Edit Personal Notes / Doubts:</label>
                                  <textarea
                                    value={tempNotes}
                                    onChange={e => setTempNotes(e.target.value)}
                                    rows={3}
                                    className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    placeholder="Write important formulas, doubtful topics, or revision notes here..."
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => setEditingNotesChapterId(null)}
                                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-medium"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleSaveNotes(chapter.id)}
                                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                                    >
                                      Save Notes
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <p className="text-xs text-stone-500 italic">
                                    {chapter.notes ? `Note: "${chapter.notes}"` : 'No custom notes added for this chapter yet.'}
                                  </p>
                                  <button
                                    onClick={() => {
                                      setEditingNotesChapterId(chapter.id);
                                      setTempNotes(chapter.notes || '');
                                    }}
                                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                                  >
                                    <FileText className="w-3.5 h-3.5" /> {chapter.notes ? 'Edit Notes' : 'Add Notes'}
                                  </button>
                                </div>
                              )}
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
