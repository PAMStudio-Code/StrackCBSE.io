import { Subject, Chapter, StudentProfile } from '../types';

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: "Class 10 Scholar",
  schoolName: "CBSE Affiliated School",
  targetBoardYear: "2026 - 2027",
  boardExamDate: "2027-02-15",
  dailyStudyGoalMinutes: 180, // 3 hours per day
};

export const SUBJECTS: Subject[] = [
  {
    id: 'science',
    name: 'Science',
    code: '086',
    color: 'emerald',
    badgeBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    borderColor: 'border-emerald-200',
    iconName: 'FlaskConical',
    totalMarks: 80,
    unitsCount: 5,
  },
  {
    id: 'maths',
    name: 'Mathematics',
    code: '041 / 241',
    color: 'blue',
    badgeBg: 'bg-blue-50 text-blue-800 border border-blue-200/80',
    borderColor: 'border-blue-200',
    iconName: 'Calculator',
    totalMarks: 80,
    unitsCount: 7,
  },
  {
    id: 'sst',
    name: 'Social Science',
    code: '087',
    color: 'amber',
    badgeBg: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    borderColor: 'border-amber-200',
    iconName: 'Globe2',
    totalMarks: 80,
    unitsCount: 4,
  },
  {
    id: 'english',
    name: 'English Language & Lit',
    code: '184',
    color: 'purple',
    badgeBg: 'bg-purple-50 text-purple-800 border border-purple-200/80',
    borderColor: 'border-purple-200',
    iconName: 'BookOpen',
    totalMarks: 80,
    unitsCount: 4,
  },
  {
    id: 'hindi',
    name: 'Hindi Course A',
    code: '002',
    color: 'rose',
    badgeBg: 'bg-rose-50 text-rose-800 border border-rose-200/80',
    borderColor: 'border-rose-200',
    iconName: 'Languages',
    totalMarks: 80,
    unitsCount: 4,
  },
  {
    id: 'cs',
    name: 'Artificial Intelligence (AI)',
    code: '417',
    color: 'cyan',
    badgeBg: 'bg-cyan-50 text-cyan-800 border border-cyan-200/80',
    borderColor: 'border-cyan-200',
    iconName: 'Bot',
    totalMarks: 50,
    unitsCount: 5,
  },
];

