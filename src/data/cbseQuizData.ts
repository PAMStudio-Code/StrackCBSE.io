import { QuizQuestion } from '../types';

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- SCIENCE QUIZZES ---
  // Science Ch 1: Chemical Reactions & Equations
  {
    id: 'q-sci-1',
    chapterId: 'sci-ch1',
    subjectId: 'science',
    type: 'mcq',
    question: 'A student heats Ferrous Sulphate crystals in a dry test tube. Which of the following observations is correct?',
    options: [
      'The green colour fades and a brownish reddish solid Fe2O3 is formed with smell of burning sulphur.',
      'A dense white fume of Ammonium Chloride is evolved.',
      'The crystals turn blue and release hydrogen gas.',
      'No change in color occurs.'
    ],
    correctAnswer: 0,
    explanation: '2FeSO4 (s) --Heat--> Fe2O3 (s) + SO2 (g) + SO3 (g). FeSO4.7H2O green crystals lose water and decompose into ferric oxide (reddish brown) and sulphur dioxide/trioxide gases with pungent smell.',
    ncertRef: 'NCERT Science Ch 1, Pg 8'
  },
  {
    id: 'q-sci-2',
    chapterId: 'sci-ch1',
    subjectId: 'science',
    type: 'assertion_reason',
    question: 'Assertion (A): White silver chloride turns grey in sunlight.\nReason (R): Decomposition of silver chloride into silver and chlorine takes place by light.',
    options: [
      'Both A and R are true and R is the correct explanation of A.',
      'Both A and R are true but R is NOT the correct explanation of A.',
      'A is true but R is false.',
      'A is false but R is true.'
    ],
    correctAnswer: 0,
    explanation: '2AgCl (s) --Sunlight--> 2Ag (s) [grey] + Cl2 (g). This photolytic decomposition reaction causes AgCl to turn grey in sunlight.',
    ncertRef: 'NCERT Science Ch 1, Pg 10'
  },

  // Science Ch 2: Acids, Bases and Salts
  {
    id: 'q-sci-3',
    chapterId: 'sci-ch2',
    subjectId: 'science',
    type: 'mcq',
    question: 'Which of the following salts does NOT contain water of crystallisation?',
    options: [
      'Blue Vitriol (CuSO4.5H2O)',
      'Baking Soda (NaHCO3)',
      'Washing Soda (Na2CO3.10H2O)',
      'Gypsum (CaSO4.2H2O)'
    ],
    correctAnswer: 1,
    explanation: 'Baking Soda is Sodium Hydrogen Carbonate (NaHCO3), an anhydrous salt with no fixed water molecules attached to its crystal lattice.',
    ncertRef: 'NCERT Science Ch 2, Pg 32'
  },

  // Science Ch 4: Carbon and Its Compounds
  {
    id: 'q-sci-4',
    chapterId: 'sci-ch4',
    subjectId: 'science',
    type: 'mcq',
    question: 'Ethanol reacts with sodium metal to evolve a gas that burns with a pop sound. Identify the gas and reaction product:',
    options: [
      'Hydrogen gas and Sodium Ethoxide (CH3CH2ONa)',
      'Oxygen gas and Sodium Acetate',
      'Carbon Dioxide and Water',
      'Methane gas and Sodium Hydroxide'
    ],
    correctAnswer: 0,
    explanation: '2C2H5OH + 2Na -> 2C2H5ONa (Sodium Ethoxide) + H2 (g). Hydrogen gas burns with a characteristic pop sound when a burning matchstick is brought near.',
    ncertRef: 'NCERT Science Ch 4, Pg 73'
  },
  {
    id: 'q-sci-5',
    chapterId: 'sci-ch4',
    subjectId: 'science',
    type: 'mcq',
    question: 'How many covalent bonds are present in a molecule of Ethane (C2H6)?',
    options: ['6 covalent bonds', '7 covalent bonds', '8 covalent bonds', '9 covalent bonds'],
    correctAnswer: 1,
    explanation: 'Ethane has 1 Carbon-Carbon single covalent bond and 6 Carbon-Hydrogen single covalent bonds, totaling 7 covalent bonds.',
    ncertRef: 'NCERT Science Ch 4, Pg 62'
  },

  // Science Ch 5: Life Processes
  {
    id: 'q-sci-6',
    chapterId: 'sci-ch5',
    subjectId: 'science',
    type: 'mcq',
    question: 'During strenuous muscular exercise, accumulation of which substance causes muscle cramps due to anaerobic respiration in human muscles?',
    options: [
      'Ethanol + CO2',
      'Lactic acid + Energy',
      'Pyruvate + Oxygen',
      'Carbonic acid'
    ],
    correctAnswer: 1,
    explanation: 'When oxygen is deficient in human muscle cells, pyruvate is converted into Lactic acid (a 3-carbon molecule), leading to painful cramps.',
    ncertRef: 'NCERT Science Ch 5, Pg 102'
  },

  // Science Ch 11: Electricity
  {
    id: 'q-sci-7',
    chapterId: 'sci-ch11',
    subjectId: 'science',
    type: 'mcq',
    question: 'A wire of resistance R is cut into 5 equal parts. These parts are then connected in parallel. If the equivalent resistance is R\', then the ratio R/R\' is:',
    options: ['1/25', '1/5', '5', '25'],
    correctAnswer: 3,
    explanation: 'Each cut piece has resistance r = R/5. Connected in parallel: 1/R\' = 5 * (1/r) = 5 * (5/R) = 25/R. Therefore R/R\' = 25.',
    ncertRef: 'NCERT Science Ch 11, Pg 213'
  },

  // --- MATHEMATICS QUIZZES ---
  // Maths Ch 1: Real Numbers
  {
    id: 'q-math-1',
    chapterId: 'math-ch1',
    subjectId: 'maths',
    type: 'mcq',
    question: 'If two positive integers a and b are written as a = x^3 y^2 and b = x y^3, where x and y are prime numbers, then HCF(a, b) is:',
    options: ['x y', 'x y^2', 'x^3 y^3', 'x^2 y^2'],
    correctAnswer: 1,
    explanation: 'HCF is the product of the smallest power of each common prime factor. Common prime factors are x (smallest power 1) and y (smallest power 2). So HCF = x y^2.',
    ncertRef: 'NCERT Maths Ch 1, Pg 10'
  },

  // Maths Ch 2: Polynomials
  {
    id: 'q-math-2',
    chapterId: 'math-ch2',
    subjectId: 'maths',
    type: 'mcq',
    question: 'If one zero of the quadratic polynomial x^2 + 3x + k is 2, then the value of k is:',
    options: ['10', '-10', '-7', '-2'],
    correctAnswer: 1,
    explanation: 'Since 2 is a zero, substitute x = 2: (2)^2 + 3(2) + k = 0 => 4 + 6 + k = 0 => k = -10.',
    ncertRef: 'NCERT Maths Ch 2, Pg 28'
  },

  // Maths Ch 4: Quadratic Equations
  {
    id: 'q-math-3',
    chapterId: 'math-ch4',
    subjectId: 'maths',
    type: 'mcq',
    question: 'The discriminant of the quadratic equation 2x^2 - 4x + 3 = 0 is:',
    options: ['-8 (No real roots)', '8 (Two real roots)', '0 (Equal roots)', '-16'],
    correctAnswer: 0,
    explanation: 'Discriminant D = b^2 - 4ac = (-4)^2 - 4(2)(3) = 16 - 24 = -8. Since D < 0, the equation has no real roots.',
    ncertRef: 'NCERT Maths Ch 4, Pg 88'
  },

  // Maths Ch 7: Triangles
  {
    id: 'q-math-4',
    chapterId: 'math-ch7',
    subjectId: 'maths',
    type: 'mcq',
    question: 'In triangle ABC, DE || BC such that AD = 3 cm, DB = 5 cm, and AE = 4.5 cm. The length of EC is:',
    options: ['7.5 cm', '6.0 cm', '8.0 cm', '2.7 cm'],
    correctAnswer: 0,
    explanation: 'By Basic Proportionality Theorem (BPT), AD/DB = AE/EC => 3/5 = 4.5/EC => EC = (5 * 4.5) / 3 = 22.5 / 3 = 7.5 cm.',
    ncertRef: 'NCERT Maths Ch 7, Pg 124'
  },

  // Maths Ch 9: Trigonometry
  {
    id: 'q-math-5',
    chapterId: 'math-ch9',
    subjectId: 'maths',
    type: 'mcq',
    question: 'What is the value of (sin 30° + cos 60°) - (tan 45°)?',
    options: ['0', '1', '1/2', 'sqrt(3)'],
    correctAnswer: 0,
    explanation: 'sin 30° = 1/2, cos 60° = 1/2, tan 45° = 1. So (1/2 + 1/2) - 1 = 1 - 1 = 0.',
    ncertRef: 'NCERT Maths Ch 9, Pg 185'
  },

  // --- SOCIAL SCIENCE QUIZZES ---
  // History Ch 2: Nationalism in India
  {
    id: 'q-sst-1',
    chapterId: 'sst-ch2',
    subjectId: 'sst',
    type: 'mcq',
    question: 'Why did Mahatma Gandhi call off the Non-Cooperation Movement in February 1922?',
    options: [
      'Due to the violent Chauri Chaura incident where a police station was set on fire.',
      'Because the British accepted all Congress demands.',
      'Due to the arrest of Bhagat Singh.',
      'Because of the Jallianwala Bagh massacre.'
    ],
    correctAnswer: 0,
    explanation: 'In February 1922, at Chauri Chaura in Gorakhpur (UP), a peaceful demonstration turned violent resulting in the burning of a police station and death of 22 policemen. Gandhi felt the movement was turning violent and called it off.',
    ncertRef: 'NCERT History Ch 2, Pg 38'
  },

  // Geography Ch 1: Resources & Development
  {
    id: 'q-sst-2',
    chapterId: 'sst-ch1',
    subjectId: 'sst',
    type: 'mcq',
    question: 'Which type of soil is predominant in the Deccan Trap (Basalt region) and is ideal for growing Cotton?',
    options: ['Alluvial Soil', 'Black Soil (Regur)', 'Laterite Soil', 'Red and Yellow Soil'],
    correctAnswer: 1,
    explanation: 'Black soil, also known as Regur soil or Black Cotton soil, is formed from basalt rock weathering and is extremely fine, clayey, and rich in soil nutrients like calcium carbonate, magnesium, and potash.',
    ncertRef: 'NCERT Geography Ch 1, Pg 9'
  },

  // Civics Ch 1: Power Sharing
  {
    id: 'q-sst-3',
    chapterId: 'sst-ch9',
    subjectId: 'sst',
    type: 'mcq',
    question: 'Which city was chosen as the headquarters of the European Union due to its successful ethnic conflict accommodation model?',
    options: ['Brussels (Belgium)', 'Colombo (Sri Lanka)', 'Paris (France)', 'Geneva (Switzerland)'],
    correctAnswer: 0,
    explanation: 'Brussels in Belgium was chosen as the EU headquarters as a tribute to Belgium unique power-sharing arrangement among Dutch, French, and German speaking populations.',
    ncertRef: 'NCERT Civics Ch 1, Pg 5'
  },

  // --- ENGLISH QUIZ ---
  {
    id: 'q-eng-1',
    chapterId: 'eng-ch1',
    subjectId: 'english',
    type: 'mcq',
    question: 'In "A Letter to God", what did Lencho compare the raindrops falling from the sky to?',
    options: [
      'New silver coins (5-cent and 10-cent coins)',
      'Pearls from heaven',
      'Diamonds',
      'Golden nuggets'
    ],
    correctAnswer: 0,
    explanation: 'Lencho satisfiedly looked at the sky and called the big raindrops 10-cent pieces and the small ones 5-cent pieces, as they promised a prosperous harvest.',
    ncertRef: 'NCERT First Flight Ch 1, Pg 4'
  }
];
