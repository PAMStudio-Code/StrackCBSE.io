import React, { useState } from 'react';
import { 
  Subject, 
  Chapter, 
  QuizQuestion, 
  QuizAttempt, 
  WeakArea 
} from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Zap, 
  BrainCircuit, 
  BookOpen,
  Award,
  Loader2,
  HelpCircle,
  Hash
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Helper to generate dynamic, concept-focused subject practice questions when offline/fallback
function createFallbackQuestionsForChapter(chapter: Chapter, subjectName: string, targetCount: number = 5): QuizQuestion[] {
  const t1 = chapter.topics[0]?.title || 'Core Principles';
  const t2 = chapter.topics[1]?.title || 'Key Definitions & Laws';
  const t3 = chapter.topics[2]?.title || 'Numerical & Conceptual Applications';

  const baseQuestions: QuizQuestion[] = [
    {
      id: `gen-q1-${chapter.id}-${Date.now()}-1`,
      chapterId: chapter.id,
      subjectId: chapter.subjectId,
      type: 'mcq',
      question: `Regarding the topic "${t1}" in ${chapter.title}, which of the following statements is scientifically and conceptually accurate?`,
      options: [
        `It accurately describes the fundamental physical or chemical relationship of ${t1}.`,
        `It reverses the primary cause-and-effect rule governing ${t1}.`,
        `It assumes an ideal condition that violates fundamental conservation laws.`,
        `It applies only under extreme non-standard experimental conditions.`
      ],
      correctAnswer: 0,
      explanation: `Understanding the primary mechanism of ${t1} is crucial for solving conceptual problems in ${chapter.title}.`,
      ncertRef: `${chapter.title}`
    },
    {
      id: `gen-q2-${chapter.id}-${Date.now()}-2`,
      chapterId: chapter.id,
      subjectId: chapter.subjectId,
      type: 'mcq',
      question: `Which of the following best represents the key principle or formula associated with "${t2}" in ${chapter.title}?`,
      options: [
        `The direct mathematical relationship derived for ${t2}.`,
        `An inverse relationship where doubling one quantity reduces the other to zero.`,
        `A constant coefficient independent of temperature, pressure, or medium.`,
        `An empirical formula that applies exclusively to theoretical states.`
      ],
      correctAnswer: 0,
      explanation: `${t2} defines the core relationship in ${chapter.title}, requiring correct substitution of units and variables.`,
      ncertRef: `${chapter.title}`
    },
    {
      id: `gen-q3-${chapter.id}-${Date.now()}-3`,
      chapterId: chapter.id,
      subjectId: chapter.subjectId,
      type: 'assertion_reason',
      question: `Assertion (A): Mastering the core concept "${t3}" enables accurate problem solving in ${chapter.title}.\nReason (R): "${t3}" directly links foundational laws to real-world applications and quantitative calculations.`,
      options: [
        'Both A and R are true and R is the correct explanation of A.',
        'Both A and R are true but R is NOT the correct explanation of A.',
        'A is true but R is false.',
        'A is false but R is true.'
      ],
      correctAnswer: 0,
      explanation: `Both Assertion and Reason are true. Conceptual understanding of ${t3} provides the necessary framework for analytical problem solving.`,
      ncertRef: `${chapter.title}`
    },
    {
      id: `gen-q4-${chapter.id}-${Date.now()}-4`,
      chapterId: chapter.id,
      subjectId: chapter.subjectId,
      type: 'mcq',
      question: `When analyzing "${t1}" alongside "${t2}" in ${chapter.title}, what is the primary condition required for equilibrium or stability?`,
      options: [
        `The net external forces or reactant-product rates reach a dynamic balance.`,
        `The system temperature drops to absolute zero continuously.`,
        `All chemical bonds or electrical connections are broken simultaneously.`,
        `The total potential energy reaches its absolute maximum level.`
      ],
      correctAnswer: 0,
      explanation: `Equilibrium and stability in ${chapter.title} depend on balanced net rates and conservation principles.`,
      ncertRef: `${chapter.title}`
    },
    {
      id: `gen-q5-${chapter.id}-${Date.now()}-5`,
      chapterId: chapter.id,
      subjectId: chapter.subjectId,
      type: 'mcq',
      question: `In practical experiments or calculations involving "${t2}", which of the following is a common conceptual error to avoid?`,
      options: [
        `Confusing scalar and vector quantities or using incompatible units during substitution.`,
        `Writing down clear step-by-step mathematical steps.`,
        `Verifying dimensional accuracy of final calculated units.`,
        `Drawing labeled diagrams before solving.`
      ],
      correctAnswer: 0,
      explanation: `Ensuring unit consistency and clear variable definitions is critical when applying laws in ${chapter.title}.`,
      ncertRef: `${chapter.title}`
    }
  ];

  while (baseQuestions.length < targetCount) {
    const idx = baseQuestions.length + 1;
    const topicName = chapter.topics[(idx - 1) % chapter.topics.length]?.title || 'Core Topic';
    baseQuestions.push({
      id: `gen-q${idx}-${chapter.id}-${Date.now()}`,
      chapterId: chapter.id,
      subjectId: chapter.subjectId,
      type: idx % 2 === 0 ? 'assertion_reason' : 'mcq',
      question: `Question ${idx}: For "${topicName}" in ${chapter.title}, evaluate which statement correctly describes its core property:`,
      options: [
        `It accurately follows the governing fundamental laws for ${topicName}.`,
        `It violates the basic conservation of energy and momentum.`,
        `It is completely independent of environmental variables.`,
        `None of the above statements are accurate.`
      ],
      correctAnswer: 0,
      explanation: `Understanding ${topicName} is key to mastering ${chapter.title}.`,
      ncertRef: `${chapter.title}`
    });
  }

  return baseQuestions.slice(0, targetCount);
}

