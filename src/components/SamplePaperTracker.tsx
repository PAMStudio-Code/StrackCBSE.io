import React, { useState } from 'react';
import { Subject, SamplePaper } from '../types';
import { 
  FileCheck2, 
  Download, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  Search, 
  FileText,
  Award,
  Clock,
  Layers,
  HelpCircle,
  Eye
} from 'lucide-react';

interface SamplePaperTrackerProps {
  subjects: Subject[];
}

interface QuestionBankItem {
  id: string;
  subjectId: string;
  unitName?: string;
  title: string;
  category: 'Sample Question Paper (SQP)' | 'Official Question Bank' | 'Competency Practice Set' | 'Previous Year Paper';
  year: string;
  totalMarks: number;
  durationHours: string;
  description: string;
  qpUrl: string; // Question Paper URL
  msUrl?: string; // Marking Scheme / Solutions URL
  isOfficialCBSE: boolean;
}

const CBSE_RESOURCE_REPOSITORY: QuestionBankItem[] = [
  // SCIENCE (Code 086)
  {
    id: 'res-sci-1',
    subjectId: 'science',
    title: 'CBSE Official Science Sample Question Paper 2025-26',
    category: 'Sample Question Paper (SQP)',
    year: '2025-26',
    totalMarks: 80,
    durationHours: '3 Hours',
    description: 'Official CBSE Class 10 Science Sample Paper with latest 5-section exam pattern, Competency MCQs & Case Study questions.',
    qpUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/Science-SQP.pdf',
    msUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/Science-MS.pdf',
    isOfficialCBSE: true
  },
  {
    id: 'res-sci-2',
    subjectId: 'science',
    title: 'CBSE Class 10 Science Official Question Bank (Chapter-wise)',
    category: 'Official Question Bank',
    year: '2025-26',
    totalMarks: 80,
    durationHours: 'Practice Set',
    description: 'Comprehensive chapter-wise question bank published by CBSE featuring Assertion-Reason, Diagrams, & HOTS numerical problems.',
    qpUrl: 'https://cbseacademic.nic.in/qbclass10.html',
    msUrl: 'https://cbseacademic.nic.in/qbclass10.html',
    isOfficialCBSE: true
  },
  {
    id: 'res-sci-3',
    subjectId: 'science',
    title: 'CBSE Official Science Sample Question Paper 2024-25',
    category: 'Previous Year Paper',
    year: '2024-25',
    totalMarks: 80,
    durationHours: '3 Hours',
    description: 'Previous year official SQP with detailed marking scheme and solution breakdown.',
    qpUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2024_25/Science-SQP.pdf',
    msUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2024_25/Science-MS.pdf',
    isOfficialCBSE: true
  },

  // MATHEMATICS (Code 041 / 241)
  {
    id: 'res-math-1',
    subjectId: 'maths',
    title: 'CBSE Official Mathematics Standard SQP 2025-26',
    category: 'Sample Question Paper (SQP)',
    year: '2025-26',
    totalMarks: 80,
    durationHours: '3 Hours',
    description: 'Class 10 Math Standard Official SQP with step-by-step marking scheme for Geometry, Trigonometry & Algebra.',
    qpUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/MathsStandard-SQP.pdf',
    msUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/MathsStandard-MS.pdf',
    isOfficialCBSE: true
  },
  {
    id: 'res-math-2',
    subjectId: 'maths',
    title: 'CBSE Official Mathematics Basic SQP 2025-26',
    category: 'Sample Question Paper (SQP)',
    year: '2025-26',
    totalMarks: 80,
    durationHours: '3 Hours',
    description: 'Class 10 Math Basic Official SQP tailored for fundamental NCERT concept evaluation.',
    qpUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/MathsBasic-SQP.pdf',
    msUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/MathsBasic-MS.pdf',
    isOfficialCBSE: true
  },
  {
    id: 'res-math-3',
    subjectId: 'maths',
    title: 'CBSE Class 10 Mathematics Competency Based Question Bank',
    category: 'Official Question Bank',
    year: '2025-26',
    totalMarks: 80,
    durationHours: 'Practice Set',
    description: 'Official CBSE practice questions focusing on real-life application, case-study questions & statistics.',
    qpUrl: 'https://cbseacademic.nic.in/qbclass10.html',
    msUrl: 'https://cbseacademic.nic.in/qbclass10.html',
    isOfficialCBSE: true
  },

  // SOCIAL SCIENCE (Code 087)
  {
    id: 'res-sst-1',
    subjectId: 'sst',
    unitName: 'SST 087',
    title: 'CBSE Official Social Science Sample Question Paper 2025-26',
    category: 'Sample Question Paper (SQP)',
    year: '2025-26',
    totalMarks: 80,
    durationHours: '3 Hours',
    description: 'Official SST SQP covering History, Geography, Civics, Economics & compulsory 5-mark Map Work.',
    qpUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/SocialScience-SQP.pdf',
    msUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/SocialScience-MS.pdf',
    isOfficialCBSE: true
  },
  {
    id: 'res-sst-2',
    subjectId: 'sst',
    title: 'CBSE Official Social Science Question Bank & Map Work Practice',
    category: 'Official Question Bank',
    year: '2025-26',
    totalMarks: 80,
    durationHours: 'Practice Set',
    description: 'Unit-wise SST question bank with source-based questions, picture analysis & map pointers.',
    qpUrl: 'https://cbseacademic.nic.in/qbclass10.html',
    msUrl: 'https://cbseacademic.nic.in/qbclass10.html',
    isOfficialCBSE: true
  },

  // ENGLISH LANGUAGE & LITERATURE (Code 184)
  {
    id: 'res-eng-1',
    subjectId: 'english',
    title: 'CBSE Official English Language & Literature SQP 2025-26',
    category: 'Sample Question Paper (SQP)',
    year: '2025-26',
    totalMarks: 80,
    durationHours: '3 Hours',
    description: 'Official English SQP with Reading Comprehension passages, Analytical Paragraph templates & Literature extracts.',
    qpUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/EnglishLanguage-SQP.pdf',
    msUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/EnglishLanguage-MS.pdf',
    isOfficialCBSE: true
  },
  {
    id: 'res-eng-2',
    subjectId: 'english',
    title: 'CBSE Class 10 English Competency Question Bank',
    category: 'Official Question Bank',
    year: '2025-26',
    totalMarks: 80,
    durationHours: 'Practice Set',
    description: 'Grammar practice sets, reported speech questions, and formal writing skill samples.',
    qpUrl: 'https://cbseacademic.nic.in/qbclass10.html',
    msUrl: 'https://cbseacademic.nic.in/qbclass10.html',
    isOfficialCBSE: true
  },

  // HINDI COURSE A & B (Code 002 / 085)
  {
    id: 'res-hin-1',
    subjectId: 'hindi',
    title: 'CBSE Official Hindi Course A SQP 2025-26',
    category: 'Sample Question Paper (SQP)',
    year: '2025-26',
    totalMarks: 80,
    durationHours: '3 Hours',
    description: 'Official Hindi Course A sample paper with Unseen Passages, Grammar (व्याकरण), and Textbook Long Questions.',
    qpUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/HindiA-SQP.pdf',
    msUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/HindiA-MS.pdf',
    isOfficialCBSE: true
  },
  {
    id: 'res-hin-2',
    subjectId: 'hindi',
    title: 'CBSE Official Hindi Course B SQP 2025-26',
    category: 'Sample Question Paper (SQP)',
    year: '2025-26',
    totalMarks: 80,
    durationHours: '3 Hours',
    description: 'Official Hindi Course B sample paper with complete solutions and marking key.',
    qpUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/HindiB-SQP.pdf',
    msUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/HindiB-MS.pdf',
    isOfficialCBSE: true
  },

  // ARTIFICIAL INTELLIGENCE (Code 417) & IT (Code 402)
  {
    id: 'res-cs-1',
    subjectId: 'cs',
    title: 'CBSE Official Artificial Intelligence (AI Code 417) SQP 2025-26',
    category: 'Sample Question Paper (SQP)',
    year: '2025-26',
    totalMarks: 50,
    durationHours: '2 Hours',
    description: 'Official CBSE SQP for Artificial Intelligence (Code 417) covering Employability Skills, AI Project Cycle, CV & NLP.',
    qpUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/AI-SQP.pdf',
    msUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/AI-MS.pdf',
    isOfficialCBSE: true
  },
  {
    id: 'res-cs-2',
    subjectId: 'cs',
    title: 'CBSE Official Information Technology (IT Code 402) SQP 2025-26',
    category: 'Sample Question Paper (SQP)',
    year: '2025-26',
    totalMarks: 50,
    durationHours: '2 Hours',
    description: 'Official SQP for Information Technology (Code 402) with Digital Documentation, Spreadsheet & DBMS questions.',
    qpUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/IT-SQP.pdf',
    msUrl: 'https://cbseacademic.nic.in/web_material/SQP/CLASSX_2025_26/IT-MS.pdf',
    isOfficialCBSE: true
  }
];

