import { FormulaCard } from '../types';

export const INITIAL_FORMULA_CARDS: FormulaCard[] = [
  // ================= SCIENCE FORMULAS & EQUATIONS =================
  {
    id: 'f-1',
    subjectId: 'science',
    unitName: 'Unit I: Chemical Substances',
    chapterTitle: 'Chemical Reactions',
    title: 'Decomposition of Lead Nitrate',
    content: '2Pb(NO3)2 (s) --Heat--> 2PbO (s) [Yellow] + 4NO2 (g) [Brown Fumes] + O2 (g)',
    explanation: 'Thermal decomposition of lead nitrate releases characteristic brown nitrogen dioxide (NO2) fumes and leaves a yellow residue of Lead Oxide (PbO).',
    isImportant: true
  },
  {
    id: 'f-2',
    subjectId: 'science',
    unitName: 'Unit IV: Effects of Current',
    chapterTitle: 'Electricity',
    title: 'Ohm Law & Resistance Formulae',
    content: 'V = I * R  |  R = ρ * (L / A)  |  R_series = R1 + R2 + ...  |  1/R_parallel = 1/R1 + 1/R2 + ...',
    explanation: 'Resistance is directly proportional to conductor length (L), inversely proportional to cross-sectional area (A), and depends on material resistivity (ρ).',
    isImportant: true
  },
  {
    id: 'f-3',
    subjectId: 'science',
    unitName: 'Unit III: Natural Phenomena',
    chapterTitle: 'Light - Reflection & Refraction',
    title: 'Mirror & Lens Formulae',
    content: 'Mirror: 1/f = 1/v + 1/u (m = -v/u)  |  Lens: 1/f = 1/v - 1/u (m = v/u)  |  P = 1/f(m) Dioptres',
    explanation: 'Cartesian Sign Convention: Object distance u is ALWAYS negative (-u). Concave focal length f is negative; Convex focal length f is positive.',
    isImportant: true
  },
  {
    id: 'f-4',
    subjectId: 'science',
    unitName: 'Unit I: Chemical Substances',
    chapterTitle: 'Acids, Bases & Salts',
    title: 'Important Common Salt Derivatives',
    content: 'Bleaching Powder: CaOCl2 | Baking Soda: NaHCO3 | Washing Soda: Na2CO3.10H2O | Plaster of Paris: CaSO4.1/2 H2O',
    explanation: 'Plaster of Paris sets into hard Gypsum (CaSO4.2H2O) when mixed with water: CaSO4.1/2H2O + 1.5 H2O -> CaSO4.2H2O.',
    isImportant: true
  },

  // ================= MATHEMATICS FORMULAS =================
  {
    id: 'f-5',
    subjectId: 'maths',
    unitName: 'Unit II: Algebra',
    chapterTitle: 'Quadratic Equations & Polynomials',
    title: 'Quadratic Formula & Discriminant Analysis',
    content: 'x = [-b ± √(b² - 4ac)] / 2a  |  Discriminant D = b² - 4ac  |  α + β = -b/a  |  α * β = c/a',
    explanation: 'D > 0: Two distinct real roots. D = 0: Two equal real roots. D < 0: No real roots.',
    isImportant: true
  },
  {
    id: 'f-6',
    subjectId: 'maths',
    unitName: 'Unit V: Trigonometry',
    chapterTitle: 'Trigonometric Identities & Values',
    title: 'Fundamental Trigonometric Identities',
    content: 'sin²θ + cos²θ = 1  |  1 + tan²θ = sec²θ  |  1 + cot²θ = cosec²θ  |  tanθ = sinθ/cosθ',
    explanation: 'Standard angles: sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2, tan 30° = 1/√3, tan 45° = 1, tan 60° = √3.',
    isImportant: true
  },
  {
    id: 'f-7',
    subjectId: 'maths',
    unitName: 'Unit II: Algebra',
    chapterTitle: 'Arithmetic Progressions',
    title: 'Arithmetic Progression nth Term & Sum',
    content: 'a_n = a + (n - 1)d  |  S_n = (n/2)[2a + (n - 1)d]  |  S_n = (n/2)[a + l]',
    explanation: 'a = first term, d = common difference, n = number of terms, l = last term = a_n.',
    isImportant: true
  },
  {
    id: 'f-8',
    subjectId: 'maths',
    unitName: 'Unit VII: Statistics & Probability',
    chapterTitle: 'Statistics Formulae',
    title: 'Empirical Relationship in Statistics',
    content: '3 * Median = Mode + 2 * Mean  |  Mode = l + [(f1 - f0) / (2f1 - f0 - f2)] * h',
    explanation: 'Empirical formula connects Mean, Median, and Mode for moderately skewed frequency distributions.',
    isImportant: true
  },

  // ================= SOCIAL SCIENCE REVISION =================
  {
    id: 'f-9',
    subjectId: 'sst',
    unitName: 'History',
    chapterTitle: 'Nationalism in India',
    title: 'Freedom Struggle Chronology',
    content: '1919: Rowlatt Act & Jallianwala Bagh | 1920: Non-Cooperation Movement | 1930: Dandi Salt March | 1931: Gandhi-Irwin Pact',
    explanation: 'Key timeline dates frequently evaluated in 5-mark chronological & map work board questions.',
    isImportant: true
  },
  {
    id: 'f-10',
    subjectId: 'sst',
    unitName: 'Political Science',
    chapterTitle: 'Federalism',
    title: 'Three-Fold Legislative Distribution',
    content: 'Union List (97 subjects: Defence, Banking) | State List (66 subjects: Police, Trade) | Concurrent List (47 subjects: Education, Forest)',
    explanation: 'Residuary subjects (e.g., Computer Software, AI) fall under the Union Government legislative power.',
    isImportant: false
  },

  // ================= HINDI LANGUAGE GRAMMAR (व्याकरण) =================
  {
    id: 'f-hin-1',
    subjectId: 'hindi',
    unitName: 'हिंदी व्याकरण (Hindi Grammar)',
    chapterTitle: 'पदबंध (Padbandh)',
    title: 'पदबंध के प्रकार एवं पहचान के नियम',
    content: '1. संज्ञा पदबंध  2. सर्वनाम पदबंध  3. विशेषण पदबंध  4. क्रिया पदबंध  5. क्रिया-विशेषण (अव्यय) पदबंध',
    explanation: 'पदबंध जब दो या दो से अधिक पद मिलकर एक व्याकरणिक इकाई का कार्य करते हैं। उदाहरण: "अयोध्या के राजा राम" (संज्ञा पदबंध)। मुख्य पद जिस पर अंतिम पद समाप्त होता है, वही पदबंध का प्रकार तय करता है।',
    isImportant: true
  },
  {
    id: 'f-hin-2',
    subjectId: 'hindi',
    unitName: 'हिंदी व्याकरण (Hindi Grammar)',
    chapterTitle: 'वाक्य भेद (रचना के आधार पर)',
    title: 'सरल, संयुक्त एवं मिश्र वाक्य रूपांतरण',
    content: '• सरल वाक्य: एक मुख्य क्रिया (उदा. राम पढ़ता है)\n• संयुक्त वाक्य: समुच्चयबोधक अव्यय से जुड़े (और, तथा, परंतु, इसलिए, या)\n• मिश्र वाक्य: एक मुख्य उपवाक्य + आश्रित उपवाक्य (कि, जो, क्योंकि, जैसे ही...वैसे ही)',
    explanation: 'सीबीएसई बोर्ड परीक्षा में वाक्य रूपांतरण के नियम: संयुक्त वाक्य में दो स्वतंत्र वाक्य "और/तथा" से जुड़ते हैं, जबकि मिश्र वाक्य में "कि/जिसने/जब-तब" का प्रयोग होता है।',
    isImportant: true
  },
  {
    id: 'f-hin-3',
    subjectId: 'hindi',
    unitName: 'हिंदी व्याकरण (Hindi Grammar)',
    chapterTitle: 'समास (Samas)',
    title: 'समास के छः भेद एवं पहचान',
    content: '1. अव्ययीभाव (पहला पद प्रधान व अव्यय: यथाशक्ति)\n2. तत्पुरुष (कारक चिह्नों का लोप: राजपुत्र)\n3. द्विगु (पहला पद संख्यावाचक: चौराहा)\n4. द्वंद्व (दोनों पद प्रधान: माता-पिता)\n5. कर्मधारय (विशेषण-विशेष्य/उपमान-उपमेय: नीलकंठ = नीला कंठ)\n6. बहुव्रीहि (तीसरा अर्थ प्रधान: नीलकंठ = शिव)',
    explanation: 'सीबीएसई परीक्षा टिप: कर्मधारय और बहुव्रीहि में अंतर विग्रह से स्पष्ट होता है। नीलकंठ (नीला है जो कंठ = कर्मधारय), नीलकंठ (नीला कंठ है जिसका अर्थात शिव = बहुव्रीहि)।',
    isImportant: true
  },
  {
    id: 'f-hin-4',
    subjectId: 'hindi',
    unitName: 'हिंदी व्याकरण (Hindi Grammar)',
    chapterTitle: 'मुहावरे (Muhavare)',
    title: 'बोर्ड परीक्षा के महत्वपूर्ण मुहावरे',
    content: '• अंगूठा दिखाना = ऐन वक्त पर मना करना\n• अंधों में काना राजा = अज्ञानियों में अल्पज्ञानी का आदर\n• ईंट का जवाब पत्थर से देना = कड़ा मुकाबला करना\n• गागर में सागर भरना = थोड़े में बहुत कहना\n• नौ दो ग्यारह होना = भाग जाना',
    explanation: 'सीबीएसई बोर्ड में मुहावरे पाठ्यपुस्तक (स्पर्श/क्षितिज) के संदर्भ से पूछे जाते हैं। वाक्य प्रयोग में मुहावरे का ही प्रयोग करें, उसके अर्थ का नहीं।',
    isImportant: true
  },

  // ================= ENGLISH GRAMMAR & WRITING SKILLS =================
  {
    id: 'f-eng-1',
    subjectId: 'english',
    unitName: 'Grammar & Writing Skills',
    chapterTitle: 'Reported Speech Rules',
    title: 'Direct to Indirect Speech Conversion Rules',
    content: '• Simple Present -> Simple Past | Present Cont -> Past Cont | Present Perf -> Past Perf\n• Simple Past -> Past Perfect | Will/Shall -> Would/Should | Can/May -> Could/Might\n• Today -> That day | Tomorrow -> The next day | Here -> There',
    explanation: 'Universal Truths do NOT change tense! e.g., The teacher said, "The earth revolves around the sun" -> The teacher said that the earth revolves around the sun.',
    isImportant: true
  },
  {
    id: 'f-eng-2',
    subjectId: 'english',
    unitName: 'Grammar & Writing Skills',
    chapterTitle: 'Subject-Verb Concord',
    title: 'Subject-Verb Agreement Key Golden Rules',
    content: '1. Either/Neither + Singular Noun takes Singular Verb (e.g., Neither of the boys is present).\n2. Subject with "along with / as well as" agrees with FIRST subject.\n3. Plural amount/distance treated as a single unit takes Singular verb (e.g., Ten kilometers is a long distance).',
    explanation: 'If subjects are joined by "Either...or / Neither...nor", the verb agrees with the subject CLOSER to it.',
    isImportant: true
  },
  {
    id: 'f-eng-3',
    subjectId: 'english',
    unitName: 'Grammar & Writing Skills',
    chapterTitle: 'Analytical Paragraph Format',
    title: 'Analytical Paragraph Writing Template (100-120 Words)',
    content: '• Introduction: "The given pie-chart/bar-graph illustrates the trend of..."\n• Body Paragraph: "It is apparent from the data that the highest percentage was recorded in... whereas a sharp drop occurred in..."\n• Conclusion: "Overall, it can be inferred that..."',
    explanation: 'CBSE 5-mark marking scheme allocates 2 marks for Content, 2 marks for Organization, and 1 mark for Accuracy.',
    isImportant: true
  },

  // ================= SANSKRIT GRAMMAR (संस्कृत व्याकरण) =================
  {
    id: 'f-san-1',
    subjectId: 'hindi',
    unitName: 'संस्कृत/अन्य भाषा व्याकरण',
    chapterTitle: 'संस्कृत संधि एवं कारक',
    title: 'स्वर संधि एवं विसर्ग संधि नियम',
    content: '• दीर्घ संधि: अ/आ + अ/आ = आ (देव + आलयः = देवालयः)\n• गुण संधि: अ/आ + इ/ई = ए (गज + इन्द्रः = गजेन्द्रः)\n• विसर्ग संधि: विसर्गस्य उत्वम् (रामः + अयम् = रामोऽयम्)',
    explanation: 'संस्कृत बोर्ड परीक्षा प्रश्न पत्र में संधि-विच्छेद एवं कारक-विभक्ति (अभितः, परितः, समयः, निकषा, प्रति योगे द्वितीया) पर आधारित प्रश्न पूछे जाते हैं।',
    isImportant: false
  },

  // ================= ARTIFICIAL INTELLIGENCE (AI Code 417) & IT QUICK NOTES =================
  {
    id: 'f-ai-1',
    subjectId: 'cs',
    unitName: 'AI Subject Code 417',
    chapterTitle: 'Introduction to AI & Ethics',
    title: 'AI vs Machine Learning vs Deep Learning Hierarchy',
    content: 'Artificial Intelligence (Broadest) ⊃ Machine Learning (Algorithms that learn from data) ⊃ Deep Learning (Multi-layer Artificial Neural Networks)',
    explanation: 'AI Ethics Principles: AI Bias (Data bias), Data Privacy, Inclusivity, Transparency, and Accountability. Smart Cities use IoT and AI for resource management.',
    isImportant: true
  },
  {
    id: 'f-ai-2',
    subjectId: 'cs',
    unitName: 'AI Subject Code 417',
    chapterTitle: 'AI Project Cycle',
    title: '5 Stages of AI Project Cycle',
    content: '1. Problem Scoping (4Ws Canvas: Who, What, Where, Why)\n2. Data Acquisition (Data sources, web scraping, surveys)\n3. Data Exploration (Visualizing data with graphs/charts)\n4. Modelling (Rule-based vs Data-driven ML approaches)\n5. Evaluation (Testing model on unseen test dataset)',
    explanation: 'Problem Scoping uses 4Ws canvas to define the precise problem statement before building any AI solution.',
    isImportant: true
  },
  {
    id: 'f-ai-3',
    subjectId: 'cs',
    unitName: 'AI Subject Code 417',
    chapterTitle: 'Computer Vision (CV)',
    title: 'Computer Vision Concepts & Image Processing',
    content: '• Pixel: Smallest element of digital image.\n• Grayscale (0-255) vs RGB Color Space (Red, Green, Blue 0-255 each)\n• Image Features: Edges, Corners, Colors, Textures\n• Applications: Facial Recognition, Self-driving cars, Medical imaging',
    explanation: 'An RGB image has 3 color channels. Resolution is expressed as Width × Height pixels.',
    isImportant: true
  },
  {
    id: 'f-ai-4',
    subjectId: 'cs',
    unitName: 'AI Subject Code 417',
    chapterTitle: 'Natural Language Processing (NLP)',
    title: 'NLP Pipeline & Text Normalization Steps',
    content: '1. Sentence Segmentation  2. Tokenization (Breaking text into words)\n3. Removing Stopwords (a, an, the, in, on)\n4. Converting to Lowercase\n5. Stemming (Chopping suffixes) vs Lemmatization (Root dictionary word)\n6. Bag of Words (BoW) & TF-IDF Vectorization',
    explanation: 'Stemming might produce non-words (e.g. "caring" -> "car"), whereas Lemmatization produces valid dictionary words (e.g. "caring" -> "care").',
    isImportant: true
  },
  {
    id: 'f-ai-5',
    subjectId: 'cs',
    unitName: 'AI Subject Code 417',
    chapterTitle: 'AI Model Evaluation',
    title: 'Confusion Matrix & Metric Calculation Formulae',
    content: '• Accuracy = (TP + TN) / (TP + TN + FP + FN)\n• Precision = TP / (TP + FP)\n• Recall (Sensitivity) = TP / (TP + FN)\n• F1-Score = 2 * (Precision * Recall) / (Precision + Recall)',
    explanation: 'TP = True Positive, TN = True Negative, FP = False Positive (Type I Error), FN = False Negative (Type II Error). Use High Precision when False Positives are costly (e.g. Spam detection). Use High Recall when False Negatives are costly (e.g. Fire alarm / Medical Diagnosis).',
    isImportant: true
  }
];