export const INITIAL_CHAPTERS: Chapter[] = [
  // ================= SCIENCE (80 Marks) =================
  // Unit I: Chemical Substances - Nature and Behaviour (25 Marks)
  {
    id: 'sci-ch1',
    subjectId: 'science',
    unitName: 'Unit I: Chemical Substances (25 Marks)',
    chapterNum: 1,
    title: 'Chemical Reactions and Equations',
    weightageMarks: 6,
    completed: true, // Marked completed (~30%+ overall)
    confidence: 'high',
    lastStudiedDate: '2026-07-10',
    keyFormulae: [
      'Combination: A + B -> AB',
      'Decomposition: AB -> A + B',
      'Displacement: Zn + CuSO4 -> ZnSO4 + Cu',
      'Double Displacement: Na2SO4 + BaCl2 -> BaSO4 + 2NaCl',
      'Redox: Oxidation (Gain of O / Loss of H), Reduction (Loss of O / Gain of H)'
    ],
    topics: [
      { id: 'sci-1-1', chapterId: 'sci-ch1', title: 'Chemical Equation Balancing', completed: true, ncertRef: 'NCERT Pg 2-5' },
      { id: 'sci-1-2', chapterId: 'sci-ch1', title: 'Types of Chemical Reactions (Combination, Decomposition)', completed: true, ncertRef: 'NCERT Pg 6-11' },
      { id: 'sci-1-3', chapterId: 'sci-ch1', title: 'Displacement & Double Displacement Reactions', completed: true, ncertRef: 'NCERT Pg 11-13' },
      { id: 'sci-1-4', chapterId: 'sci-ch1', title: 'Oxidation, Reduction, Corrosion & Rancidity', completed: true, ncertRef: 'NCERT Pg 13-15' },
    ]
  },
  {
    id: 'sci-ch2',
    subjectId: 'science',
    unitName: 'Unit I: Chemical Substances (25 Marks)',
    chapterNum: 2,
    title: 'Acids, Bases and Salts',
    weightageMarks: 6,
    completed: true,
    confidence: 'high',
    lastStudiedDate: '2026-07-15',
    keyFormulae: [
      'pH scale: pH < 7 Acidic, pH = 7 Neutral, pH > 7 Basic',
      'Plaster of Paris: CaSO4.1/2 H2O + 1.5 H2O -> CaSO4.2H2O (Gypsum)',
      'Bleaching Powder: Ca(OH)2 + Cl2 -> CaOCl2 + H2O',
      'Washing Soda: Na2CO3.10H2O',
      'Baking Soda: NaHCO3'
    ],
    topics: [
      { id: 'sci-2-1', chapterId: 'sci-ch2', title: 'Chemical Properties of Acids & Bases', completed: true, ncertRef: 'NCERT Pg 18-24' },
      { id: 'sci-2-2', chapterId: 'sci-ch2', title: 'pH Scale & Everyday Importance of pH', completed: true, ncertRef: 'NCERT Pg 25-27' },
      { id: 'sci-2-3', chapterId: 'sci-ch2', title: 'Salts: Sodium Hydroxide, Bleaching Powder, Baking Soda, Washing Soda', completed: true, ncertRef: 'NCERT Pg 28-32' },
      { id: 'sci-2-4', chapterId: 'sci-ch2', title: 'Plaster of Paris & Water of Crystallisation', completed: true, ncertRef: 'NCERT Pg 32-33' },
    ]
  },
  {
    id: 'sci-ch3',
    subjectId: 'science',
    unitName: 'Unit I: Chemical Substances (25 Marks)',
    chapterNum: 3,
    title: 'Metals and Non-Metals',
    weightageMarks: 7,
    completed: false,
    confidence: 'medium',
    keyFormulae: [
      'Reactivity Series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au',
      'Thermite Reaction: Fe2O3 + 2Al -> 2Fe + Al2O3 + Heat',
      'Ionic Bond Formation (e.g. NaCl, MgCl2)'
    ],
    topics: [
      { id: 'sci-3-1', chapterId: 'sci-ch3', title: 'Physical & Chemical Properties of Metals & Non-metals', completed: true, ncertRef: 'NCERT Pg 37-45' },
      { id: 'sci-3-2', chapterId: 'sci-ch3', title: 'Ionic Compounds & Properties', completed: false, ncertRef: 'NCERT Pg 46-48' },
      { id: 'sci-3-3', chapterId: 'sci-ch3', title: 'Metallurgy: Extraction of Metals (Roasting & Calcination)', completed: false, ncertRef: 'NCERT Pg 49-54' },
      { id: 'sci-3-4', chapterId: 'sci-ch3', title: 'Corrosion Prevention & Alloys', completed: false, ncertRef: 'NCERT Pg 54-55' },
    ]
  },
  {
    id: 'sci-ch4',
    subjectId: 'science',
    unitName: 'Unit I: Chemical Substances (25 Marks)',
    chapterNum: 4,
    title: 'Carbon and Its Compounds',
    weightageMarks: 6,
    completed: false,
    confidence: 'low', // Needs focus!
    keyFormulae: [
      'Alkane: C_n H_{2n+2}',
      'Alkene: C_n H_{2n}',
      'Alkyne: C_n H_{2n-2}',
      'Esterification: CH3COOH + C2H5OH -> CH3COOC2H5 + H2O',
      'Saponification: Ester + NaOH -> Soap + Alcohol'
    ],
    topics: [
      { id: 'sci-4-1', chapterId: 'sci-ch4', title: 'Covalent Bonding & Versatile Nature of Carbon', completed: false, ncertRef: 'NCERT Pg 58-63' },
      { id: 'sci-4-2', chapterId: 'sci-ch4', title: 'Homologous Series & IUPAC Nomenclature', completed: false, ncertRef: 'NCERT Pg 64-68' },
      { id: 'sci-4-3', chapterId: 'sci-ch4', title: 'Chemical Properties (Combustion, Oxidation, Addition, Substitution)', completed: false, ncertRef: 'NCERT Pg 69-72' },
      { id: 'sci-4-4', chapterId: 'sci-ch4', title: 'Ethanol, Ethanoic Acid, Soaps & Detergents Micelle Action', completed: false, ncertRef: 'NCERT Pg 73-77' },
    ]
  },

  // Unit II: World of Living (25 Marks)
  {
    id: 'sci-ch5',
    subjectId: 'science',
    unitName: 'Unit II: World of Living (25 Marks)',
    chapterNum: 5,
    title: 'Life Processes',
    weightageMarks: 9,
    completed: true,
    confidence: 'high',
    lastStudiedDate: '2026-07-18',
    keyFormulae: [
      'Photosynthesis: 6CO2 + 12H2O -> C6H12O6 + 6O2 + 6H2O',
      'Human Digestive System Pathway',
      'Respiration: Glycolysis (Cytoplasm) -> Pyruvate -> Mitochondria (CO2 + H2O + ATP)',
      'Human Excretory System: Nephron filtration'
    ],
    topics: [
      { id: 'sci-5-1', chapterId: 'sci-ch5', title: 'Nutrition in Plants & Animals (Amoeba, Human Digestive System)', completed: true, ncertRef: 'NCERT Pg 93-100' },
      { id: 'sci-5-2', chapterId: 'sci-ch5', title: 'Respiration (Aerobic vs Anaerobic, Human Respiratory System)', completed: true, ncertRef: 'NCERT Pg 101-105' },
      { id: 'sci-5-3', chapterId: 'sci-ch5', title: 'Transportation in Humans (Heart & Blood Vessels) & Plants (Xylem & Phloem)', completed: true, ncertRef: 'NCERT Pg 105-110' },
      { id: 'sci-5-4', chapterId: 'sci-ch5', title: 'Excretion in Humans (Nephron structure) & Plants', completed: true, ncertRef: 'NCERT Pg 110-112' },
    ]
  },
  {
    id: 'sci-ch6',
    subjectId: 'science',
    unitName: 'Unit II: World of Living (25 Marks)',
    chapterNum: 6,
    title: 'Control and Coordination',
    weightageMarks: 6,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'sci-6-1', chapterId: 'sci-ch6', title: 'Nervous System, Reflex Arc & Human Brain Structure', completed: false, ncertRef: 'NCERT Pg 115-119' },
      { id: 'sci-6-2', chapterId: 'sci-ch6', title: 'Coordination in Plants (Tropism & Plant Hormones: Auxin, Gibberellin, Cytokinin, ABA)', completed: false, ncertRef: 'NCERT Pg 119-122' },
      { id: 'sci-6-3', chapterId: 'sci-ch6', title: 'Hormones in Animals (Thyroxine, Insulin, Adrenaline, Growth Hormone)', completed: false, ncertRef: 'NCERT Pg 123-126' },
    ]
  },
  {
    id: 'sci-ch7',
    subjectId: 'science',
    unitName: 'Unit II: World of Living (25 Marks)',
    chapterNum: 7,
    title: 'How do Organisms Reproduce?',
    weightageMarks: 6,
    completed: false,
    confidence: 'low',
    topics: [
      { id: 'sci-7-1', chapterId: 'sci-ch7', title: 'Asexual Reproduction (Fission, Fragmentation, Regeneration, Budding, Vegetative Prop)', completed: false, ncertRef: 'NCERT Pg 128-133' },
      { id: 'sci-7-2', chapterId: 'sci-ch7', title: 'Sexual Reproduction in Flowering Plants (Flower Parts & Pollination)', completed: false, ncertRef: 'NCERT Pg 133-136' },
      { id: 'sci-7-3', chapterId: 'sci-ch7', title: 'Human Reproductive System (Male & Female)', completed: false, ncertRef: 'NCERT Pg 137-140' },
      { id: 'sci-7-4', chapterId: 'sci-ch7', title: 'Reproductive Health & Contraceptive Methods', completed: false, ncertRef: 'NCERT Pg 140-141' },
    ]
  },
  {
    id: 'sci-ch8',
    subjectId: 'science',
    unitName: 'Unit II: World of Living (25 Marks)',
    chapterNum: 8,
    title: 'Heredity and Evolution',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    keyFormulae: [
      'Monohybrid Cross Phenotypic Ratio = 3 : 1',
      'Monohybrid Cross Genotypic Ratio = 1 : 2 : 1',
      'Dihybrid Cross Ratio = 9 : 3 : 3 : 1'
    ],
    topics: [
      { id: 'sci-8-1', chapterId: 'sci-ch8', title: 'Accumulation of Variation & Mendel Contribution', completed: false, ncertRef: 'NCERT Pg 142-145' },
      { id: 'sci-8-2', chapterId: 'sci-ch8', title: 'Monohybrid & Dihybrid Cross Laws of Inheritance', completed: false, ncertRef: 'NCERT Pg 145-147' },
      { id: 'sci-8-3', chapterId: 'sci-ch8', title: 'Sex Determination in Humans (XX & XY)', completed: false, ncertRef: 'NCERT Pg 147-148' },
    ]
  },

  // Unit III: Natural Phenomena (12 Marks)
  {
    id: 'sci-ch9',
    subjectId: 'science',
    unitName: 'Unit III: Natural Phenomena (12 Marks)',
    chapterNum: 9,
    title: 'Light - Reflection and Refraction',
    weightageMarks: 7,
    completed: false,
    confidence: 'medium',
    keyFormulae: [
      'Mirror Formula: 1/f = 1/v + 1/u',
      'Lens Formula: 1/f = 1/v - 1/u',
      'Magnification m = -v/u (mirrors) = v/u (lenses)',
      'Snell Law: n = sin(i) / sin(r)',
      'Power of Lens P = 1/f (in meters) Dioptres'
    ],
    topics: [
      { id: 'sci-9-1', chapterId: 'sci-ch9', title: 'Spherical Mirrors, Ray Diagrams & Mirror Formula', completed: false, ncertRef: 'NCERT Pg 160-171' },
      { id: 'sci-9-2', chapterId: 'sci-ch9', title: 'Refraction of Light & Refractive Index', completed: false, ncertRef: 'NCERT Pg 171-175' },
      { id: 'sci-9-3', chapterId: 'sci-ch9', title: 'Refraction through Lenses, Ray Diagrams & Lens Formula', completed: false, ncertRef: 'NCERT Pg 176-183' },
      { id: 'sci-9-4', chapterId: 'sci-ch9', title: 'Power of Lens & Numericals', completed: false, ncertRef: 'NCERT Pg 183-184' },
    ]
  },
  {
    id: 'sci-ch10',
    subjectId: 'science',
    unitName: 'Unit III: Natural Phenomena (12 Marks)',
    chapterNum: 10,
    title: 'Human Eye and Colourful World',
    weightageMarks: 5,
    completed: false,
    confidence: 'high',
    topics: [
      { id: 'sci-10-1', chapterId: 'sci-ch10', title: 'Structure of Human Eye & Accommodation', completed: false, ncertRef: 'NCERT Pg 187-189' },
      { id: 'sci-10-2', chapterId: 'sci-ch10', title: 'Defects of Vision (Myopia, Hypermetropia, Presbyopia) & Correction', completed: false, ncertRef: 'NCERT Pg 189-192' },
      { id: 'sci-10-3', chapterId: 'sci-ch10', title: 'Refraction through Prism, Dispersion & Rainbow Formation', completed: false, ncertRef: 'NCERT Pg 192-194' },
      { id: 'sci-10-4', chapterId: 'sci-ch10', title: 'Atmospheric Refraction & Scattering of Light (Tyndall Effect, Blue Sky, Sunsets)', completed: false, ncertRef: 'NCERT Pg 194-197' },
    ]
  },

  // Unit IV: Effects of Current (13 Marks)
  {
    id: 'sci-ch11',
    subjectId: 'science',
    unitName: 'Unit IV: Effects of Current (13 Marks)',
    chapterNum: 11,
    title: 'Electricity',
    weightageMarks: 7,
    completed: true,
    confidence: 'high',
    lastStudiedDate: '2026-07-20',
    keyFormulae: [
      'Current I = Q / t',
      'Ohm Law V = I * R',
      'Resistance R = rho * (L / A)',
      'Series Resistance R_eq = R1 + R2 + R3',
      'Parallel Resistance 1/R_eq = 1/R1 + 1/R2 + 1/R3',
      'Joule Heating H = I^2 * R * t',
      'Power P = V*I = I^2*R = V^2/R'
    ],
    topics: [
      { id: 'sci-11-1', chapterId: 'sci-ch11', title: 'Electric Current, Circuit & Potential Difference', completed: true, ncertRef: 'NCERT Pg 200-203' },
      { id: 'sci-11-2', chapterId: 'sci-ch11', title: 'Ohm Law, Resistance & Factors affecting Resistance', completed: true, ncertRef: 'NCERT Pg 203-208' },
      { id: 'sci-11-3', chapterId: 'sci-ch11', title: 'Resistors in Series & Parallel Combination Numericals', completed: true, ncertRef: 'NCERT Pg 209-215' },
      { id: 'sci-11-4', chapterId: 'sci-ch11', title: 'Heating Effect of Current & Electric Power', completed: true, ncertRef: 'NCERT Pg 216-219' },
    ]
  },
  {
    id: 'sci-ch12',
    subjectId: 'science',
    unitName: 'Unit IV: Effects of Current (13 Marks)',
    chapterNum: 12,
    title: 'Magnetic Effects of Electric Current',
    weightageMarks: 6,
    completed: false,
    confidence: 'medium',
    keyFormulae: [
      'Right Hand Thumb Rule (Field line direction)',
      'Fleming Left Hand Rule (Motor / Force on Current carrying Conductor)',
      'Solenoid Field Pattern = Bar Magnet'
    ],
    topics: [
      { id: 'sci-12-1', chapterId: 'sci-ch12', title: 'Magnetic Field & Field Lines Properties', completed: false, ncertRef: 'NCERT Pg 223-225' },
      { id: 'sci-12-2', chapterId: 'sci-ch12', title: 'Field due to Current carrying Straight Wire, Loop & Solenoid', completed: false, ncertRef: 'NCERT Pg 226-230' },
      { id: 'sci-12-3', chapterId: 'sci-ch12', title: 'Force on Current Carrying Conductor & Fleming Left Hand Rule', completed: false, ncertRef: 'NCERT Pg 230-233' },
      { id: 'sci-12-4', chapterId: 'sci-ch12', title: 'Domestic Electric Circuits (Live, Neutral, Earth, Fuse, Overloading)', completed: false, ncertRef: 'NCERT Pg 236-238' },
    ]
  },
  {
    id: 'sci-ch13',
    subjectId: 'science',
    unitName: 'Unit V: Natural Resources (5 Marks)',
    chapterNum: 13,
    title: 'Our Environment',
    weightageMarks: 5,
    completed: true,
    confidence: 'high',
    keyFormulae: [
      '10% Law of Energy Transfer (Lindeman)',
      'Ozone Depletion by CFCs (Chlorofluorocarbons)'
    ],
    topics: [
      { id: 'sci-13-1', chapterId: 'sci-ch13', title: 'Ecosystem & Food Chain / Food Web', completed: true, ncertRef: 'NCERT Pg 256-261' },
      { id: 'sci-13-2', chapterId: 'sci-ch13', title: 'Ozone Layer Depletion & Garbage Management', completed: true, ncertRef: 'NCERT Pg 261-264' },
    ]
  },

  // ================= MATHEMATICS (80 Marks) =================
  // Unit I: Number Systems (6 Marks)
  {
    id: 'math-ch1',
    subjectId: 'maths',
    unitName: 'Unit I: Number Systems (6 Marks)',
    chapterNum: 1,
    title: 'Real Numbers',
    weightageMarks: 6,
    completed: true,
    confidence: 'high',
    lastStudiedDate: '2026-07-02',
    keyFormulae: [
      'Fundamental Theorem of Arithmetic (Unique Prime Factorisation)',
      'HCF(a,b) * LCM(a,b) = a * b',
      'Proof of irrationality (e.g. Prove sqrt(2) or 3 + 2sqrt(5) is irrational)'
    ],
    topics: [
      { id: 'm-1-1', chapterId: 'math-ch1', title: 'Fundamental Theorem of Arithmetic & Prime Factorisation', completed: true, ncertRef: 'NCERT Pg 7-11' },
      { id: 'm-1-2', chapterId: 'math-ch1', title: 'Proving Irrationality of sqrt(2), sqrt(3), sqrt(5)', completed: true, ncertRef: 'NCERT Pg 12-15' },
    ]
  },

  // Unit II: Algebra (20 Marks)
  {
    id: 'math-ch2',
    subjectId: 'maths',
    unitName: 'Unit II: Algebra (20 Marks)',
    chapterNum: 2,
    title: 'Polynomials',
    weightageMarks: 4,
    completed: true,
    confidence: 'high',
    keyFormulae: [
      'Quadratic polynomial ax^2 + bx + c',
      'Sum of zeroes (alpha + beta) = -b / a',
      'Product of zeroes (alpha * beta) = c / a'
    ],
    topics: [
      { id: 'm-2-1', chapterId: 'math-ch2', title: 'Geometrical Meaning of Zeroes of Polynomial', completed: true, ncertRef: 'NCERT Pg 21-27' },
      { id: 'm-2-2', chapterId: 'math-ch2', title: 'Relationship between Zeroes and Coefficients of Quadratic Polynomial', completed: true, ncertRef: 'NCERT Pg 28-33' },
    ]
  },
  {
    id: 'math-ch3',
    subjectId: 'maths',
    unitName: 'Unit II: Algebra (20 Marks)',
    chapterNum: 3,
    title: 'Pair of Linear Equations in Two Variables',
    weightageMarks: 6,
    completed: true,
    confidence: 'medium',
    keyFormulae: [
      'Intersecting (Unique sol): a1/a2 != b1/b2',
      'Coincident (Infinitely many): a1/a2 = b1/b2 = c1/c2',
      'Parallel (No solution): a1/a2 = b1/b2 != c1/c2',
      'Substitution & Elimination Methods'
    ],
    topics: [
      { id: 'm-3-1', chapterId: 'math-ch3', title: 'Graphical Method & Consistency Conditions', completed: true, ncertRef: 'NCERT Pg 38-46' },
      { id: 'm-3-2', chapterId: 'math-ch3', title: 'Substitution Method for Solving Linear Equations', completed: true, ncertRef: 'NCERT Pg 47-52' },
      { id: 'm-3-3', chapterId: 'math-ch3', title: 'Elimination Method & Word Problems', completed: true, ncertRef: 'NCERT Pg 53-58' },
    ]
  },
  {
    id: 'math-ch4',
    subjectId: 'maths',
    unitName: 'Unit II: Algebra (20 Marks)',
    chapterNum: 4,
    title: 'Quadratic Equations',
    weightageMarks: 5,
    completed: false,
    confidence: 'low',
    keyFormulae: [
      'Standard Form: ax^2 + bx + c = 0',
      'Quadratic Formula x = (-b +/- sqrt(b^2 - 4ac)) / (2a)',
      'Discriminant D = b^2 - 4ac',
      'D > 0: Two distinct real roots; D = 0: Two equal real roots; D < 0: No real roots'
    ],
    topics: [
      { id: 'm-4-1', chapterId: 'math-ch4', title: 'Standard Form & Factorisation Method', completed: true, ncertRef: 'NCERT Pg 70-76' },
      { id: 'm-4-2', chapterId: 'math-ch4', title: 'Quadratic Formula Method & Discriminant Analysis', completed: false, ncertRef: 'NCERT Pg 77-88' },
      { id: 'm-4-3', chapterId: 'math-ch4', title: 'Word Problems on Speed, Time, Work & Geometry', completed: false, ncertRef: 'NCERT Pg 88-92' },
    ]
  },
  {
    id: 'math-ch5',
    subjectId: 'maths',
    unitName: 'Unit II: Algebra (20 Marks)',
    chapterNum: 5,
    title: 'Arithmetic Progressions (AP)',
    weightageMarks: 5,
    completed: false,
    confidence: 'medium',
    keyFormulae: [
      'nth term a_n = a + (n - 1)d',
      'Sum of n terms S_n = (n / 2) * [2a + (n - 1)d]',
      'Alternative Sum S_n = (n / 2) * [a + l]'
    ],
    topics: [
      { id: 'm-5-1', chapterId: 'math-ch5', title: 'Introduction to AP & nth Term Formula', completed: false, ncertRef: 'NCERT Pg 95-106' },
      { id: 'm-5-2', chapterId: 'math-ch5', title: 'Sum of First n Terms of an AP & Application Problems', completed: false, ncertRef: 'NCERT Pg 107-118' },
    ]
  },

  // Unit III: Coordinate Geometry (6 Marks)
  {
    id: 'math-ch6',
    subjectId: 'maths',
    unitName: 'Unit III: Coordinate Geometry (6 Marks)',
    chapterNum: 6,
    title: 'Coordinate Geometry',
    weightageMarks: 6,
    completed: true,
    confidence: 'high',
    keyFormulae: [
      'Distance Formula: d = sqrt((x2 - x1)^2 + (y2 - y1)^2)',
      'Section Formula: ((m1*x2 + m2*x1)/(m1+m2), (m1*y2 + m2*y1)/(m1+m2))',
      'Midpoint Formula: ((x1 + x2)/2, (y1 + y2)/2)'
    ],
    topics: [
      { id: 'm-6-1', chapterId: 'math-ch6', title: 'Distance Formula & Applications (Collinear, Equidistant)', completed: true, ncertRef: 'NCERT Pg 155-162' },
      { id: 'm-6-2', chapterId: 'math-ch6', title: 'Section Formula & Centroid / Midpoint Problems', completed: true, ncertRef: 'NCERT Pg 162-171' },
    ]
  },

  // Unit IV: Geometry (15 Marks)
  {
    id: 'math-ch7',
    subjectId: 'maths',
    unitName: 'Unit IV: Geometry (15 Marks)',
    chapterNum: 7,
    title: 'Triangles',
    weightageMarks: 8,
    completed: false,
    confidence: 'low',
    keyFormulae: [
      'Basic Proportionality Theorem (Thales Theorem BPT): DE || BC => AD/DB = AE/EC',
      'Converse of BPT',
      'Criteria for Similarity: AAA, SAS, SSS'
    ],
    topics: [
      { id: 'm-7-1', chapterId: 'math-ch7', title: 'Similar Figures & Basic Proportionality Theorem (BPT Proof)', completed: false, ncertRef: 'NCERT Pg 119-129' },
      { id: 'm-7-2', chapterId: 'math-ch7', title: 'Criteria for Similarity of Triangles (AAA, SSS, SAS)', completed: false, ncertRef: 'NCERT Pg 129-142' },
    ]
  },
  {
    id: 'math-ch8',
    subjectId: 'maths',
    unitName: 'Unit IV: Geometry (15 Marks)',
    chapterNum: 8,
    title: 'Circles',
    weightageMarks: 7,
    completed: false,
    confidence: 'medium',
    keyFormulae: [
      'Theorem 10.1: Tangent at any point is perpendicular to radius at point of contact',
      'Theorem 10.2: Lengths of tangents drawn from external point to circle are equal'
    ],
    topics: [
      { id: 'm-8-1', chapterId: 'math-ch8', title: 'Tangent to a Circle & Perpendicularity Theorem', completed: false, ncertRef: 'NCERT Pg 206-209' },
      { id: 'm-8-2', chapterId: 'math-ch8', title: 'Number of Tangents from a Point & Equality of Tangent Lengths Proofs', completed: false, ncertRef: 'NCERT Pg 209-215' },
    ]
  },

  // Unit V: Trigonometry (12 Marks)
  {
    id: 'math-ch9',
    subjectId: 'maths',
    unitName: 'Unit V: Trigonometry (12 Marks)',
    chapterNum: 9,
    title: 'Introduction to Trigonometry',
    weightageMarks: 7,
    completed: false,
    confidence: 'low',
    keyFormulae: [
      'sin theta = P/H, cos theta = B/H, tan theta = P/B',
      'sin^2 theta + cos^2 theta = 1',
      '1 + tan^2 theta = sec^2 theta',
      '1 + cot^2 theta = cosec^2 theta',
      'Standard Values: sin 30 = 1/2, sin 45 = 1/sqrt(2), sin 60 = sqrt(3)/2'
    ],
    topics: [
      { id: 'm-9-1', chapterId: 'math-ch9', title: 'Trigonometric Ratios (sin, cos, tan, cosec, sec, cot)', completed: false, ncertRef: 'NCERT Pg 173-181' },
      { id: 'm-9-2', chapterId: 'math-ch9', title: 'Trigonometric Ratios of Specific Angles (0, 30, 45, 60, 90)', completed: false, ncertRef: 'NCERT Pg 181-187' },
      { id: 'm-9-3', chapterId: 'math-ch9', title: 'Trigonometric Identities Proofs & Algebraic Manipulations', completed: false, ncertRef: 'NCERT Pg 189-194' },
    ]
  },
  {
    id: 'math-ch10',
    subjectId: 'maths',
    unitName: 'Unit V: Trigonometry (12 Marks)',
    chapterNum: 10,
    title: 'Some Applications of Trigonometry',
    weightageMarks: 5,
    completed: false,
    confidence: 'medium',
    keyFormulae: [
      'Angle of Elevation (looking up)',
      'Angle of Depression (looking down)',
      'Height / Distance word problems using tan 30, tan 45, tan 60'
    ],
    topics: [
      { id: 'm-10-1', chapterId: 'math-ch10', title: 'Height and Distance Problems (Angle of Elevation & Depression)', completed: false, ncertRef: 'NCERT Pg 195-205' },
    ]
  },

  // Unit VI: Mensuration (10 Marks)
  {
    id: 'math-ch11',
    subjectId: 'maths',
    unitName: 'Unit VI: Mensuration (10 Marks)',
    chapterNum: 11,
    title: 'Areas Related to Circles',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    keyFormulae: [
      'Area of Sector = (theta / 360) * pi * r^2',
      'Length of Arc = (theta / 360) * 2 * pi * r',
      'Area of Segment = Area of Sector - Area of Triangle'
    ],
    topics: [
      { id: 'm-11-1', chapterId: 'math-ch11', title: 'Area of Sector & Segment of Circle', completed: false, ncertRef: 'NCERT Pg 223-231' },
    ]
  },
  {
    id: 'math-ch12',
    subjectId: 'maths',
    unitName: 'Unit VI: Mensuration (10 Marks)',
    chapterNum: 12,
    title: 'Surface Areas and Volumes',
    weightageMarks: 6,
    completed: false,
    confidence: 'medium',
    keyFormulae: [
      'Cylinder Volume V = pi * r^2 * h; TSA = 2*pi*r*(r+h)',
      'Cone Volume V = (1/3)*pi*r^2*h; CSA = pi*r*l where l = sqrt(r^2 + h^2)',
      'Sphere Volume V = (4/3)*pi*r^3; Surface Area = 4*pi*r^2',
      'Hemisphere CSA = 2*pi*r^2; TSA = 3*pi*r^2'
    ],
    topics: [
      { id: 'm-12-1', chapterId: 'math-ch12', title: 'Surface Area of Combination of Solids (Cone + Cylinder, Hemisphere + Cone)', completed: false, ncertRef: 'NCERT Pg 238-246' },
      { id: 'm-12-2', chapterId: 'math-ch12', title: 'Volume of Combination of Solids', completed: false, ncertRef: 'NCERT Pg 246-252' },
    ]
  },

  // Unit VII: Statistics & Probability (11 Marks)
  {
    id: 'math-ch13',
    subjectId: 'maths',
    unitName: 'Unit VII: Statistics & Probability (11 Marks)',
    chapterNum: 13,
    title: 'Statistics',
    weightageMarks: 7,
    completed: true,
    confidence: 'high',
    keyFormulae: [
      'Direct Mean = sum(f_i * x_i) / sum(f_i)',
      'Assumed Mean = a + (sum(f_i * d_i) / sum(f_i))',
      'Mode = l + [ (f1 - f0) / (2f1 - f0 - f2) ] * h',
      'Median = l + [ (N/2 - cf) / f ] * h',
      'Empirical Formula: 3 Median = Mode + 2 Mean'
    ],
    topics: [
      { id: 'm-13-1', chapterId: 'math-ch13', title: 'Mean of Grouped Data (Direct & Assumed Mean)', completed: true, ncertRef: 'NCERT Pg 260-271' },
      { id: 'm-13-2', chapterId: 'math-ch13', title: 'Mode of Grouped Data Formula', completed: true, ncertRef: 'NCERT Pg 272-277' },
      { id: 'm-13-3', chapterId: 'math-ch13', title: 'Median of Grouped Data & Empirical Relation', completed: true, ncertRef: 'NCERT Pg 277-289' },
    ]
  },
  {
    id: 'math-ch14',
    subjectId: 'maths',
    unitName: 'Unit VII: Statistics & Probability (11 Marks)',
    chapterNum: 14,
    title: 'Probability',
    weightageMarks: 4,
    completed: true,
    confidence: 'high',
    keyFormulae: [
      'P(E) = Number of favorable outcomes / Total possible outcomes',
      '0 <= P(E) <= 1',
      'P(E) + P(not E) = 1'
    ],
    topics: [
      { id: 'm-14-1', chapterId: 'math-ch14', title: 'Classical Definition of Probability (Coins, Dice, Playing Cards)', completed: true, ncertRef: 'NCERT Pg 295-310' },
    ]
  },

  // ================= SOCIAL SCIENCE (80 Marks) =================
  // History (20 Marks)
  {
    id: 'sst-ch1',
    subjectId: 'sst',
    unitName: 'History (20 Marks)',
    chapterNum: 1,
    title: 'The Rise of Nationalism in Europe',
    weightageMarks: 5,
    completed: true,
    confidence: 'high',
    topics: [
      { id: 's-1-1', chapterId: 'sst-ch1', title: 'French Revolution & Idea of the Nation (Napoleonic Code 1804)', completed: true, ncertRef: 'NCERT History Pg 3-8' },
      { id: 's-1-2', chapterId: 'sst-ch1', title: 'Liberal Nationalism & Treaty of Vienna (1815)', completed: true, ncertRef: 'NCERT History Pg 8-12' },
      { id: 's-1-3', chapterId: 'sst-ch1', title: 'Unification of Germany (Bismarck) & Italy (Cavour, Garibaldi)', completed: true, ncertRef: 'NCERT History Pg 13-22' },
    ]
  },
  {
    id: 'sst-ch2',
    subjectId: 'sst',
    unitName: 'History (20 Marks)',
    chapterNum: 2,
    title: 'Nationalism in India',
    weightageMarks: 6,
    completed: true,
    confidence: 'high',
    topics: [
      { id: 's-2-1', chapterId: 'sst-ch2', title: 'First World War, Satyagraha & Rowlatt Act (Jallianwala Bagh 1919)', completed: true, ncertRef: 'NCERT History Pg 29-34' },
      { id: 's-2-2', chapterId: 'sst-ch2', title: 'Non-Cooperation Movement (Khilafat & Chauri Chaura)', completed: true, ncertRef: 'NCERT History Pg 34-40' },
      { id: 's-2-3', chapterId: 'sst-ch2', title: 'Civil Disobedience Movement (Salt March 1930 & Gandhi-Irwin Pact)', completed: true, ncertRef: 'NCERT History Pg 40-47' },
      { id: 's-2-4', chapterId: 'sst-ch2', title: 'The Sense of Collective Belonging & Map Work', completed: true, ncertRef: 'NCERT History Pg 47-50' },
    ]
  },
  {
    id: 'sst-ch3',
    subjectId: 'sst',
    unitName: 'History (20 Marks)',
    chapterNum: 3,
    title: 'The Making of a Global World',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 's-3-1', chapterId: 'sst-ch3', title: 'Pre-modern World (Silk Routes) & 19th Century Trade', completed: false, ncertRef: 'NCERT History Pg 53-62' },
      { id: 's-3-2', chapterId: 'sst-ch3', title: 'The Inter-war Economy & Great Depression (1929)', completed: false, ncertRef: 'NCERT History Pg 63-70' },
    ]
  },
  {
    id: 'sst-ch4',
    subjectId: 'sst',
    unitName: 'History (20 Marks)',
    chapterNum: 4,
    title: 'Print Culture and the Modern World',
    weightageMarks: 4,
    completed: false,
    confidence: 'low',
    topics: [
      { id: 's-4-1', chapterId: 'sst-ch4', title: 'First Printed Books (China, Japan, Europe Gutenberg Press)', completed: false, ncertRef: 'NCERT History Pg 105-112' },
      { id: 's-4-2', chapterId: 'sst-ch4', title: 'Print Revolution & Impact on Society/Religion', completed: false, ncertRef: 'NCERT History Pg 113-120' },
      { id: 's-4-3', chapterId: 'sst-ch4', title: 'India and the World of Print & Vernacular Newspapers', completed: false, ncertRef: 'NCERT History Pg 121-128' },
    ]
  },
  {
    id: 'sst-ch5',
    subjectId: 'sst',
    unitName: 'History (20 Marks)',
    chapterNum: 5,
    title: 'The Age of Industrialisation',
    weightageMarks: 2,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 's-5-1', chapterId: 'sst-ch5', title: 'Before the Industrial Revolution & Proto-industrialisation', completed: false, ncertRef: 'NCERT History Pg 73-82' },
      { id: 's-5-2', chapterId: 'sst-ch5', title: 'Industrialisation in the Colonies & Factories Come Up in India', completed: false, ncertRef: 'NCERT History Pg 83-94' },
      { id: 's-5-3', chapterId: 'sst-ch5', title: 'Peculiarities of Industrial Growth & Market for Goods', completed: false, ncertRef: 'NCERT History Pg 95-102' },
    ]
  },

  // Geography (20 Marks)
  {
    id: 'sst-ch6',
    subjectId: 'sst',
    unitName: 'Geography (20 Marks)',
    chapterNum: 6,
    title: 'Resources and Development',
    weightageMarks: 3,
    completed: true,
    confidence: 'high',
    topics: [
      { id: 's-6-1', chapterId: 'sst-ch6', title: 'Types of Resources & Sustainable Development', completed: true, ncertRef: 'NCERT Geog Pg 1-6' },
      { id: 's-6-2', chapterId: 'sst-ch6', title: 'Land Resources & Soil Types in India (Alluvial, Black, Red/Yellow, Laterite, Arid)', completed: true, ncertRef: 'NCERT Geog Pg 6-12' },
    ]
  },
  {
    id: 'sst-ch7',
    subjectId: 'sst',
    unitName: 'Geography (20 Marks)',
    chapterNum: 7,
    title: 'Forest and Wildlife Resources',
    weightageMarks: 2,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 's-7-1', chapterId: 'sst-ch7', title: 'Flora and Fauna in India & Biodiversity Depletion', completed: false, ncertRef: 'NCERT Geog Pg 14-18' },
      { id: 's-7-2', chapterId: 'sst-ch7', title: 'Conservation of Forest and Wildlife & Community Conservation Projects', completed: false, ncertRef: 'NCERT Geog Pg 19-22' },
    ]
  },
  {
    id: 'sst-ch8',
    subjectId: 'sst',
    unitName: 'Geography (20 Marks)',
    chapterNum: 8,
    title: 'Water Resources',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 's-8-1', chapterId: 'sst-ch8', title: 'Water Scarcity & Need for Water Conservation', completed: false, ncertRef: 'NCERT Geog Pg 24-27' },
      { id: 's-8-2', chapterId: 'sst-ch8', title: 'Multi-Purpose River Projects & Integrated Water Resources Management', completed: false, ncertRef: 'NCERT Geog Pg 28-31' },
      { id: 's-8-3', chapterId: 'sst-ch8', title: 'Rainwater Harvesting Techniques in India', completed: false, ncertRef: 'NCERT Geog Pg 31-33' },
    ]
  },
  {
    id: 'sst-ch9',
    subjectId: 'sst',
    unitName: 'Geography (20 Marks)',
    chapterNum: 9,
    title: 'Agriculture',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 's-9-1', chapterId: 'sst-ch9', title: 'Types of Farming (Primitive, Subsistence, Commercial)', completed: false, ncertRef: 'NCERT Geog Pg 34-37' },
      { id: 's-9-2', chapterId: 'sst-ch9', title: 'Cropping Pattern (Kharif, Rabi, Zaid)', completed: false, ncertRef: 'NCERT Geog Pg 38-40' },
      { id: 's-9-3', chapterId: 'sst-ch9', title: 'Major Crops (Rice, Wheat, Sugarcane, Tea, Coffee, Cotton, Jute)', completed: false, ncertRef: 'NCERT Geog Pg 40-48' },
    ]
  },
  {
    id: 'sst-ch10',
    subjectId: 'sst',
    unitName: 'Geography (20 Marks)',
    chapterNum: 10,
    title: 'Minerals and Energy Resources',
    weightageMarks: 3,
    completed: false,
    confidence: 'low',
    topics: [
      { id: 's-10-1', chapterId: 'sst-ch10', title: 'Mode of Occurrence of Minerals & Metallic/Non-Metallic Minerals', completed: false, ncertRef: 'NCERT Geog Pg 51-58' },
      { id: 's-10-2', chapterId: 'sst-ch10', title: 'Conventional & Non-Conventional Sources of Energy', completed: false, ncertRef: 'NCERT Geog Pg 59-65' },
    ]
  },
  {
    id: 'sst-ch11',
    subjectId: 'sst',
    unitName: 'Geography (20 Marks)',
    chapterNum: 11,
    title: 'Manufacturing Industries',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 's-11-1', chapterId: 'sst-ch11', title: 'Importance & Classification of Industries', completed: false, ncertRef: 'NCERT Geog Pg 66-70' },
      { id: 's-11-2', chapterId: 'sst-ch11', title: 'Agro-based & Mineral-based Industries (Iron & Steel, IT)', completed: false, ncertRef: 'NCERT Geog Pg 71-77' },
    ]
  },
  {
    id: 'sst-ch12',
    subjectId: 'sst',
    unitName: 'Geography (20 Marks)',
    chapterNum: 12,
    title: 'Lifelines of National Economy',
    weightageMarks: 2,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 's-12-1', chapterId: 'sst-ch12', title: 'Transport Systems (Roadways, Railways, Pipelines, Waterways, Airways)', completed: false, ncertRef: 'NCERT Geog Pg 79-88' },
      { id: 's-12-2', chapterId: 'sst-ch12', title: 'Communication, International Trade & Tourism as Trade', completed: false, ncertRef: 'NCERT Geog Pg 89-93' },
    ]
  },

  // Political Science (20 Marks)
  {
    id: 'sst-ch13',
    subjectId: 'sst',
    unitName: 'Political Science (20 Marks)',
    chapterNum: 13,
    title: 'Power Sharing',
    weightageMarks: 4,
    completed: true,
    confidence: 'high',
    topics: [
      { id: 's-13-1', chapterId: 'sst-ch13', title: 'Case Studies: Belgium Accommodation & Sri Lanka Majoritarianism', completed: true, ncertRef: 'NCERT Civics Pg 1-6' },
      { id: 's-13-2', chapterId: 'sst-ch13', title: 'Why Power Sharing is Desirable (Prudential vs Moral reasons)', completed: true, ncertRef: 'NCERT Civics Pg 6-8' },
      { id: 's-13-3', chapterId: 'sst-ch13', title: 'Forms of Power Sharing (Horizontal, Vertical, Social Groups)', completed: true, ncertRef: 'NCERT Civics Pg 8-11' },
    ]
  },
  {
    id: 'sst-ch14',
    subjectId: 'sst',
    unitName: 'Political Science (20 Marks)',
    chapterNum: 14,
    title: 'Federalism',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 's-14-1', chapterId: 'sst-ch14', title: 'Key Features of Federalism & Union/State/Concurrent Lists', completed: false, ncertRef: 'NCERT Civics Pg 13-18' },
      { id: 's-14-2', chapterId: 'sst-ch14', title: 'Decentralisation in India (3-Tier Panchayati Raj 1992 Amendment)', completed: false, ncertRef: 'NCERT Civics Pg 19-26' },
    ]
  },
  {
    id: 'sst-ch15',
    subjectId: 'sst',
    unitName: 'Political Science (20 Marks)',
    chapterNum: 15,
    title: 'Gender, Religion and Caste',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 's-15-1', chapterId: 'sst-ch15', title: 'Gender & Politics (Sexual Division of Labour, Women Representation)', completed: false, ncertRef: 'NCERT Civics Pg 39-45' },
      { id: 's-15-2', chapterId: 'sst-ch15', title: 'Religion, Communalism & Secular State in India', completed: false, ncertRef: 'NCERT Civics Pg 46-50' },
      { id: 's-15-3', chapterId: 'sst-ch15', title: 'Caste & Politics (Caste Inequalities & Caste in Politics)', completed: false, ncertRef: 'NCERT Civics Pg 50-55' },
    ]
  },
  {
    id: 'sst-ch16',
    subjectId: 'sst',
    unitName: 'Political Science (20 Marks)',
    chapterNum: 16,
    title: 'Political Parties',
    weightageMarks: 4,
    completed: false,
    confidence: 'low',
    topics: [
      { id: 's-16-1', chapterId: 'sst-ch16', title: 'Why do we need Political Parties? Functions & Components', completed: false, ncertRef: 'NCERT Civics Pg 71-76' },
      { id: 's-16-2', chapterId: 'sst-ch16', title: 'National & State Parties in India & Challenges to Parties', completed: false, ncertRef: 'NCERT Civics Pg 77-83' },
    ]
  },
  {
    id: 'sst-ch17',
    subjectId: 'sst',
    unitName: 'Political Science (20 Marks)',
    chapterNum: 17,
    title: 'Outcomes of Democracy',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 's-17-1', chapterId: 'sst-ch17', title: 'How do we assess Democracy Outcomes? Accountable, Responsive & Legitimate Govt', completed: false, ncertRef: 'NCERT Civics Pg 89-93' },
      { id: 's-17-2', chapterId: 'sst-ch17', title: 'Economic Growth, Reduction of Inequality & Accommodation of Social Diversity', completed: false, ncertRef: 'NCERT Civics Pg 94-98' },
    ]
  },

  // Economics (20 Marks)
  {
    id: 'sst-ch18',
    subjectId: 'sst',
    unitName: 'Economics (20 Marks)',
    chapterNum: 18,
    title: 'Development',
    weightageMarks: 4,
    completed: true,
    confidence: 'high',
    topics: [
      { id: 's-18-1', chapterId: 'sst-ch18', title: 'Income & Other Goals, Per Capita Income (World Bank Criteria)', completed: true, ncertRef: 'NCERT Eco Pg 3-10' },
      { id: 's-18-2', chapterId: 'sst-ch18', title: 'Human Development Index (HDI), Public Facilities & Sustainability', completed: true, ncertRef: 'NCERT Eco Pg 11-16' },
    ]
  },
  {
    id: 'sst-ch19',
    subjectId: 'sst',
    unitName: 'Economics (20 Marks)',
    chapterNum: 19,
    title: 'Sectors of the Indian Economy',
    weightageMarks: 4,
    completed: true,
    confidence: 'high',
    topics: [
      { id: 's-19-1', chapterId: 'sst-ch19', title: 'Primary, Secondary & Tertiary Sectors & GDP Calculation', completed: true, ncertRef: 'NCERT Eco Pg 19-26' },
      { id: 's-19-2', chapterId: 'sst-ch19', title: 'Organised vs Unorganised Sector & MGNREGA 2005', completed: true, ncertRef: 'NCERT Eco Pg 27-35' },
    ]
  },
  {
    id: 'sst-ch20',
    subjectId: 'sst',
    unitName: 'Economics (20 Marks)',
    chapterNum: 20,
    title: 'Money and Credit',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 's-20-1', chapterId: 'sst-ch20', title: 'Money as Medium of Exchange & RBI Functions', completed: false, ncertRef: 'NCERT Eco Pg 39-44' },
      { id: 's-20-2', chapterId: 'sst-ch20', title: 'Formal vs Informal Sources of Credit & Self Help Groups (SHGs)', completed: false, ncertRef: 'NCERT Eco Pg 45-53' },
    ]
  },
  {
    id: 'sst-ch21',
    subjectId: 'sst',
    unitName: 'Economics (20 Marks)',
    chapterNum: 21,
    title: 'Globalisation and the Indian Economy',
    weightageMarks: 5,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 's-21-1', chapterId: 'sst-ch21', title: 'Production Across Countries (MNCs) & Foreign Trade Integration', completed: false, ncertRef: 'NCERT Eco Pg 55-63' },
      { id: 's-21-2', chapterId: 'sst-ch21', title: 'What is Globalisation? Factors enabling Globalisation (IT, Trade Barriers Removal, WTO)', completed: false, ncertRef: 'NCERT Eco Pg 64-70' },
      { id: 's-21-3', chapterId: 'sst-ch21', title: 'Impact of Globalisation in India & Fair Globalisation Struggle', completed: false, ncertRef: 'NCERT Eco Pg 70-74' },
    ]
  },
  {
    id: 'sst-ch22',
    subjectId: 'sst',
    unitName: 'Economics (20 Marks)',
    chapterNum: 22,
    title: 'Consumer Rights',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 's-22-1', chapterId: 'sst-ch22', title: 'Consumer in the Market Place & Consumer Movement in India', completed: false, ncertRef: 'NCERT Eco Pg 75-80' },
      { id: 's-22-2', chapterId: 'sst-ch22', title: 'Consumer Rights (COPRA 1986 / 2019) & Standard Marks (ISI, Agmark, Hallmarking)', completed: false, ncertRef: 'NCERT Eco Pg 81-88' },
    ]
  },

  // ================= ENGLISH COURSE A (Code 184 - 80 Marks) =================
  // Unit 1: First Flight - Prose
  {
    id: 'eng-ch1',
    subjectId: 'english',
    unitName: 'First Flight - Prose',
    chapterNum: 1,
    title: 'A Letter to God (G.L. Fuentes)',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'e-1-1', chapterId: 'eng-ch1', title: 'Lencho’s faith, hailstorm devastation & postmaster kindness', completed: false, ncertRef: 'NCERT First Flight Pg 3-8' },
    ]
  },
  {
    id: 'eng-ch2',
    subjectId: 'english',
    unitName: 'First Flight - Prose',
    chapterNum: 2,
    title: 'Nelson Mandela: Long Walk to Freedom',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'e-2-1', chapterId: 'eng-ch2', title: 'Inauguration speech, anti-apartheid struggle & twin obligations', completed: false, ncertRef: 'NCERT First Flight Pg 16-24' },
    ]
  },
  {
    id: 'eng-ch3',
    subjectId: 'english',
    unitName: 'First Flight - Prose',
    chapterNum: 3,
    title: 'Two Stories about Flying (His First Flight & Black Aeroplane)',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'e-3-1', chapterId: 'eng-ch3', title: 'Part I: His First Flight (Young seagull overcoming fear)', completed: false, ncertRef: 'NCERT First Flight Pg 32-36' },
      { id: 'e-3-2', chapterId: 'eng-ch3', title: 'Part II: The Black Aeroplane (Mystery pilot in storm)', completed: false, ncertRef: 'NCERT First Flight Pg 37-41' },
    ]
  },
  {
    id: 'eng-ch4',
    subjectId: 'english',
    unitName: 'First Flight - Prose',
    chapterNum: 4,
    title: 'From the Diary of Anne Frank',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'e-4-1', chapterId: 'eng-ch4', title: 'Anne’s relationship with Kitty & Mr. Keesing’s essays', completed: false, ncertRef: 'NCERT First Flight Pg 48-55' },
    ]
  },
  {
    id: 'eng-ch5',
    subjectId: 'english',
    unitName: 'First Flight - Prose',
    chapterNum: 5,
    title: 'Glimpses of India (Baker from Goa, Coorg, Tea from Assam)',
    weightageMarks: 5,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'e-5-1', chapterId: 'eng-ch5', title: 'Part I: A Baker from Goa (Pader heritage)', completed: false, ncertRef: 'NCERT First Flight Pg 85-88' },
      { id: 'e-5-2', chapterId: 'eng-ch5', title: 'Part II: Coorg (Martial tradition, flora & fauna)', completed: false, ncertRef: 'NCERT First Flight Pg 89-92' },
      { id: 'e-5-3', chapterId: 'eng-ch5', title: 'Part III: Tea from Assam (Pranjol & Rajvir tea legends)', completed: false, ncertRef: 'NCERT First Flight Pg 93-97' },
    ]
  },
  {
    id: 'eng-ch6',
    subjectId: 'english',
    unitName: 'First Flight - Prose',
    chapterNum: 6,
    title: 'Mijbil the Otter (Gavin Maxwell)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'e-6-1', chapterId: 'eng-ch6', title: 'Otter transport journey from Tigris to London', completed: false, ncertRef: 'NCERT First Flight Pg 103-111' },
    ]
  },
  {
    id: 'eng-ch7',
    subjectId: 'english',
    unitName: 'First Flight - Prose',
    chapterNum: 7,
    title: 'Madam Rides the Bus (Vallikkannan)',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'e-7-1', chapterId: 'eng-ch7', title: 'Valli’s eight-year-old bus ride, desire & encounter with death', completed: false, ncertRef: 'NCERT First Flight Pg 117-127' },
    ]
  },
  {
    id: 'eng-ch8',
    subjectId: 'english',
    unitName: 'First Flight - Prose',
    chapterNum: 8,
    title: 'The Sermon at Benares (Betty Renshaw)',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'e-8-1', chapterId: 'eng-ch8', title: 'Gautama Buddha enlightenment & Kisa Gotami mustard seed lesson', completed: false, ncertRef: 'NCERT First Flight Pg 133-138' },
    ]
  },
  {
    id: 'eng-ch9',
    subjectId: 'english',
    unitName: 'First Flight - Prose',
    chapterNum: 9,
    title: 'The Proposal (Play by Anton Chekhov)',
    weightageMarks: 5,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'e-9-1', chapterId: 'eng-ch9', title: 'Lomov, Natalya & Chubukov quarrel over Oxen Meadows and dogs', completed: false, ncertRef: 'NCERT First Flight Pg 142-155' },
    ]
  },

  // Unit 2: First Flight - Poetry
  {
    id: 'eng-po1',
    subjectId: 'english',
    unitName: 'First Flight - Poetry',
    chapterNum: 10,
    title: 'Dust of Snow & Fire and Ice (Robert Frost)',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'ep-1-1', chapterId: 'eng-po1', title: 'Dust of Snow: Hemlock tree, crow & mood transformation', completed: false, ncertRef: 'NCERT First Flight Pg 14' },
      { id: 'ep-1-2', chapterId: 'eng-po1', title: 'Fire and Ice: Desire vs Hate metaphors for world destruction', completed: false, ncertRef: 'NCERT First Flight Pg 15' },
    ]
  },
  {
    id: 'eng-po2',
    subjectId: 'english',
    unitName: 'First Flight - Poetry',
    chapterNum: 11,
    title: 'A Tiger in the Zoo (Leslie Norris)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'ep-2-1', chapterId: 'eng-po2', title: 'Contrast between tiger in concrete cell vs wild jungle habitat', completed: false, ncertRef: 'NCERT First Flight Pg 29-31' },
    ]
  },
  {
    id: 'eng-po3',
    subjectId: 'english',
    unitName: 'First Flight - Poetry',
    chapterNum: 12,
    title: 'How to Tell Wild Animals (Carolyn Wells)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'ep-3-1', chapterId: 'eng-po3', title: 'Humorous descriptions of Asian Lion, Bengal Tiger, Leopard, Bear', completed: false, ncertRef: 'NCERT First Flight Pg 43-46' },
    ]
  },
  {
    id: 'eng-po4',
    subjectId: 'english',
    unitName: 'First Flight - Poetry',
    chapterNum: 13,
    title: 'The Ball Poem (John Berryman)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'ep-4-1', chapterId: 'eng-po4', title: 'Loss of ball as metaphor for learning responsibility & loss', completed: false, ncertRef: 'NCERT First Flight Pg 57-58' },
    ]
  },
  {
    id: 'eng-po5',
    subjectId: 'english',
    unitName: 'First Flight - Poetry',
    chapterNum: 14,
    title: 'Amanda! (Robin Klein)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'ep-5-1', chapterId: 'eng-po5', title: 'Child imagination (mermaid, orphan, Rapunzel) vs nagging parents', completed: false, ncertRef: 'NCERT First Flight Pg 61-63' },
    ]
  },
  {
    id: 'eng-po6',
    subjectId: 'english',
    unitName: 'First Flight - Poetry',
    chapterNum: 15,
    title: 'The Trees (Adrienne Rich)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'ep-6-1', chapterId: 'eng-po6', title: 'Movement of trees out of enclosed house into forest', completed: false, ncertRef: 'NCERT First Flight Pg 99-101' },
    ]
  },
  {
    id: 'eng-po7',
    subjectId: 'english',
    unitName: 'First Flight - Poetry',
    chapterNum: 16,
    title: 'Fog (Carl Sandburg)',
    weightageMarks: 2,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'ep-7-1', chapterId: 'eng-po7', title: 'Metaphor of fog coming on little cat feet over harbor and city', completed: false, ncertRef: 'NCERT First Flight Pg 114' },
    ]
  },
  {
    id: 'eng-po8',
    subjectId: 'english',
    unitName: 'First Flight - Poetry',
    chapterNum: 17,
    title: 'The Tale of Custard the Dragon (Ogden Nash)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'ep-8-1', chapterId: 'eng-po8', title: 'Belinda’s pets, cowardly dragon Custard & pirate encounter', completed: false, ncertRef: 'NCERT First Flight Pg 129-132' },
    ]
  },
  {
    id: 'eng-po9',
    subjectId: 'english',
    unitName: 'First Flight - Poetry',
    chapterNum: 18,
    title: 'For Anne Gregory (W.B. Yeats)',
    weightageMarks: 2,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'ep-9-1', chapterId: 'eng-po9', title: 'External yellow hair beauty vs internal spiritual love', completed: false, ncertRef: 'NCERT First Flight Pg 140' },
    ]
  },

  // Unit 3: Footprints Without Feet (Supplementary)
  {
    id: 'eng-s1',
    subjectId: 'english',
    unitName: 'Footprints Without Feet (Supplementary Reader)',
    chapterNum: 19,
    title: 'A Triumph of Surgery (James Herriot)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'es-1-1', chapterId: 'eng-s1', title: 'Tricki dog, Mrs. Pumphrey overfeeding & Herriot non-medical recovery', completed: false, ncertRef: 'NCERT Footprints Pg 1-6' },
    ]
  },
  {
    id: 'eng-s2',
    subjectId: 'english',
    unitName: 'Footprints Without Feet (Supplementary Reader)',
    chapterNum: 20,
    title: 'The Thief’s Story (Ruskin Bond)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'es-2-1', chapterId: 'eng-s2', title: 'Hari Singh (15-yr thief), Anil trust & moral transformation', completed: false, ncertRef: 'NCERT Footprints Pg 8-13' },
    ]
  },
  {
    id: 'eng-s3',
    subjectId: 'english',
    unitName: 'Footprints Without Feet (Supplementary Reader)',
    chapterNum: 21,
    title: 'The Midnight Visitor (Robert Arthur)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'es-3-1', chapterId: 'eng-s3', title: 'Secret agent Ausable, Fowler & tricking gunman Max with balcony story', completed: false, ncertRef: 'NCERT Footprints Pg 14-18' },
    ]
  },
  {
    id: 'eng-s4',
    subjectId: 'english',
    unitName: 'Footprints Without Feet (Supplementary Reader)',
    chapterNum: 22,
    title: 'A Question of Trust (Victor Canning)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'es-4-1', chapterId: 'eng-s4', title: 'Horace Danby safe-robbing, lady in red deception at Shotover Grange', completed: false, ncertRef: 'NCERT Footprints Pg 20-25' },
    ]
  },
  {
    id: 'eng-s5',
    subjectId: 'english',
    unitName: 'Footprints Without Feet (Supplementary Reader)',
    chapterNum: 23,
    title: 'Footprints without Feet (H.G. Wells)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'es-5-1', chapterId: 'eng-s5', title: 'Griffin scientist, invisibility drug misuse & Iping village chaos', completed: false, ncertRef: 'NCERT Footprints Pg 26-31' },
    ]
  },
  {
    id: 'eng-s6',
    subjectId: 'english',
    unitName: 'Footprints Without Feet (Supplementary Reader)',
    chapterNum: 24,
    title: 'The Making of a Scientist (Robert W. Peterson)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'es-6-1', chapterId: 'eng-s6', title: 'Richard Ebright, Monarch butterflies & scientific curiosity journey', completed: false, ncertRef: 'NCERT Footprints Pg 32-38' },
    ]
  },
  {
    id: 'eng-s7',
    subjectId: 'english',
    unitName: 'Footprints Without Feet (Supplementary Reader)',
    chapterNum: 25,
    title: 'The Necklace (Guy de Maupassant)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'es-7-1', chapterId: 'eng-s7', title: 'Matilda Loisel vanity, lost diamond necklace & 10 years hard labor', completed: false, ncertRef: 'NCERT Footprints Pg 39-46' },
    ]
  },
  {
    id: 'eng-s8',
    subjectId: 'english',
    unitName: 'Footprints Without Feet (Supplementary Reader)',
    chapterNum: 26,
    title: 'Bholi (K.A. Abbas)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'es-8-1', chapterId: 'eng-s8', title: 'Sulekha (Bholi), teacher encouragement & rejection of greedy Bishamber', completed: false, ncertRef: 'NCERT Footprints Pg 54-62' },
    ]
  },
  {
    id: 'eng-s9',
    subjectId: 'english',
    unitName: 'Footprints Without Feet (Supplementary Reader)',
    chapterNum: 27,
    title: 'The Book That Saved the Earth (Claire Boiko)',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'es-9-1', chapterId: 'eng-s9', title: 'Martian invasion team (Think-Tank, Noodle, Oop) & Mother Goose nursery rhymes', completed: false, ncertRef: 'NCERT Footprints Pg 63-74' },
    ]
  },

  // Unit 4: Grammar & Writing Skills
  {
    id: 'eng-g1',
    subjectId: 'english',
    unitName: 'Section B: Grammar & Writing Skills (20 Marks)',
    chapterNum: 28,
    title: 'Integrated CBSE Grammar Rules & Exercises',
    weightageMarks: 10,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'eg-1-1', chapterId: 'eng-g1', title: 'Tenses, Modals & Subject-Verb Concord Rules', completed: false, ncertRef: 'Grammar Section' },
      { id: 'eg-1-2', chapterId: 'eng-g1', title: 'Reported Speech (Direct & Indirect Commands/Statements)', completed: false, ncertRef: 'Grammar Section' },
      { id: 'eg-1-3', chapterId: 'eng-g1', title: 'Determiners & Error Correction / Omission', completed: false, ncertRef: 'Grammar Section' },
    ]
  },
  {
    id: 'eng-g2',
    subjectId: 'english',
    unitName: 'Section B: Grammar & Writing Skills (20 Marks)',
    chapterNum: 29,
    title: 'Formal Letter Writing & Analytical Paragraph',
    weightageMarks: 10,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'eg-2-1', chapterId: 'eng-g2', title: 'Formal Letter (Editor, Complaint, Order, Inquiry)', completed: false, ncertRef: 'Writing Skills' },
      { id: 'eg-2-2', chapterId: 'eng-g2', title: 'Analytical Paragraph (Bar Graphs, Charts, Data Outline analysis)', completed: false, ncertRef: 'Writing Skills' },
    ]
  },

  // ================= HINDI COURSE A (Code 002 - 80 Marks) =================
  // Unit 1: क्षितिज भाग-2: काव्य खंड
  {
    id: 'hin-k1',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: काव्य खंड',
    chapterNum: 1,
    title: 'सूरदास के पद (उद्धव तुम हो अति बड़भागी)',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hk-1-1', chapterId: 'hin-k1', title: 'गोपियों का उद्धव पर व्यंग्य, प्रेम भक्ति एवं पद व्याख्या', completed: false, ncertRef: 'NCERT क्षितिज पृ 1-6' },
    ]
  },
  {
    id: 'hin-k2',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: काव्य खंड',
    chapterNum: 2,
    title: 'तुलसीदास: राम-लक्ष्मण-परशुराम संवाद',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hk-2-1', chapterId: 'hin-k2', title: 'शिवधनुष भंग के बाद लक्ष्मण और परशुराम का वीरोचित संवाद', completed: false, ncertRef: 'NCERT क्षितिज पृ 9-16' },
    ]
  },
  {
    id: 'hin-k3',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: काव्य खंड',
    chapterNum: 3,
    title: 'जयशंकर प्रसाद: आत्मकथ्य',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hk-3-1', chapterId: 'hin-k3', title: 'कवि द्वारा अपनी आत्मकथा न लिखने के कारण एवं छायावादी सौंदर्य', completed: false, ncertRef: 'NCERT क्षितिज पृ 22-24' },
    ]
  },
  {
    id: 'hin-k4',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: काव्य खंड',
    chapterNum: 4,
    title: 'सूर्यकांत त्रिपाठी "निराला": उत्साह एवं अट नहीं रही है',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hk-4-1', chapterId: 'hin-k4', title: 'उत्साह (बादल का आह्वान) और अट नहीं रही है (फागुन की मादकता)', completed: false, ncertRef: 'NCERT क्षितिज पृ 28-31' },
    ]
  },
  {
    id: 'hin-k5',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: काव्य खंड',
    chapterNum: 5,
    title: 'नागार्जुन: यह दंतुरित मुसकान एवं फसल',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hk-5-1', chapterId: 'hin-k5', title: 'शिशु की दंतुरित मुसकान की सुंदरता एवं फसल के निर्माण में प्रकृति व श्रम का योगदान', completed: false, ncertRef: 'NCERT क्षितिज पृ 34-37' },
    ]
  },
  {
    id: 'hin-k6',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: काव्य खंड',
    chapterNum: 6,
    title: 'गिरजाकुमार माथुर: छाया मत छूना',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hk-6-1', chapterId: 'hin-k6', title: 'विगत सुखों को याद कर वर्तमान दुख न बढ़ाने का संदेश', completed: false, ncertRef: 'NCERT क्षितिज पृ 40-42' },
    ]
  },
  {
    id: 'hin-k7',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: काव्य खंड',
    chapterNum: 7,
    title: 'ऋतुराज: कन्यादान',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hk-7-1', chapterId: 'hin-k7', title: 'माँ द्वारा बेटी को पारंपरिक स्त्री-सुलभ बंधनों से परे सीख', completed: false, ncertRef: 'NCERT क्षितिज पृ 45-47' },
    ]
  },
  {
    id: 'hin-k8',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: काव्य खंड',
    chapterNum: 8,
    title: 'मंगलेश डबराल: संगतकार',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hk-8-1', chapterId: 'hin-k8', title: 'मुख्य गायक के साथ संगतकार के निस्वार्थ सहयोग एवं त्याग का महत्व', completed: false, ncertRef: 'NCERT क्षितिज पृ 50-52' },
    ]
  },

  // Unit 2: क्षितिज भाग-2: गद्य खंड
  {
    id: 'hin-g1',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: गद्य खंड',
    chapterNum: 9,
    title: 'स्वयं प्रकाश: नेताजी का चश्मा',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hg-1-1', chapterId: 'hin-g1', title: 'हालदार साहब, कैप्टन चश्मेवाला और देशप्रेम का सच्चा संदेश', completed: false, ncertRef: 'NCERT क्षितिज पृ 55-61' },
    ]
  },
  {
    id: 'hin-g2',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: गद्य खंड',
    chapterNum: 10,
    title: 'रामवृक्ष बेनीपुरी: बालगोबिन भगत',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hg-2-1', chapterId: 'hin-g2', title: 'बालगोबिन भगत का गृहस्थ संत जीवन, कबीर के प्रति श्रद्धा एवं सामाजिक कुरीति विरोध', completed: false, ncertRef: 'NCERT क्षितिज पृ 64-71' },
    ]
  },
  {
    id: 'hin-g3',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: गद्य खंड',
    chapterNum: 11,
    title: 'यशपाल: लखनवी अंदाज़',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hg-3-1', chapterId: 'hin-g3', title: 'नवाब साहब की पतनशील सामंती बनावटी जीवनशैली पर तीखा व्यंग्य', completed: false, ncertRef: 'NCERT क्षितिज पृ 74-78' },
    ]
  },
  {
    id: 'hin-g4',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: गद्य खंड',
    chapterNum: 12,
    title: 'सर्वेश्वर दयाल सक्सेना: मानवीय करुणा की दिव्य चमक',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hg-4-1', chapterId: 'hin-g4', title: 'फ़ादर कामिल बुल्के का आत्मीय व्यक्तित्व एवं हिंदी प्रेम', completed: false, ncertRef: 'NCERT क्षितिज पृ 81-87' },
    ]
  },
  {
    id: 'hin-g5',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: गद्य खंड',
    chapterNum: 13,
    title: 'मन्नू भंडारी: एक कहानी यह भी',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hg-5-1', chapterId: 'hin-g5', title: 'लेखिका के व्यक्तित्व निर्माण में पिता एवं प्राध्यापिका शीला अग्रवाल का प्रभाव', completed: false, ncertRef: 'NCERT क्षितिज पृ 90-99' },
    ]
  },
  {
    id: 'hin-g6',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: गद्य खंड',
    chapterNum: 14,
    title: 'महावीर प्रसाद द्विवेदी: स्त्री शिक्षा के विरोधी कुतर्कों का खंडन',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hg-6-1', chapterId: 'hin-g6', title: 'स्त्री शिक्षा के विरोधियों के अनर्गल तर्कों का तार्किक खंडन', completed: false, ncertRef: 'NCERT क्षितिज पृ 102-108' },
    ]
  },
  {
    id: 'hin-g7',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: गद्य खंड',
    chapterNum: 15,
    title: 'यतींद्र मिश्र: नौबतखाने में इबादत',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hg-7-1', chapterId: 'hin-g7', title: 'शहनाई वादक उस्ताद बिस्मिल्ला ख़ाँ का सादगीपूर्ण जीवन एवं संगीत साधना', completed: false, ncertRef: 'NCERT क्षितिज पृ 111-120' },
    ]
  },
  {
    id: 'hin-g8',
    subjectId: 'hindi',
    unitName: 'क्षितिज भाग-2: गद्य खंड',
    chapterNum: 16,
    title: 'भदंत आनंद कौसल्यायन: संस्कृति',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hg-8-1', chapterId: 'hin-g8', title: 'सभ्यता और संस्कृति का अंतर तथा मानव कल्याणकारी दृष्टि', completed: false, ncertRef: 'NCERT क्षितिज पृ 123-128' },
    ]
  },

  // Unit 3: कृतिका भाग-2 (पूरक पाठ्यपुस्तक)
  {
    id: 'hin-kr1',
    subjectId: 'hindi',
    unitName: 'कृतिका भाग-2 (पूरक पाठ्यपुस्तक)',
    chapterNum: 17,
    title: 'शिवपूजन सहाय: माता का अंचल',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hkr-1-1', chapterId: 'hin-kr1', title: 'भोलानाथ का ग्रामीण बचपन, पिता संग खेल एवं संकट में माँ का आंचल', completed: false, ncertRef: 'NCERT कृतिका पृ 1-9' },
    ]
  },
  {
    id: 'hin-kr2',
    subjectId: 'hindi',
    unitName: 'कृतिका भाग-2 (पूरक पाठ्यपुस्तक)',
    chapterNum: 18,
    title: 'कमलेश्वर: जॉर्ज पंचम की नाक',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hkr-2-1', chapterId: 'hin-kr2', title: 'सरकारी तंत्र की चाटुकारिता एवं औपनिवेशिक मानसिकता पर तीखा व्यंग्य', completed: false, ncertRef: 'NCERT कृतिका पृ 11-16' },
    ]
  },
  {
    id: 'hin-kr3',
    subjectId: 'hindi',
    unitName: 'कृतिका भाग-2 (पूरक पाठ्यपुस्तक)',
    chapterNum: 19,
    title: 'मधु कांकरिया: साना-साना हाथ जोड़ि...',
    weightageMarks: 4,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hkr-3-1', chapterId: 'hin-kr3', title: 'सिक्किम (गंतोक व युमथांग) यात्रा संस्मरण, प्राकृतिक सौंदर्य एवं बॉर्डर सेना का त्याग', completed: false, ncertRef: 'NCERT कृतिका पृ 18-29' },
    ]
  },
  {
    id: 'hin-kr4',
    subjectId: 'hindi',
    unitName: 'कृतिका भाग-2 (पूरक पाठ्यपुस्तक)',
    chapterNum: 20,
    title: 'शिवप्रसाद मिश्र "रुद्र": एही ठैयाँ झुलनी हेरानी हो रामा!',
    weightageMarks: 2,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hkr-4-1', chapterId: 'hin-kr4', title: 'दुलारी और टुन्नू का स्वाधीनता आंदोलन में योगदान एवं लोककला प्रेम', completed: false, ncertRef: 'NCERT कृतिका पृ 31-41' },
    ]
  },
  {
    id: 'hin-kr5',
    subjectId: 'hindi',
    unitName: 'कृतिका भाग-2 (पूरक पाठ्यपुस्तक)',
    chapterNum: 21,
    title: 'अज्ञेय: मैं क्यों लिखता हूँ?',
    weightageMarks: 3,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hkr-5-1', chapterId: 'hin-kr5', title: 'लेखक की आंतरिक विवशता, हिरोशिमा परमाणु विस्फोट का प्रभाव', completed: false, ncertRef: 'NCERT कृतिका पृ 43-48' },
    ]
  },

  // Unit 4: व्यवहारिक व्याकरण एवं रचनात्मक लेखन
  {
    id: 'hin-vw1',
    subjectId: 'hindi',
    unitName: 'व्यावहारिक व्याकरण एवं रचनात्मक लेखन (36 अंक)',
    chapterNum: 22,
    title: 'व्यावहारिक व्याकरण (रचना अनुसार वाक्य, वाच्य, पद परिचय, अलंकार/रस)',
    weightageMarks: 16,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hvw-1-1', chapterId: 'hin-vw1', title: 'रचना के आधार पर वाक्य भेद (सरल, संयुक्त, मिश्र वाक्य रूपांतरण)', completed: false, ncertRef: 'व्याकरण नियम' },
      { id: 'hvw-1-2', chapterId: 'hin-vw1', title: 'वाच्य परिवर्तन (कर्तृवाच्य, कर्मवाच्य, भाववाच्य)', completed: false, ncertRef: 'व्याकरण नियम' },
      { id: 'hvw-1-3', chapterId: 'hin-vw1', title: 'पद परिचय (संज्ञा, सर्वनाम, विशेषण, क्रिया, अव्यय)', completed: false, ncertRef: 'व्याकरण नियम' },
      { id: 'hvw-1-4', chapterId: 'hin-vw1', title: 'अलंकार (अनुप्रास, यमक, श्लेष, उपमा, रूपक, उत्प्रेक्षा, अतिशयोक्ति, मानवीकरण)', completed: false, ncertRef: 'व्याकरण नियम' },
    ]
  },
  {
    id: 'hin-vw2',
    subjectId: 'hindi',
    unitName: 'व्यावहारिक व्याकरण एवं रचनात्मक लेखन (36 अंक)',
    chapterNum: 23,
    title: 'रचनात्मक लेखन (अनुच्छेद, पत्र, ई-मेल/स्ववृत्त, संदेश/विज्ञापन लेखन)',
    weightageMarks: 20,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'hvw-2-1', chapterId: 'hin-vw2', title: 'संकेत-बिंदुओं पर आधारित औपचारिक अनुच्छेद लेखन (6 अंक)', completed: false, ncertRef: 'रचनात्मक लेखन' },
      { id: 'hvw-2-2', chapterId: 'hin-vw2', title: 'औपचारिक एवं अनौपचारिक पत्र लेखन (5 अंक)', completed: false, ncertRef: 'रचनात्मक लेखन' },
      { id: 'hvw-2-3', chapterId: 'hin-vw2', title: 'स्ववृत्त (Bio-Data) लेखन अथवा ई-मेल लेखन (5 अंक)', completed: false, ncertRef: 'रचनात्मक लेखन' },
      { id: 'hvw-2-4', chapterId: 'hin-vw2', title: 'विज्ञापन लेखन अथवा शुभकामनाएं/संदेश लेखन (4 अंक)', completed: false, ncertRef: 'रचनात्मक लेखन' },
    ]
  },

  // ================= ARTIFICIAL INTELLIGENCE (Code 417 - 50 Marks) =================
  {
    id: 'cs-ch1',
    subjectId: 'cs',
    unitName: 'Subject Specific Skills (40 Marks)',
    chapterNum: 1,
    title: 'Introduction to Artificial Intelligence',
    weightageMarks: 8,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'cs-1-1', chapterId: 'cs-ch1', title: 'Foundations of AI: Intelligence, Artificial Intelligence vs Machine Learning vs Deep Learning', completed: false, ncertRef: 'CBSE AI Code 417 Unit 1' },
      { id: 'cs-1-2', chapterId: 'cs-ch1', title: 'Domains of AI: Data Science, Computer Vision (CV) & Natural Language Processing (NLP)', completed: false, ncertRef: 'CBSE AI Code 417 Unit 1' },
      { id: 'cs-1-3', chapterId: 'cs-ch1', title: 'AI for Sustainable Development Goals (SDGs) & Smart Cities', completed: false, ncertRef: 'CBSE AI Code 417 Unit 1' },
      { id: 'cs-1-4', chapterId: 'cs-ch1', title: 'AI Ethics, Algorithmic Bias, Data Privacy & Concerns', completed: false, ncertRef: 'CBSE AI Code 417 Unit 1' },
    ]
  },
  {
    id: 'cs-ch2',
    subjectId: 'cs',
    unitName: 'Subject Specific Skills (40 Marks)',
    chapterNum: 2,
    title: 'AI Project Cycle',
    weightageMarks: 10,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'cs-2-1', chapterId: 'cs-ch2', title: 'Problem Scoping: 4Ws Problem Canvas (Who, What, Where, Why)', completed: false, ncertRef: 'CBSE AI Code 417 Unit 2' },
      { id: 'cs-2-2', chapterId: 'cs-ch2', title: 'Data Acquisition & Data Exploration: Reliable Sources & Visualizing Patterns', completed: false, ncertRef: 'CBSE AI Code 417 Unit 2' },
      { id: 'cs-2-3', chapterId: 'cs-ch2', title: 'Modelling: Rule-Based Approaches vs Learning-Based Approaches (Supervised, Unsupervised, RL)', completed: false, ncertRef: 'CBSE AI Code 417 Unit 2' },
      { id: 'cs-2-4', chapterId: 'cs-ch2', title: 'Evaluation: Testing AI Models, Accuracy, Precision, Recall & Confusion Matrix', completed: false, ncertRef: 'CBSE AI Code 417 Unit 2' },
    ]
  },
  {
    id: 'cs-ch3',
    subjectId: 'cs',
    unitName: 'Subject Specific Skills (40 Marks)',
    chapterNum: 3,
    title: 'Advance Python & Data Science',
    weightageMarks: 10,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'cs-3-1', chapterId: 'cs-ch3', title: 'Python Basics Recap: Lists, Dictionaries, Loops & Functions', completed: false, ncertRef: 'CBSE AI Code 417 Unit 3' },
      { id: 'cs-3-2', chapterId: 'cs-ch3', title: 'NumPy Library: Arrays, Slicing, Reshaping & Vectorized Operations', completed: false, ncertRef: 'CBSE AI Code 417 Unit 3' },
      { id: 'cs-3-3', chapterId: 'cs-3-3', title: 'Pandas Library: Series, DataFrames, Data Cleaning & Analysis', completed: false, ncertRef: 'CBSE AI Code 417 Unit 3' },
      { id: 'cs-3-4', chapterId: 'cs-3-4', title: 'Data Visualization using Matplotlib (Bar Charts, Histograms, Line Plots)', completed: false, ncertRef: 'CBSE AI Code 417 Unit 3' },
    ]
  },
  {
    id: 'cs-ch4',
    subjectId: 'cs',
    unitName: 'Subject Specific Skills (40 Marks)',
    chapterNum: 4,
    title: 'Computer Vision & Natural Language Processing',
    weightageMarks: 12,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'cs-4-1', chapterId: 'cs-ch4', title: 'Computer Vision: Image Processing, RGB Pixels, Convolution & Edge Detection', completed: false, ncertRef: 'CBSE AI Code 417 Unit 4' },
      { id: 'cs-4-2', chapterId: 'cs-ch4', title: 'CV Applications: Face Recognition, Autonomous Vehicles & Medical Imaging', completed: false, ncertRef: 'CBSE AI Code 417 Unit 4' },
      { id: 'cs-4-3', chapterId: 'cs-4-3', title: 'Natural Language Processing (NLP) Pipeline: Sentence Segmentation & Tokenization', completed: false, ncertRef: 'CBSE AI Code 417 Unit 4' },
      { id: 'cs-4-4', chapterId: 'cs-4-4', title: 'Text Normalization, Stemming, Lemmatization, Stopwords & Bag of Words (BoW) Model', completed: false, ncertRef: 'CBSE AI Code 417 Unit 4' },
    ]
  },
  {
    id: 'cs-ch5',
    subjectId: 'cs',
    unitName: 'Employability Skills (10 Marks)',
    chapterNum: 5,
    title: 'Employability Skills (Communication, Self-Management, ICT, Entrepreneurship & Green Skills)',
    weightageMarks: 10,
    completed: false,
    confidence: 'medium',
    topics: [
      { id: 'cs-5-1', chapterId: 'cs-ch5', title: 'Communication Skills-II (Verbal, Non-Verbal, Barriers & 7 Cs)', completed: false, ncertRef: 'NCERT Employability Skills Unit 1' },
      { id: 'cs-5-2', chapterId: 'cs-ch5', title: 'Self-Management Skills-II (Stress Management, Self-Awareness & Motivation)', completed: false, ncertRef: 'NCERT Employability Skills Unit 2' },
      { id: 'cs-5-3', chapterId: 'cs-5-3', title: 'ICT Skills-II (Operating System, File Management, Security & Maintenance)', completed: false, ncertRef: 'NCERT Employability Skills Unit 3' },
      { id: 'cs-5-4', chapterId: 'cs-5-4', title: 'Entrepreneurial & Green Skills-II (Characteristics, Sustainable Development & Green Economy)', completed: false, ncertRef: 'NCERT Employability Skills Unit 4-5' },
    ]
  }
];