export const SamplePaperTracker: React.FC<SamplePaperTrackerProps> = ({ subjects }) => {
  const [selectedSubjTab, setSelectedSubjTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Solved Papers Log State
  const [solvedLogs, setSolvedLogs] = useState<SamplePaper[]>([
    {
      id: 'sp-1',
      subjectId: 'science',
      title: 'CBSE Official Science SQP 2025-26',
      year: '2025-26',
      totalMarks: 80,
      marksObtained: 74,
      timeTakenMinutes: 165,
      status: 'completed',
      dateCompleted: '2026-07-20'
    },
    {
      id: 'sp-2',
      subjectId: 'maths',
      title: 'CBSE Official Math Standard SQP 2025-26',
      year: '2025-26',
      totalMarks: 80,
      marksObtained: 70,
      timeTakenMinutes: 175,
      status: 'completed',
      dateCompleted: '2026-07-25'
    }
  ]);

  const [logTitle, setLogTitle] = useState('');
  const [logSubj, setLogSubj] = useState<string>('science');
  const [logScore, setLogScore] = useState<number>(75);

  const handleLogPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTitle.trim()) return;

    const maxMarks = logSubj === 'cs' ? 50 : 80;

    const newLog: SamplePaper = {
      id: 'sp-' + Date.now(),
      subjectId: logSubj as any,
      title: logTitle.trim(),
      year: '2025-26',
      totalMarks: maxMarks,
      marksObtained: Math.min(logScore, maxMarks),
      status: 'completed',
      dateCompleted: new Date().toISOString().split('T')[0]
    };

    setSolvedLogs(prev => [newLog, ...prev]);
    setLogTitle('');
  };

  // Filter resources
  let filteredResources = CBSE_RESOURCE_REPOSITORY;
  if (selectedSubjTab !== 'all') {
    filteredResources = filteredResources.filter(r => r.subjectId === selectedSubjTab);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredResources = filteredResources.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  }

  const completedCount = solvedLogs.filter(p => p.status === 'completed').length;
  const avgMarks = completedCount > 0
    ? Math.round(solvedLogs.filter(p => p.status === 'completed').reduce((acc, p) => acc + (p.marksObtained || 0), 0) / completedCount)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
            </span>
            <h2 className="text-xl font-extrabold text-stone-900">
              CBSE Class 10 Free Sample Papers & Official Question Banks
            </h2>
          </div>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Free direct download of official CBSE Sample Papers (SQPs), Solutions & Marking Schemes, and Chapter Question Banks for every Class 10 subject!
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-stone-500 block uppercase font-bold">Solved Papers</span>
            <span className="text-base font-extrabold text-emerald-800">{completedCount} Papers</span>
          </div>
          <div className="bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-stone-500 block uppercase font-bold">Avg Score</span>
            <span className="text-base font-extrabold text-amber-800">{avgMarks} / 80</span>
          </div>
        </div>
      </div>

      {/* Subject Filter Tabs & Search Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedSubjTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSubjTab === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              All Subjects
            </button>
            {subjects.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSubjTab(s.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSubjTab === s.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {s.name} ({s.code})
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search sample paper or QB..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* MAIN SAMPLE PAPERS & QUESTION BANKS REPOSITORY GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" /> CBSE Official Resources ({filteredResources.length})
          </h3>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Free Official Downloads
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map(item => {
            const subj = subjects.find(s => s.id === item.subjectId);

            return (
              <div
                key={item.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-5 space-y-3 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {subj && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${subj.badgeBg}`}>
                          {subj.name}
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        {item.category}
                      </span>
                    </div>

                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.totalMarks} Marks
                    </span>
                  </div>

                  <h4 className="font-extrabold text-stone-900 text-sm leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                {/* Direct Button Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" /> {item.durationHours}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.msUrl && (
                      <a
                        href={item.msUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-colors border border-stone-200"
                        title="Open Official Marking Scheme & Answer Key"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-600" /> Marking Scheme
                      </a>
                    )}

                    <a
                      href={item.qpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                      title="Download Official Question Paper PDF"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SELF-ASSESSMENT SCORE LOGGER */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" /> Self-Assessment: Log Completed SQP Marks
        </h3>

        <form onSubmit={handleLogPaper} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            value={logTitle}
            onChange={e => setLogTitle(e.target.value)}
            placeholder="Sample Paper Title (e.g. Science SQP Set 1)..."
            className="sm:col-span-2 bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
          />

          <select
            value={logSubj}
            onChange={e => setLogSubj(e.target.value)}
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max={logSubj === 'cs' ? 50 : 80}
              value={logScore}
              onChange={e => setLogScore(Number(e.target.value))}
              placeholder="Marks Obtained"
              className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!logTitle.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Log Score
            </button>
          </div>
        </form>

        {/* Logged Papers History */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <span className="text-xs font-bold text-stone-500 block">Logged Practice History ({solvedLogs.length})</span>
          {solvedLogs.map(paper => {
            const subj = subjects.find(s => s.id === paper.subjectId);
            return (
              <div
                key={paper.id}
                className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {subj && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${subj.badgeBg}`}>
                        {subj.name}
                      </span>
                    )}
                    <span className="font-extrabold text-stone-900">{paper.title}</span>
                  </div>
                  <span className="text-[10px] text-stone-500">Logged on {paper.dateCompleted}</span>
                </div>

                <span className="text-sm font-extrabold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                  {paper.marksObtained} / {paper.totalMarks}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