interface QuizAnalyticsProps {
  subjects: Subject[];
  chapters: Chapter[];
  quizQuestions: QuizQuestion[];
  setQuizQuestions: React.Dispatch<React.SetStateAction<QuizQuestion[]>>;
  quizAttempts: QuizAttempt[];
  setQuizAttempts: React.Dispatch<React.SetStateAction<QuizAttempt[]>>;
  weakAreas: WeakArea[];
  onOpenTab: (tab: string, filterSubj?: string) => void;
}

export const QuizAnalytics: React.FC<QuizAnalyticsProps> = ({
  subjects,
  chapters,
  quizQuestions,
  setQuizQuestions,
  quizAttempts,
  setQuizAttempts,
  weakAreas,
  onOpenTab
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('science');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(5); // Default 5, options: 3, 5, 10, 15, 20
  
  // Quiz Active Test State
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // AI Loading State
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // AI Explanation State
  const [explainingQuestionId, setExplainingQuestionId] = useState<string | null>(null);
  const [aiExplanationText, setAiExplanationText] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);

  // Start Quiz Session with requested question count - automatically triggers AI Generation
  const startQuiz = async (chapterIdFilter?: string, requestedCount?: number) => {
    const targetChapId = chapterIdFilter || selectedChapterId;
    const targetCount = requestedCount || questionCount;

    let targetChap = chapters.find(c => c.id === targetChapId);
    if (!targetChap && selectedSubjectId !== 'all') {
      const subjectChaps = chapters.filter(c => c.subjectId === selectedSubjectId);
      if (subjectChaps.length > 0) {
        targetChap = subjectChaps[Math.floor(Math.random() * subjectChaps.length)];
      }
    }

    if (targetChap) {
      await handleGenerateAiQuiz(targetChap, targetCount);
      return;
    }

    // Fallback if 'all' subjects selected
    let pool = quizQuestions;
    if (pool.length < targetCount && chapters.length > 0) {
      const randomChap = chapters[Math.floor(Math.random() * chapters.length)];
      await handleGenerateAiQuiz(randomChap, targetCount);
      return;
    }

    setActiveQuizQuestions(pool.slice(0, targetCount));
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setQuizScore(0);
    setAiExplanationText(null);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (!activeQuizQuestions) return;
    if (userAnswers[currentQuestionIndex] !== undefined) return; // Once answered, direct feedback is locked in

    const newAnswers = { ...userAnswers, [currentQuestionIndex]: optionIndex };
    setUserAnswers(newAnswers);

    // Calculate updated score live
    let score = 0;
    activeQuizQuestions.forEach((q, idx) => {
      if (newAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });
    setQuizScore(score);

    // When all questions have been answered, log the attempt
    if (Object.keys(newAnswers).length === activeQuizQuestions.length) {
      setIsSubmitted(true);
      const accuracy = Math.round((score / activeQuizQuestions.length) * 100);

      if (accuracy >= 80) {
        try {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }

      // Record attempt
      const newAttempt: QuizAttempt = {
        id: 'attempt-' + Date.now(),
        chapterId: activeQuizQuestions[0]?.chapterId || 'gen',
        subjectId: activeQuizQuestions[0]?.subjectId || 'science',
        score,
        totalQuestions: activeQuizQuestions.length,
        accuracy,
        timestamp: new Date().toISOString(),
        timeSpentSeconds: activeQuizQuestions.length * 30
      };

      setQuizAttempts(prev => [newAttempt, ...prev]);
    }
  };

  // Generate Custom AI Quiz using Gemini Server Route
  const handleGenerateAiQuiz = async (chapterObj: Chapter, requestedCount?: number) => {
    const count = requestedCount || questionCount;
    try {
      setIsGeneratingAiQuiz(true);
      setAiError(null);

      const res = await fetch('/api/gemini/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subjects.find(s => s.id === chapterObj.subjectId)?.name || 'Science',
          chapterName: chapterObj.title,
          count: count
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate AI quiz');
      }

      if (data.questions && data.questions.length > 0) {
        const formatted: QuizQuestion[] = data.questions.map((q: any, i: number) => ({
          id: `ai-q-${chapterObj.id}-${Date.now()}-${i}`,
          chapterId: chapterObj.id,
          subjectId: chapterObj.subjectId,
          type: q.type === 'assertion_reason' ? 'assertion_reason' : 'mcq',
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          ncertRef: `AI Generated for ${chapterObj.title}`
        }));

        setQuizQuestions(prev => [...formatted, ...prev]);
        setActiveQuizQuestions(formatted);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setIsSubmitted(false);
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Error generating questions.');
      // Fallback
      const subjName = subjects.find(s => s.id === chapterObj.subjectId)?.name || 'Class 10';
      const generated = createFallbackQuestionsForChapter(chapterObj, subjName, count);
      setActiveQuizQuestions(generated);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setIsSubmitted(false);
    } finally {
      setIsGeneratingAiQuiz(false);
    }
  };

  // Request AI Doubt Explanation with special character Unicode support
  const handleRequestAiExplanation = async (q: QuizQuestion) => {
    try {
      setExplainingQuestionId(q.id);
      setIsExplaining(true);
      setAiExplanationText(null);

      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: q.ncertRef || 'CBSE Class 10',
          questionText: q.question,
          studentQuery: `Explain why option "${q.options[q.correctAnswer]}" is correct and give detailed step-by-step CBSE exam tips, including special characters/grammar rules/formulas if applicable.`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get explanation');
      setAiExplanationText(data.explanation);
    } catch (err: any) {
      setAiExplanationText("Note: AI Explanation server route requires GEMINI_API_KEY. Default explanation: " + q.explanation);
    } finally {
      setIsExplaining(false);
    }
  };

  const filteredChapters = chapters.filter(c => selectedSubjectId === 'all' || c.subjectId === selectedSubjectId);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-stone-900">
              CBSE Class 10 Target Quiz Engine & Weakness Analytics
            </h2>
          </div>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Customize subject, chapter, and question count (3, 5, 10, 15, 20 questions) for targeted CBSE board exam prep!
          </p>
        </div>

        <button
          onClick={() => startQuiz()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer"
        >
          <BrainCircuit className="w-4 h-4" /> Start {questionCount}-Q Practice Quiz
        </button>
      </div>

      {/* WEAK CHAPTER IDENTIFIER BAR */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-stone-900 text-base">
              Identified Weak Chapters ({weakAreas.length})
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Flagged if Quiz Accuracy &lt; 60% or Confidence = Low
          </span>
        </div>

        {weakAreas.length === 0 ? (
          <div className="p-6 bg-emerald-50/80 border border-emerald-200 rounded-xl text-center space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-900 text-sm">Great Job! No Critical Weak Chapters Identified</h4>
            <p className="text-xs text-stone-600">Keep taking quizzes to maintain high accuracy across all subjects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {weakAreas.map(wa => {
              const subj = subjects.find(s => s.id === wa.subjectId);
              const chap = chapters.find(c => c.id === wa.chapterId);

              return (
                <div
                  key={wa.chapterId}
                  className="bg-rose-50/50 border border-rose-200 p-4 rounded-xl space-y-3 transition-colors shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        {subj && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${subj.badgeBg}`}>
                            {subj.name}
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-rose-100 text-rose-800 border border-rose-300">
                          {wa.weaknessSeverity.toUpperCase()} SEVERITY
                        </span>
                      </div>
                      <h4 className="font-extrabold text-stone-900 text-sm mt-1">
                        {wa.chapterTitle}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-rose-700">
                        {wa.accuracy}% Accuracy
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs bg-white p-2.5 rounded-lg border border-rose-200/80 text-stone-700">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" /> Actionable Revision Steps:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-stone-700 font-medium">
                      {wa.recommendedActions.map((act, idx) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      onClick={() => onOpenTab('syllabus', wa.subjectId)}
                      className="text-xs text-stone-600 hover:text-stone-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" /> Read NCERT Notes
                    </button>

                    {chap && (
                      <button
                        onClick={() => handleGenerateAiQuiz(chap)}
                        disabled={isGeneratingAiQuiz}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {isGeneratingAiQuiz ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" /> AI Practice Quiz
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ACTIVE QUIZ ENGINE INTERFACE */}
      {activeQuizQuestions ? (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          
          {/* Quiz Top Bar */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" /> Question {currentQuestionIndex + 1} of {activeQuizQuestions.length}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900 mt-0.5">
                {(() => {
                  const activeChap = chapters.find(c => c.id === activeQuizQuestions[currentQuestionIndex]?.chapterId);
                  return activeChap ? `Targeted Quiz: Ch ${activeChap.chapterNum} — ${activeChap.title}` : 'CBSE Pattern Practice Quiz';
                })()}
              </h3>
            </div>

            <button
              onClick={() => setActiveQuizQuestions(null)}
              className="text-xs text-stone-600 hover:text-stone-900 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Exit Quiz
            </button>
          </div>

          {/* Question Progress Bar */}
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / activeQuizQuestions.length) * 100}%` }}
            />
          </div>

          {/* Current Question Display */}
          {activeQuizQuestions[currentQuestionIndex] && (
            <div className="space-y-5">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                  {activeQuizQuestions[currentQuestionIndex].type.replace('_', ' ')}
                </span>
                <p className="text-sm sm:text-base font-bold text-stone-900 leading-relaxed whitespace-pre-line font-sans">
                  {activeQuizQuestions[currentQuestionIndex].question}
                </p>
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {activeQuizQuestions[currentQuestionIndex].options.map((opt, optIdx) => {
                  const hasAnsweredCurrent = userAnswers[currentQuestionIndex] !== undefined;
                  const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                  const isCorrect = activeQuizQuestions[currentQuestionIndex].correctAnswer === optIdx;

                  let optBg = 'bg-white border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-stone-800 cursor-pointer';
                  if (hasAnsweredCurrent) {
                    if (isCorrect) {
                      optBg = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optBg = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                    } else {
                      optBg = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
                    }
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs sm:text-sm ${optBg}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-stone-100 text-stone-700 font-bold flex items-center justify-center text-xs">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="font-medium whitespace-pre-line leading-snug">{opt}</span>
                      </div>

                      {hasAnsweredCurrent && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                      {hasAnsweredCurrent && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {/* Direct Instant Feedback & Explanation */}
              {userAnswers[currentQuestionIndex] !== undefined && (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3 text-xs">
                  {userAnswers[currentQuestionIndex] === activeQuizQuestions[currentQuestionIndex].correctAnswer ? (
                    <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Correct Answer! Great job.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>
                        Incorrect! Correct Answer: Option {String.fromCharCode(65 + activeQuizQuestions[currentQuestionIndex].correctAnswer)} (
                        {activeQuizQuestions[currentQuestionIndex].options[activeQuizQuestions[currentQuestionIndex].correctAnswer]})
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="font-bold text-stone-900 flex items-center gap-1 mb-1 text-xs">
                      <Sparkles className="w-4 h-4 text-emerald-600" /> Conceptual Explanation:
                    </span>
                    <p className="text-stone-700 leading-relaxed font-medium whitespace-pre-line font-sans text-xs">
                      {activeQuizQuestions[currentQuestionIndex].explanation}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-between items-center border-t border-stone-200">
                    <button
                      onClick={() => handleRequestAiExplanation(activeQuizQuestions[currentQuestionIndex])}
                      disabled={isExplaining}
                      className="text-xs text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {isExplaining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BrainCircuit className="w-3.5 h-3.5" />}
                      Ask AI Mentor for Deeper Explanation
                    </button>
                  </div>

                  {aiExplanationText && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 whitespace-pre-line mt-2 text-xs font-medium leading-relaxed font-sans">
                      <strong className="text-amber-900 block mb-1">🤖 AI Mentor Guidance:</strong>
                      {aiExplanationText}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Pagination Controls (No Submit Button) */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
                    setAiExplanationText(null);
                  }}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-stone-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-stone-800 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
                    Score: {quizScore}/{activeQuizQuestions.length} ({Object.keys(userAnswers).length}/{activeQuizQuestions.length} answered)
                  </span>
                  {Object.keys(userAnswers).length === activeQuizQuestions.length && (
                    <button
                      onClick={() => startQuiz()}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Retake
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setCurrentQuestionIndex(prev => Math.min(activeQuizQuestions.length - 1, prev + 1));
                    setAiExplanationText(null);
                  }}
                  disabled={currentQuestionIndex === activeQuizQuestions.length - 1}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-stone-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* QUIZ SELECTOR PANEL */
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
          <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" /> Select Subject, Chapter & Number of Questions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-stone-500 block mb-1 font-medium">Select Subject:</label>
              <select
                value={selectedSubjectId}
                onChange={e => {
                  setSelectedSubjectId(e.target.value);
                  setSelectedChapterId('all');
                }}
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-stone-500 block mb-1 font-medium">Select Specific Chapter:</label>
              <select
                value={selectedChapterId}
                onChange={e => setSelectedChapterId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Chapters Mix</option>
                {filteredChapters.map(c => (
                  <option key={c.id} value={c.id}>Ch {c.chapterNum}: {c.title}</option>
                ))}
              </select>
            </div>

            {/* NEW: Number of Questions Selector */}
            <div>
              <label className="text-xs text-stone-500 block mb-1 font-medium">Number of Questions in Quiz:</label>
              <select
                value={questionCount}
                onChange={e => setQuestionCount(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-xs font-extrabold rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value={3}>3 Questions (Quick Test)</option>
                <option value={5}>5 Questions (Standard)</option>
                <option value={10}>10 Questions (In-Depth)</option>
                <option value={15}>15 Questions (Mastery)</option>
                <option value={20}>20 Questions (Full Test)</option>
              </select>
            </div>
          </div>

          {/* Quick Question Count Pills */}
          <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-500">Quick Select Length:</span>
            {[3, 5, 10, 15, 20].map(cnt => (
              <button
                key={cnt}
                onClick={() => setQuestionCount(cnt)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  questionCount === cnt
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cnt} Questions
              </button>
            ))}
          </div>

          {/* Active Chapter Selected Details Banner */}
          {selectedChapterId !== 'all' ? (
            (() => {
              const chap = chapters.find(c => c.id === selectedChapterId);
              const subj = subjects.find(s => s.id === chap?.subjectId);
              const countForChap = quizQuestions.filter(q => q.chapterId === selectedChapterId).length;

              return chap ? (
                <div className="p-4 bg-emerald-50/80 border border-emerald-200/90 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        {subj && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${subj.badgeBg}`}>
                            {subj.name}
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {chap.topics.length} Key Topics Covered
                        </span>
                      </div>
                      <h4 className="font-extrabold text-stone-900 text-sm mt-1">
                        Chapter {chap.chapterNum}: {chap.title}
                      </h4>
                    </div>

                    <span className="text-xs text-emerald-800 font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
                      Will Launch {questionCount} Question Quiz
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => startQuiz(selectedChapterId, questionCount)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" /> Start {questionCount}-Question Quiz for "Ch {chap.chapterNum}: {chap.title}"
                    </button>

                    <button
                      onClick={() => handleGenerateAiQuiz(chap)}
                      disabled={isGeneratingAiQuiz}
                      className="bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {isGeneratingAiQuiz ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" /> Generating {questionCount} AI MCQs...
                        </>
                      ) : (
                        <>
                          <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" /> Generate {questionCount} Fresh AI MCQs
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : null;
            })()
          ) : (
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-stone-600 font-medium">
                Showing <strong className="text-stone-900">{questionCount} questions</strong> combined across all chapters in <strong className="text-stone-900">{subjects.find(s => s.id === selectedSubjectId)?.name || 'all subjects'}</strong>.
              </span>
              <button
                onClick={() => startQuiz(undefined, questionCount)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <Zap className="w-3.5 h-3.5" /> Start {questionCount}-Q Mix Quiz
              </button>
            </div>
          )}

          {aiError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
              {aiError}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
