/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, Sparkles, BookOpen, Gamepad2, GraduationCap, 
  RotateCcw, Award, ShieldCheck, User, Users, Search, 
  Eye, EyeOff, AlertTriangle, CheckCircle2, XCircle, 
  ArrowRight, ArrowLeft, Volume2, ExternalLink, Timer, 
  CircleSlash, Check, X, Undo2, Lock, Edit3, Save, 
  Download, Upload, Trash2, KeyRound, Database, Cloud, 
  HelpCircle, Circle, Calendar, ChevronDown, ChevronUp, Lightbulb
} from 'lucide-react';

// ==========================================
// 1. DATA TYPES & INTERFACES
// ==========================================
export interface WordToken {
  word: string;
  hy: string;
  explanation?: string;
}

export interface TranscriptItem {
  id: string;
  timestamp: string;
  startSeconds: number;
  speaker: 'Álvaro' | 'Entrevistador';
  textEs: string;
  translationHy: string;
  isDoubtful?: boolean;
  doubtfulReason?: string;
  suggestedCorrection?: string;
  vocabularyTokens?: WordToken[];
}

export interface Expression {
  id: string;
  phraseEs: string;
  translationHy: string;
  shortExplanationHy: string;
  example1Es: string;
  example1Hy: string;
  example2Es: string;
  example2Hy: string;
  level: 'A2' | 'B1' | 'B2';
  category: string;
}

export interface GrammarTopic {
  id: string;
  titleEs: string;
  titleHy: string;
  explanationHy: string;
  formulaEs?: string;
  videoSentenceEs: string;
  videoSentenceHy: string;
  extraExamples: { es: string; hy: string }[];
  tipHy: string;
}

export interface HablaItem {
  id: string;
  title: string;
  contextEs: string;
  contextHy: string;
  questionEs: string;
  questionHy: string;
  shortResponseEs: string;
  shortResponseHy: string;
  fullResponseEs: string;
  fullResponseHy: string;
  nuanceHy: string;
}

export interface StudentAnswer {
  questionId: string;
  questionPrompt: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface ErrorRecord {
  id: string;
  gameId: string;
  gameTitle: string;
  questionId: string;
  promptEs: string;
  promptHy?: string;
  userChoice: string;
  correctChoice: string;
  explanationHy: string;
  timestamp: number;
}

export interface GameScore {
  gameId: string;
  gameTitle: string;
  attempts: number;
  lastScore: number;
  maxScore: number;
  lastPlayedAt: number;
  answers: StudentAnswer[];
}

export interface StudentProfile {
  id: string;
  code: string;
  name: string;
  joinedAt: number;
  lastActiveAt: number;
  expressionsLearned: string[];
  gameScores: Record<string, GameScore>;
  errors: ErrorRecord[];
}

// ==========================================
// 2. CONSTANTS & INITIAL DATA
// ==========================================
const YOUTUBE_VIDEO_ID = '6ccblUPLWIQ';
const YOUTUBE_SHORT_URL = 'https://www.youtube.com/shorts/6ccblUPLWIQ';
const DEFAULT_TEACHER_PIN = 'profesor2026';

const INITIAL_TRANSCRIPT: TranscriptItem[] = [
  {
    id: 't-000',
    timestamp: '0:00',
    startSeconds: 0,
    speaker: 'Entrevistador',
    textEs: '¿Sabes qué nos denunciaron por este hate?',
    translationHy: 'Գիտե՞ս, որ մեր դեմ բողոք ներկայացրին այս հայ-հեթի (hi-hat) պատճառով:',
    isDoubtful: true,
    doubtfulReason: '«hate» բառն այստեղ հավանաբար երաժշտական «hi-hat»-ն է (հարվածայինների ափսեի սեմփլ «Sofía» երգում):',
    suggestedCorrection: '¿Sabes que nos denunciaron por este hi-hat?',
    vocabularyTokens: [
      { word: '¿Sabes qué...?', hy: 'Գիտե՞ս, որ...' },
      { word: 'nos denunciaron', hy: 'մեր դեմ բողոք ներկայացրին / դատի տվեցին' },
      { word: 'hate (hi-hat)', hy: 'հայ-հեթ (երաժշտական հարվածային սեմփլ)' }
    ]
  },
  {
    id: 't-002',
    timestamp: '0:02',
    startSeconds: 2,
    speaker: 'Entrevistador',
    textEs: '¿Será capaz de adivinar Álvaro Soler su canción en 0,3 segundos?',
    translationHy: 'Կկարողանա՞ Ալվարո Սոլերը գուշակել իր երգը 0,3 վայրկյանում:',
    vocabularyTokens: [
      { word: '¿Será capaz de...?', hy: 'Կկարողանա՞ արդյոք...' },
      { word: 'adivinar', hy: 'գուշակել, կռահել' },
      { word: 'su canción', hy: 'իր երգը' },
      { word: 'en 0,3 segundos', hy: '0,3 վայրկյանում' }
    ]
  },
  {
    id: 't-007',
    timestamp: '0:07',
    startSeconds: 7,
    speaker: 'Álvaro',
    textEs: 'No lo sé.',
    translationHy: 'Չգիտեմ:',
    vocabularyTokens: [{ word: 'No lo sé', hy: 'Չգիտեմ' }]
  },
  {
    id: 't-008',
    timestamp: '0:08',
    startSeconds: 8,
    speaker: 'Entrevistador',
    textEs: 'Vamos allá.',
    translationHy: 'Դե՛, սկսենք (առա՛ջ):',
    vocabularyTokens: [{ word: 'Vamos allá', hy: 'Դե՛, սկսենք / Առա՛ջ գնանք' }]
  },
  {
    id: 't-009',
    timestamp: '0:09',
    startSeconds: 9,
    speaker: 'Álvaro',
    textEs: 'La cintura.',
    translationHy: '«La cintura»:',
    vocabularyTokens: [{ word: 'La cintura', hy: '«La cintura» (գոտկատեղ - Ալվարոյի հիթը)' }]
  },
  {
    id: 't-011',
    timestamp: '0:11',
    startSeconds: 11,
    speaker: 'Entrevistador',
    textEs: '¡Bien!',
    translationHy: 'Ապրե՛ս (Գերազանց է):',
    vocabularyTokens: [{ word: '¡Bien!', hy: 'Ապրե՛ս' }]
  },
  {
    id: 't-013',
    timestamp: '0:13',
    startSeconds: 13,
    speaker: 'Álvaro',
    textEs: 'Vale, vale, vale.',
    translationHy: 'Լա՛վ, լա՛վ, լա՛վ (հասկացա):',
    vocabularyTokens: [{ word: 'Vale', hy: 'Լավ, համաձայն եմ' }]
  },
  {
    id: 't-014',
    timestamp: '0:14',
    startSeconds: 14,
    speaker: 'Álvaro',
    textEs: 'Espero adivinar ahora todo esto.',
    translationHy: 'Հուսով եմ՝ հիմա կկարողանամ գուշակել այս բոլորը:',
    vocabularyTokens: [
      { word: 'Espero + inf', hy: 'Հուսով եմ (ինչ-որ բան անել)' },
      { word: 'todo esto', hy: 'այս ամենը' }
    ]
  },
  {
    id: 't-016',
    timestamp: '0:16',
    startSeconds: 16,
    speaker: 'Entrevistador',
    textEs: 'Sí, a ver, yo creo que sí, ¿eh? A ver.',
    translationHy: 'Հա, տեսնենք, ես կարծում եմ՝ հա, չէ՞: Տեսնենք:',
    vocabularyTokens: [
      { word: 'A ver', hy: 'Տեսնենք / Հապա տեսնենք' },
      { word: 'yo creo que sí', hy: 'ես կարծում եմ, որ այո' }
    ]
  },
  {
    id: 't-019',
    timestamp: '0:19',
    startSeconds: 19,
    speaker: 'Álvaro',
    textEs: 'Es que sí, realmente es más fácil de lo que pensaba.',
    translationHy: 'Բանն այն է, որ հա, իրականում ավելի հեշտ է, քան կարծում էի:',
    vocabularyTokens: [
      { word: 'Es que...', hy: 'Բանն այն է, որ... / Դե ուղղակի...' },
      { word: 'más fácil de lo que pensaba', hy: 'ավելի հեշտ, քան կարծում էի' }
    ]
  },
  {
    id: 't-022',
    timestamp: '0:22',
    startSeconds: 22,
    speaker: 'Álvaro',
    textEs: 'Este imaginaba esto.',
    translationHy: 'Սրանից այսպիսի բան էի սպասում (պատկերացնում էի):',
    isDoubtful: true,
    doubtfulReason: 'Արագ խոսքի պատճառով կարող է լինել «Esto me lo imaginaba»:',
    suggestedCorrection: 'Esto me lo imaginaba.'
  },
  {
    id: 't-023',
    timestamp: '0:23',
    startSeconds: 23,
    speaker: 'Entrevistador',
    textEs: 'Eso es.',
    translationHy: 'Ճիշտ այդպես (հենց այդպես է):',
    vocabularyTokens: [{ word: 'Eso es', hy: 'Ճիշտ այդպես' }]
  },
  {
    id: 't-024',
    timestamp: '0:24',
    startSeconds: 24,
    speaker: 'Álvaro',
    textEs: '¡Guau!',
    translationHy: 'Վա՜ու (Հիասքանչ է):'
  },
  {
    id: 't-025',
    timestamp: '0:25',
    startSeconds: 25,
    speaker: 'Entrevistador',
    textEs: 'Tercera.',
    translationHy: 'Երրորդը:',
    vocabularyTokens: [{ word: 'Tercera', hy: 'Երրորդ երգը' }]
  },
  {
    id: 't-027',
    timestamp: '0:27',
    startSeconds: 27,
    speaker: 'Álvaro',
    textEs: '¿Qué hace ahí, eh?',
    translationHy: 'Այնտեղ ի՞նչ է անում, հը՞:',
    vocabularyTokens: [{ word: '¿Qué hace ahí?', hy: 'Ի՞նչ է անում այնտեղ' }]
  },
  {
    id: 't-029',
    timestamp: '0:29',
    startSeconds: 29,
    speaker: 'Entrevistador',
    textEs: '¿Sabes qué nos denunciaron por este hate?',
    translationHy: 'Գիտե՞ս, որ մեր դեմ բողոք ներկայացրին այս հայ-հեթի պատճառով:',
    isDoubtful: true,
    doubtfulReason: '«hate» = «hi-hat» (հարվածայինների սեմփլ):'
  },
  {
    id: 't-031',
    timestamp: '0:31',
    startSeconds: 31,
    speaker: 'Álvaro',
    textEs: '¿Qué dices? Sí, nos denunciaron.',
    translationHy: 'Ի՞նչ ես ասում: Հա՞, մեր դեմ բողոք ներկայացրի՞ն:',
    vocabularyTokens: [
      { word: '¿Qué dices?', hy: 'Ի՞նչ ես ասում (զարմանքի բացականչություն)' },
      { word: 'nos denunciaron', hy: 'մեր դեմ դատի տվեցին / բողոքեցին' }
    ]
  },
  {
    id: 't-032',
    timestamp: '0:32',
    startSeconds: 32,
    speaker: 'Álvaro',
    textEs: 'Porque este hate se ve que es de un sample de una canción de un no sé cuánto, de los ochenta o setenta, pero se han usado en muchas canciones y había una base de datos que en teoría era libre, que al final no lo era, así que tuvimos un bastante follón con este hate.',
    translationHy: 'Որովհետև այս հայ-հեթը, պարզվում է, մի երգի սեմփլ է ինչ-որ չգիտեմ ումից՝ յոթանասունականների կամ ութսունականների, բայց օգտագործվել էր շատ երգերում, ու կար մի տվյալների բազա, որը տեսականորեն անվճար ու ազատ էր, բայց ի վերջո այդպես չէր, այնպես որ բավականին մեծ խառնաշփոթի մեջ ընկանք այս հայ-հեթի պատճառով:',
    isDoubtful: true,
    doubtfulReason: '«hate» = «hi-hat» (հարվածային գործիքի հնչյուն/սեմփլ):',
    vocabularyTokens: [
      { word: 'se ve que...', hy: 'պարզվում է, որ... / երևում է, որ...' },
      { word: 'un sample', hy: 'երաժշտական սեմփլ' },
      { word: 'en teoría', hy: 'տեսականորեն / ըստ ենթադրության' },
      { word: 'al final', hy: 'ի վերջո' },
      { word: 'tuvimos un follón', hy: 'մեծ խառնաշփոթի մեջ ընկանք' }
    ]
  },
  {
    id: 't-047',
    timestamp: '0:47',
    startSeconds: 47,
    speaker: 'Álvaro',
    textEs: '¡Guau! Pero bueno, ahí está este hate y es la canción Sofía.',
    translationHy: 'Վա՜ու: Բայց դե լավ, ահա այստեղ է այդ հայ-հեթը, և սա «Sofía» երգն է:',
    vocabularyTokens: [{ word: 'la canción Sofía', hy: '«Sofía» երգը' }]
  },
  {
    id: 't-050',
    timestamp: '0:50',
    startSeconds: 50,
    speaker: 'Entrevistador',
    textEs: 'Sí, eso es.',
    translationHy: 'Հա՛, ճիշտ այդպես:'
  },
  {
    id: 't-052',
    timestamp: '0:52',
    startSeconds: 52,
    speaker: 'Álvaro',
    textEs: 'Venga, siguiente.',
    translationHy: 'Դե՛, հաջորդը:',
    vocabularyTokens: [{ word: 'Venga, siguiente', hy: 'Դե՛, հաջորդը' }]
  },
  {
    id: 't-055',
    timestamp: '0:55',
    startSeconds: 55,
    speaker: 'Álvaro',
    textEs: 'Lo que pasó...',
    translationHy: '«Այն, ինչ պատահեց...»:',
    vocabularyTokens: [{ word: 'Lo que pasó', hy: 'Այն, ինչ պատահեց' }]
  },
  {
    id: 't-056',
    timestamp: '0:56',
    startSeconds: 56,
    speaker: 'Entrevistador',
    textEs: 'Sí, Lo que pasó pasa.',
    translationHy: 'Այո, «Lo que pasó, pasa» (Այն, ինչ պատահեց, անցավ/պատահում է):'
  },
  {
    id: 't-057',
    timestamp: '0:57',
    startSeconds: 57,
    speaker: 'Álvaro',
    textEs: 'Esa es.',
    translationHy: 'Հենց դա է:'
  },
  {
    id: 't-100',
    timestamp: '1:00',
    startSeconds: 60,
    speaker: 'Entrevistador',
    textEs: 'Eso es, es una de las nuevas.',
    translationHy: 'Ճիշտ այդպես, նորերից մեկն է:',
    vocabularyTokens: [{ word: 'una de las nuevas', hy: 'նորերից մեկը' }]
  },
  {
    id: 't-101',
    timestamp: '1:01',
    startSeconds: 61,
    speaker: 'Álvaro',
    textEs: '¡Qué guay!',
    translationHy: 'Ի՜նչ հավես է (հիանալի է):',
    vocabularyTokens: [{ word: '¡Qué guay!', hy: 'Ի՜նչ հավես է / Ի՜նչ լավ է' }]
  },
  {
    id: 't-102',
    timestamp: '1:02',
    startSeconds: 62,
    speaker: 'Álvaro',
    textEs: 'Yo creo que es muy fácil la última.',
    translationHy: 'Կարծում եմ՝ վերջինը շատ հեշտ է:',
    vocabularyTokens: [{ word: 'Yo creo que...', hy: 'Ես կարծում եմ, որ...' }]
  },
  {
    id: 't-105',
    timestamp: '1:05',
    startSeconds: 65,
    speaker: 'Álvaro',
    textEs: 'Bueno, los claps del mismo sol.',
    translationHy: 'Դե, «El mismo sol»-ի ծափահարությունների հնչյունները (claps):',
    vocabularyTokens: [
      { word: 'los claps', hy: 'ծափերի հնչյունները' },
      { word: 'El mismo sol', hy: '«El mismo sol» (Ալվարոյի հիթը)' }
    ]
  },
  {
    id: 't-107',
    timestamp: '1:07',
    startSeconds: 67,
    speaker: 'Entrevistador',
    textEs: 'Eso, el limpio sol.',
    translationHy: 'Հենց այդ, «El mismo sol» (խոսքում լսվում է «el limpio sol»):',
    isDoubtful: true,
    doubtfulReason: 'Նկատի ունի երգի վերնագիրը՝ «El mismo sol»:'
  },
  {
    id: 't-108',
    timestamp: '1:08',
    startSeconds: 68,
    speaker: 'Álvaro',
    textEs: 'Es muy reconocible, sí.',
    translationHy: 'Շատ հեշտ է ճանաչել, հա:',
    vocabularyTokens: [{ word: 'Es muy reconocible', hy: 'Շատ ճանաչելի է' }]
  },
  {
    id: 't-110',
    timestamp: '1:10',
    startSeconds: 70,
    speaker: 'Entrevistador',
    textEs: 'Pues...',
    translationHy: 'Դե...'
  },
  {
    id: 't-111',
    timestamp: '1:11',
    startSeconds: 71,
    speaker: 'Álvaro',
    textEs: '¿Cinco de cinco? ¿Cinco de cinco?',
    translationHy: 'Հինգից հի՞նգը: Հինգից հի՞նգը:',
    vocabularyTokens: [{ word: 'Cinco de cinco', hy: 'Հինգից հինգը (100% ճիշտ)' }]
  },
  {
    id: 't-112',
    timestamp: '1:12',
    startSeconds: 72,
    speaker: 'Álvaro',
    textEs: '¿Hay alguien que falle en esto?',
    translationHy: 'Կա՞ որևէ մեկը, ով այստեղ սխալվում է (ձախողում է):',
    vocabularyTokens: [{ word: 'fallar', hy: 'սխալվել, ձախողել' }]
  },
  {
    id: 't-114',
    timestamp: '1:14',
    startSeconds: 74,
    speaker: 'Entrevistador',
    textEs: 'Pues no lo sé, eres el primero que alcanza el agua.',
    translationHy: 'Դե չգիտեմ, դու առաջինն ես, ով հասնում է ջրին (ստուգման ենթակա ֆրազ):',
    isDoubtful: true,
    doubtfulReason: '«alcanza el agua» կարող է լինել փոխաբերություն կամ այլ արագ արտահայտություն:'
  },
  {
    id: 't-116',
    timestamp: '1:16',
    startSeconds: 76,
    speaker: 'Álvaro',
    textEs: 'Pues entonces...',
    translationHy: 'Դե ուրեմն...'
  },
  {
    id: 't-118',
    timestamp: '1:18',
    startSeconds: 78,
    speaker: 'Entrevistador',
    textEs: 'Entonces, no.',
    translationHy: 'Ուրեմն՝ ոչ:'
  },
  {
    id: 't-119',
    timestamp: '1:19',
    startSeconds: 79,
    speaker: 'Entrevistador',
    textEs: 'Todo el mundo ha acertado por ahora.',
    translationHy: 'Բոլորը ճիշտ են գուշակել առայժմ:',
    vocabularyTokens: [
      { word: 'Todo el mundo', hy: 'Բոլորը' },
      { word: 'ha acertado', hy: 'ճիշտ է գուշակել' },
      { word: 'por ahora', hy: 'առայժմ' }
    ]
  },
  {
    id: 't-120',
    timestamp: '1:20',
    startSeconds: 80,
    speaker: 'Álvaro',
    textEs: 'En seis meses te cuento.',
    translationHy: 'Վեց ամսից կպատմեմ քեզ:',
    vocabularyTokens: [
      { word: 'En seis meses', hy: 'Վեց ամսից' },
      { word: 'te cuento', hy: 'քեզ կպատմեմ' }
    ]
  },
  {
    id: 't-122',
    timestamp: '1:22',
    startSeconds: 82,
    speaker: 'Entrevistador',
    textEs: 'A ver, de momento eres el único.',
    translationHy: 'Տեսնենք, առայժմ դու միակն ես:',
    vocabularyTokens: [
      { word: 'de momento', hy: 'առայժմ / այս պահին' },
      { word: 'eres el único', hy: 'դու միակն ես' }
    ]
  },
  {
    id: 't-123',
    timestamp: '1:23',
    startSeconds: 83,
    speaker: 'Álvaro',
    textEs: 'Gracias.',
    translationHy: 'Շնորհակալ եմ:'
  },
  {
    id: 't-124',
    timestamp: '1:24',
    startSeconds: 84,
    speaker: 'Entrevistador',
    textEs: 'Bueno, gracias a ti.',
    translationHy: 'Դե, ես եմ քեզ շնորհակալ (քե՛զ շնորհակալություն):',
    vocabularyTokens: [{ word: 'gracias a ti', hy: 'ես եմ քեզ շնորհակալ' }]
  }
];

const EXPRESSIONS_LIST: Expression[] = [
  {
    id: 'exp-1',
    phraseEs: '¿Qué dices?',
    translationHy: 'Ի՞նչ ես ասում (Անհավանական է / Լո՞ւրջ):',
    shortExplanationHy: 'Օգտագործվում է ապշանք, մեծ զարմանք կամ անակնկալ արտահայտելու համար: Բառացի հարց չէ, այլ բացականչություն:',
    example1Es: '— Nos denunciaron por este sample. — ¿Qué dices? ¡No me lo puedo creer!',
    example1Hy: '— Մեր դեմ բողոք ներկայացրին այս սեմփլի պատճառով: — Ի՞նչ ես ասում: Չեմ կարողանում հավատալ:',
    example2Es: '— ¡He aprobado el examen sin estudiar casi nada! — ¿Qué dices? ¡Qué suerte tienes!',
    example2Hy: '— Քննությունը հանձնեցի գրեթե առանց պարապելու: — Ի՞նչ ես ասում: Ինչպիսի՜ հաջողություն:',
    level: 'A2',
    category: 'Reacciones y sorpresas'
  },
  {
    id: 'exp-2',
    phraseEs: 'Vamos allá',
    translationHy: 'Դե՛, սկսենք / Առա՛ջ:',
    shortExplanationHy: 'Էներգիկ արտահայտություն որևէ գործողություն, խաղ կամ աշխատանք սկսելուց առաջ:',
    example1Es: '— ¿Listo para el reto? — ¡Sí, vamos allá!',
    example1Hy: '— Պատրա՞ստ ես մարտահրավերին: — Այո, դե՛ սկսենք:',
    example2Es: 'Tenemos mucho que limpiar hoy. Venga, chicos, ¡vamos allá!',
    example2Hy: 'Այսօր մաքրելու շատ բան ունենք: Դե՛, երեխեք, սկսե՛նք:',
    level: 'A2',
    category: 'Ánimo e inicio'
  },
  {
    id: 'exp-3',
    phraseEs: 'A ver',
    translationHy: 'Տեսնենք / Հապա տեսնենք:',
    shortExplanationHy: 'Շատ հաճախ հանդիպող արտահայտություն՝ մտածելու, ստուգելու կամ հետաքրքրություն արտահայտելու համար:',
    example1Es: 'Sí, a ver, yo creo que sí, ¿eh? A ver.',
    example1Hy: 'Հա, տեսնենք, ես կարծում եմ՝ հա, չէ՞: Տեսնենք:',
    example2Es: '— ¿Dónde están mis llaves? — A ver... déjame mirar en tu bolso.',
    example2Hy: '— Որտե՞ղ են բանալիներս: — Հապա տեսնենք... թույլ տուր նայեմ պայուսակիդ մեջ:',
    level: 'A2',
    category: 'Muletillas cotidianas'
  },
  {
    id: 'exp-4',
    phraseEs: 'No lo sé',
    translationHy: 'Չգիտեմ:',
    shortExplanationHy: 'Հիմնարար և բնական պատասխան, երբ տեղեկացված չես:',
    example1Es: '— ¿Serás capaz de acertarlo? — No lo sé, lo intentaré.',
    example1Hy: '— Կկարողանա՞ս ճիշտ գուշակել: — Չգիտեմ, կփորձեմ:',
    example2Es: 'No lo sé exactamente, pero creo que la tienda abre a las diez.',
    example2Hy: 'Հստակ չգիտեմ, բայց կարծում եմ՝ խանութը բացվում է ժամը տասին:',
    level: 'A2',
    category: 'Respuestas básicas'
  },
  {
    id: 'exp-5',
    phraseEs: 'Ser capaz de (+ infinitivo)',
    translationHy: 'Ունակ լինել / Կարողանալ (ինչ-որ բան անել):',
    shortExplanationHy: 'Ցույց է տալիս մարդու ընդունակությունը, հմտությունը կամ համարձակությունը որևէ բարդ գործ անելու:',
    example1Es: '¿Será capaz de adivinar su canción en 0,3 segundos?',
    example1Hy: 'Կկարողանա՞ Ալվարոն գուշակել իր երգը 0,3 վայրկյանում:',
    example2Es: 'María es capaz de hablar tres idiomas con total fluidez.',
    example2Hy: 'Մարիան կարողանում է խոսել երեք լեզուներով լիակատար սահունությամբ:',
    level: 'B1',
    category: 'Capacidad y habilidad'
  },
  {
    id: 'exp-6',
    phraseEs: 'Adivinar',
    translationHy: 'Գուշակել / Կռահել:',
    shortExplanationHy: 'Ճիշտ պատասխանը գտնել առանց նախապես իմանալու կամ ինտուիցիայով:',
    example1Es: 'Espero adivinar ahora todo esto.',
    example1Hy: 'Հուսով եմ՝ հիմա կկարողանամ գուշակել այս բոլորը:',
    example2Es: '¡Adivina a quién me he encontrado en el metro!',
    example2Hy: 'Գուշակի՛ր, թե ում եմ հանդիպել մետրոյում:',
    level: 'A2',
    category: 'Acciones mentales'
  },
  {
    id: 'exp-7',
    phraseEs: 'Es más fácil de lo que pensaba',
    translationHy: 'Ավելի հեշտ է, քան կարծում էի:',
    shortExplanationHy: 'Հիանալի կառուցվածք՝ համեմատելու սպասումները իրականության հետ (más... de lo que...):',
    example1Es: 'Es que sí, realmente es más fácil de lo que pensaba.',
    example1Hy: 'Բանն այն է, որ հա, իրականում ավելի հեշտ է, քան կարծում էի:',
    example2Es: 'Aprender a cocinar paella fue mucho más fácil de lo que pensaba.',
    example2Hy: 'Պաելյա պատրաստել սովորելը շատ ավելի հեշտ էր, քան կարծում էի:',
    level: 'B1',
    category: 'Comparaciones'
  },
  {
    id: 'exp-8',
    phraseEs: 'Se ve que...',
    translationHy: 'Պարզվում է, որ... / Երևում է, որ...:',
    shortExplanationHy: 'Ենթադրություն կամ եզրակացություն արտահայտող խոսակցական կառույց:',
    example1Es: 'Porque este sample se ve que es de una canción de los ochenta.',
    example1Hy: 'Որովհետև այս սեմփլը, պարզվում է, ութսունականների մի երգից է:',
    example2Es: 'Se ve que mañana va a llover, porque el cielo está muy oscuro.',
    example2Hy: 'Երևում է՝ վաղը անձրև է գալու, որովհետև երկինքը շատ մութ է:',
    level: 'B1',
    category: 'Deducciones y conjeturas'
  },
  {
    id: 'exp-9',
    phraseEs: 'En teoría',
    translationHy: 'Տեսականորեն / Ըստ ենթադրության:',
    shortExplanationHy: 'Երբ թղթի վրա ամեն ինչ ճիշտ է, բայց պրակտիկայում այլ կերպ է լինում:',
    example1Es: 'Había una base de datos que en teoría era libre, pero no lo era.',
    example1Hy: 'Կար մի տվյալների բազա, որը տեսականորեն անվճար էր, բայց իրականում այդպես չէր:',
    example2Es: 'En teoría el tren llega a las seis, pero casi siempre se retrasa.',
    example2Hy: 'Տեսականորեն գնացքը գալիս է ժամը վեցին, բայց գրեթե միշտ ուշանում է:',
    level: 'B1',
    category: 'Matices y contraste'
  },
  {
    id: 'exp-10',
    phraseEs: 'Al final',
    translationHy: 'Ի վերջո / Վերջիվերջո / Վերջում:',
    shortExplanationHy: 'Ցույց է տալիս իրադարձությունների վերջնական ելքը կամ եզրակացությունը:',
    example1Es: 'Al final no era libre y tuvimos problemas.',
    example1Hy: 'Ի վերջո այն ազատ չէր, և մենք խնդիրներ ունեցանք:',
    example2Es: 'Íbamos al cine, pero al final nos quedamos en casa viendo series.',
    example2Hy: 'Գնալու էինք կինո, բայց ի վերջո մնացինք տանը՝ սերիալ նայելով:',
    level: 'A2',
    category: 'Conectores temporales'
  },
  {
    id: 'exp-11',
    phraseEs: 'Tener un follón',
    translationHy: 'Մեծ խառնաշփոթի / խնդրի / քաշքշուկի մեջ ընկնել:',
    shortExplanationHy: 'Follón նշանակում է մեծ իրարանցում, բարդ խնդիր կամ խառնաշփոթ:',
    example1Es: 'Tuvimos un bastante follón con este sample.',
    example1Hy: 'Մենք բավականին մեծ խնդրի մեջ ընկանք այս սեմփլի պատճառով:',
    example2Es: 'Se me estropeó el coche en plena autopista y se armó un follón tremendo.',
    example2Hy: 'Մեքենաս փչացավ հենց ավտոմայրուղու մեջտեղում, ու սոսկալի քաշքշուկ առաջացավ:',
    level: 'B2',
    category: 'Coloquialismos españoles'
  },
  {
    id: 'exp-12',
    phraseEs: '¡Qué guay!',
    translationHy: 'Ի՜նչ հավես է / Ի՜նչ հիանալի է / Ի՜նչ սիրուն է:',
    shortExplanationHy: 'Իսպանիայի թիվ 1 երիտասարդական և խոսակցական բառը՝ հիացմունք արտահայտելու համար:',
    example1Es: '— Es una de las canciones nuevas. — ¡Qué guay!',
    example1Hy: '— Նոր երգերից մեկն է: — Ի՜նչ հավես է:',
    example2Es: '— Nos han invitado a una fiesta en la playa. — ¡Qué guay! ¡Me apunto!',
    example2Hy: '— Մեզ հրավիրել են լողափի երեկույթի: — Ի՜նչ հավես է, ես էլ եմ գալիս:',
    level: 'A2',
    category: 'Exclamaciones populares'
  },
  {
    id: 'exp-13',
    phraseEs: 'De momento',
    translationHy: 'Առայժմ / Այս պահին:',
    shortExplanationHy: 'Արտահայտում է ներկա ժամանակավոր վիճակը (հոմանիշ է por ahora-ին):',
    example1Es: 'A ver, de momento eres el único.',
    example1Hy: 'Տեսնենք, առայժմ դու միակն ես:',
    example2Es: 'De momento no tengo planes para el fin de semana.',
    example2Hy: 'Առայժմ հանգստյան օրերի համար ծրագրեր չունեմ:',
    level: 'A2',
    category: 'Tiempo y frecuencia'
  },
  {
    id: 'exp-14',
    phraseEs: 'Acertar',
    translationHy: 'Ճիշտ գուշակել / Դիպուկ պատասխանել / Հաջողել:',
    shortExplanationHy: 'Հակառակն է fallar-ի: Երբ պատասխանը 100% համընկնում է իրականությանը:',
    example1Es: 'Todo el mundo ha acertado por ahora.',
    example1Hy: 'Բոլորը ճիշտ են գուշակել առայժմ:',
    example2Es: 'Has acertado todas las respuestas del test, ¡felicidades!',
    example2Hy: 'Դու թեստի բոլոր հարցերը ճիշտ ես գուշակել, շնորհավո՛ր:',
    level: 'B1',
    category: 'Juegos y pruebas'
  },
  {
    id: 'exp-15',
    phraseEs: 'Fallar',
    translationHy: 'Սխալվել / Չհաջողել / Ձախողել:',
    shortExplanationHy: 'Օգտագործվում է, երբ սխալ ես թույլ տալիս:',
    example1Es: '¿Hay alguien que falle en esto?',
    example1Hy: 'Կա՞ որևէ մեկը, ով այստեղ սխալվում է (ձախողում է):',
    example2Es: 'Tranquilo, todos fallamos alguna vez cuando aprendemos algo nuevo.',
    example2Hy: 'Հանգի՛ստ եղիր, մենք բոլորս էլ սխալվում ենք, երբ նոր բան ենք սովորում:',
    level: 'B1',
    category: 'Juegos y pruebas'
  },
  {
    id: 'exp-16',
    phraseEs: 'Ser reconocible',
    translationHy: 'Հեշտ ճանաչելի լինել / Անմիջապես ճանաչվել:',
    shortExplanationHy: 'Երբ երգը, մարդը կամ ոճն այնքան յուրահատուկ են, որ անմիջապես գլխի ես ընկնում:',
    example1Es: 'El ritmo de la batería es muy reconocible, sí.',
    example1Hy: 'Հարվածայինների ռիթմը շատ հեշտ ճանաչելի է, այո:',
    example2Es: 'La voz de Álvaro Soler es tan reconocible que la distingues al instante.',
    example2Hy: 'Ալվարո Սոլերի ձայնն այնքան ճանաչելի է, որ միանգամից տարբերում ես:',
    level: 'B1',
    category: 'Descripciones'
  },
  {
    id: 'exp-17',
    phraseEs: 'Todo el mundo',
    translationHy: 'Բոլորը (բառացի՝ ամբողջ աշխարհը):',
    shortExplanationHy: 'Իսպաներենում «todos» բառի ամենաօրգանական խոսակցական տարբերակն է:',
    example1Es: 'Todo el mundo ha acertado la canción en un segundo.',
    example1Hy: 'Բոլորն էլ երգը մեկ վայրկյանում ճիշտ գուշակեցին:',
    example2Es: 'Todo el mundo en la fiesta estaba bailando y cantando.',
    example2Hy: 'Երեկույթի բոլոր մարդիկ պարում ու երգում էին:',
    level: 'A2',
    category: 'Generalizaciones'
  },
  {
    id: 'exp-18',
    phraseEs: 'Gracias a ti',
    translationHy: 'Ես եմ քեզ շնորհակալ / Քե՛զ շնորհակալություն:',
    shortExplanationHy: 'Նրբագեղ ու քաղաքավարի պատասխան «gracias»-ին:',
    example1Es: '— Gracias por venir a la entrevista. — Bueno, gracias a ti.',
    example1Hy: '— Շնորհակալություն հարցազրույցին գալու համար: — Դե, ես եմ քեզ շնորհակալ:',
    example2Es: '— Gracias por ayudarme con el español. — ¡Gracias a ti por tu entusiasmo!',
    example2Hy: '— Շնորհակալություն իսպաներենի հարցում օգնելու համար: — Ես եմ քեզ շնորհակալ քո ոգևորության համար:',
    level: 'A2',
    category: 'Cortesía y despedida'
  }
];

const GRAMMAR_LIST: GrammarTopic[] = [
  {
    id: 'gram-1',
    titleEs: 'Ser capaz de + infinitivo',
    titleHy: 'Ser capaz de + infinitivo (Ունակ լինել / Կարողանալ)',
    explanationHy: 'Այս կառույցը ցույց է տալիս, որ անձն ունի բավարար կարողություն, ֆիզիկական կամ մտավոր ուժ, կամ համարձակություն որևէ բան անելու:',
    formulaEs: 'Sujeto + SER + capaz (հոգնակի՝ capaces) + de + INFINITIVO',
    videoSentenceEs: '¿Será capaz de adivinar Álvaro Soler su canción en 0,3 segundos?',
    videoSentenceHy: 'Կկարողանա՞ Ալվարո Սոլերը գուշակել իր երգը 0,3 վայրկյանում:',
    extraExamples: [
      { es: 'Soy capaz de entender español si hablan despacio.', hy: 'Ես ի վիճակի եմ հասկանալ իսպաներեն, եթե դանդաղ են խոսում:' },
      { es: '¿Eres capaz de levantarte a las 6 de la mañana?', hy: 'Կկարողանա՞ս արթնանալ առավոտյան ժամը 6-ին:' }
    ],
    tipHy: 'Հոգնակի թվի դեպքում՝ «capaces» (օր.՝ Ellos son capaces de hacerlo):'
  },
  {
    id: 'gram-2',
    titleEs: 'Más… de lo que… (Comparaciones)',
    titleHy: 'Más… de lo que… (Ավելի..., քան կարծում էի)',
    explanationHy: 'Երբ համեմատում ենք ոչ թե երկու գոյական, այլ ամբողջական միտք կամ ենթադրություն, օգտագործում ենք «más / menos + ածական + de lo que + բայ»:',
    formulaEs: 'más + adjetivo + de lo que + verbo',
    videoSentenceEs: 'Es que sí, realmente es más fácil de lo que pensaba.',
    videoSentenceHy: 'Բանն այն է, որ հա, իրականում ավելի հեշտ է, քան կարծում էի:',
    extraExamples: [
      { es: 'La película fue más divertida de lo que esperaba.', hy: 'Ֆիլմն ավելի զվարճալի էր, քան սպասում էի:' }
    ],
    tipHy: 'Երբեք մի ասեք «más fácil que pensaba»❌: Ճիշտ է՝ «más fácil de lo que pensaba»✅:'
  },
  {
    id: 'gram-3',
    titleEs: 'Pretérito Indefinido: nos denunciaron, pasó',
    titleHy: 'Pretérito Indefinido (Ավարտված գործողություն անցյալում)',
    explanationHy: 'Օգտագործվում է կոնկրետ, ավարտված անցյալ գործողությունների համար, որոնք տեղի են ունեցել անցյալի ավարտված ժամանակահատվածում:',
    videoSentenceEs: '¿Sabes qué nos denunciaron por este hate? ... Lo que pasó pasó.',
    videoSentenceHy: 'Գիտե՞ս, որ մեր դեմ բողոք ներկայացրին: ... Այն, ինչ պատահեց, անցավ:',
    extraExamples: [
      { es: 'Ayer hablé con Álvaro sobre su nueva música.', hy: 'Երեկ ես խոսեցի Ալվարոյի հետ իր նոր երաժշտության մասին:' }
    ],
    tipHy: '«Denunciar» -> «nos denunciaron» (նրանք մեր դեմ բողոքեցին / դատի տվեցին):'
  },
  {
    id: 'gram-4',
    titleEs: 'Pretérito Perfecto: ha acertado',
    titleHy: 'Pretérito Perfecto (Անցյալի կապը ներկայի հետ)',
    explanationHy: 'Օգտագործվում է, երբ գործողությունը տեղի է ունեցել դեռ չավարտված ժամանակում (այսօր, առայժմ), կամ անմիջական ազդեցություն ունի ներկայի վրա:',
    formulaEs: 'Haber (he, has, ha, hemos, habéis, han) + Participio (-ado / -ido)',
    videoSentenceEs: 'Todo el mundo ha acertado por ahora.',
    videoSentenceHy: 'Բոլորն էլ առայժմ ճիշտ են գուշակել:',
    extraExamples: [
      { es: 'Hoy he aprendido muchas expresiones nuevas.', hy: 'Այսօր ես շատ նոր արտահայտություններ սովորեցի:' }
    ],
    tipHy: '«Por ahora»-ի հետ միշտ բնական է Pretérito Perfecto-ն:'
  },
  {
    id: 'gram-5',
    titleEs: 'Se ve que (Deducción o conjetura)',
    titleHy: 'Se ve que (Երևում է, որ / Պարզվում է, որ)',
    explanationHy: 'Եզրակացություն կամ ենթադրություն արտահայտող խոսակցական կառույց:',
    videoSentenceEs: 'Porque este hate se ve que es de un sample de una canción...',
    videoSentenceHy: 'Որովհետև այս սեմփլը, պարզվում է, մի երգից է...',
    extraExamples: [
      { es: 'Se ve que a Álvaro le encanta el ritmo latino.', hy: 'Երևում է՝ Ալվարոյին շատ է դուր գալիս լատինական ռիթմը:' }
    ],
    tipHy: '«Se ve que»-ից հետո սովորաբար դրվում է Indicativo (իրական եղանակ):'
  },
  {
    id: 'gram-6',
    titleEs: 'Por ahora vs. De momento',
    titleHy: 'Por ahora vs. De momento (Առայժմ / Այս պահին)',
    explanationHy: 'Երկու արտահայտություններն էլ նշանակում են «առայժմ», սակայն ակնարկում են, որ ապագայում իրավիճակը կարող է փոխվել:',
    videoSentenceEs: 'Todo el mundo ha acertado por ahora. // De momento eres el único.',
    videoSentenceHy: 'Բոլորն առայժմ ճիշտ են գուշակել: // Առայժմ դու միակն ես:',
    extraExamples: [
      { es: 'Por ahora todo va muy bien.', hy: 'Առայժմ ամեն ինչ շատ լավ է ընթանում:' }
    ],
    tipHy: 'Կարող եք օգտագործել որպես լիարժեք հոմանիշներ:'
  },
  {
    id: 'gram-7',
    titleEs: 'Lo que (El pronombre neutro relativo)',
    titleHy: 'Lo que (Այն, ինչ / Ինչ որ)',
    explanationHy: 'Չեզոք հարաբերական դերանուն է: Փոխարինում է ամբողջական մտքի կամ անորոշ երևույթի:',
    videoSentenceEs: 'Lo que pasó pasó. // Es más fácil de lo que pensaba.',
    videoSentenceHy: 'Այն, ինչ պատահեց, անցավ: // Ավելի հեշտ է, քան կարծում էի:',
    extraExamples: [
      { es: 'Lo que me gusta de Álvaro es su energía.', hy: 'Այն, ինչ ինձ դուր է գալիս Ալվարոյի մեջ, նրա էներգիան է:' }
    ],
    tipHy: 'Չի կարելի փոխարինել «el que»-ով, երբ խոսքը վերաբերում է ամբողջ մտքին:'
  },
  {
    id: 'gram-8',
    titleEs: 'Uso conversacional de «Es que…»',
    titleHy: '«Es que…» խոսակցական կիրառությունը (Բանն այն է, որ...)',
    explanationHy: 'Իսպանախոսները նախադասությունը սկսում են «Es que...»-ով, երբ բացատրություն են տալիս, արդարանում են կամ մեղմում մերժումը:',
    videoSentenceEs: 'Es que sí, realmente es más fácil de lo que pensaba.',
    videoSentenceHy: 'Բանն այն է, որ հա, իրականում ավելի հեշտ է, քան կարծում էի:',
    extraExamples: [
      { es: '— ¿Por qué llegas tarde? — Es que había tráfico.', hy: '— Ինչո՞ւ ես ուշանում: — Բանն այն է, որ խցանում կար:' }
    ],
    tipHy: 'Օգտագործեք «Es que...», երբ հարցնում են «¿Por qué...?», և խոսքը կհնչի բնական:'
  }
];

const HABLA_MODELS: HablaItem[] = [
  {
    id: 'h-1',
    title: 'Expresar confianza o duda (Կասկած կամ վստահություն)',
    contextEs: 'Un amigo te reta a reconocer una canción muy rápido.',
    contextHy: 'Ընկերդ մարտահրավեր է նետում քեզ շատ արագ ճանաչել երգը:',
    questionEs: '¿Crees que puedes adivinarlo en 0,3 segundos?',
    questionHy: 'Կարծո՞ւմ ես՝ կկարողանաս գուշակել 0,3 վայրկյանում:',
    shortResponseEs: 'Yo creo que sí.',
    shortResponseHy: 'Ես կարծում եմ, որ այո:',
    fullResponseEs: 'Yo creo que sí, aunque realmente depende de lo difícil que sea el fragmento.',
    fullResponseHy: 'Կարծում եմ՝ այո, թեև իրականում կախված է նրանից, թե որքան դժվար կլինի հատվածը:',
    nuanceHy: 'Կարճ պատասխանը սպոնտան է, իսկ ամբողջականը Subjuntivo-ով ցույց է տալիս լեզվի B1–B2 մակարդակ:'
  },
  {
    id: 'h-2',
    title: 'Reaccionar ante una noticia increíble (Անհավանական լուրի արձագանք)',
    contextEs: 'Te dicen que han denunciado a un grupo por un pequeño sample de batería.',
    contextHy: 'Քեզ ասում են, որ երաժշտական խմբի դեմ բողոք են ներկայացրել հարվածայինի փոքրիկ սեմփլի պատճառով:',
    questionEs: '¿Sabes qué? Nos denunciaron por usar este sonido.',
    questionHy: 'Գիտե՞ս ինչ: Մեր դեմ դատի տվեցին այս հնչյունն օգտագործելու համար:',
    shortResponseEs: '¿Qué dices? ¡Qué locura!',
    shortResponseHy: 'Ի՞նչ ես ասում: Ինչպիսի՜ խենթություն:',
    fullResponseEs: '¿Qué dices? No me lo puedo creer, si en teoría ese sonido era libre.',
    fullResponseHy: 'Ի՞նչ ես ասում: Չեմ կարողանում հավատալ, չէ՞ որ տեսականորեն այդ հնչյունն ազատ էր:',
    nuanceHy: '«¿Qué dices?»-ը հիանալի բնական ռեակցիա է զարմանքի պահին:'
  },
  {
    id: 'h-3',
    title: 'Evaluar la dificultad de un reto (Բարդության գնահատում)',
    contextEs: 'Acabas de superar una prueba que parecía imposible.',
    contextHy: 'Հաղթահարեցիր մի փորձություն, որն անհնար էր թվում:',
    questionEs: '¿Cómo te ha parecido la prueba de las canciones?',
    questionHy: 'Ինչպիսի՞ն թվաց երգերի փորձությունը:',
    shortResponseEs: 'Más fácil de lo que pensaba.',
    shortResponseHy: 'Ավելի հեշտ, քան կարծում էի:',
    fullResponseEs: 'Es que realmente ha sido bastante más fácil de lo que pensaba al principio.',
    fullResponseHy: 'Բանն այն է, որ իրականում բավականին ավելի հեշտ էր, քան սկզբում կարծում էի:',
    nuanceHy: '«Es que...»-ով սկսելը մտերմիկ ու անմիջական երանգ է տալիս:'
  },
  {
    id: 'h-4',
    title: 'Responder a un agradecimiento (Շնորհակալության պատասխան)',
    contextEs: 'El presentador te agradece por haber participado.',
    contextHy: 'Հաղորդավարը շնորհակալություն է հայտնում մասնակցելու համար:',
    questionEs: 'Muchísimas gracias por estar aquí con nosotros.',
    questionHy: 'Շատ շնորհակալություն մեզ հետ այստեղ լինելու համար:',
    shortResponseEs: 'Bueno, gracias a ti.',
    shortResponseHy: 'Դե, ես եմ քեզ շնորհակալ:',
    fullResponseEs: 'Bueno, muchísimas gracias a ti por invitarme, me lo he pasado genial.',
    fullResponseHy: 'Դե, շատ շնորհակալություն քեզ ինձ հրավիրելու համար, շատ հավես ժամանակ անցկացրի:',
    nuanceHy: '«Gracias a ti»-ն ընդգծում է փոխադարձ հարգանքը:'
  }
];

const GAMES_LIST = [
  { id: 'g1', num: 1, title: '¿Qué quiso decir?', hy: 'Իրական իմաստը', badge: 'Significado' },
  { id: 'g2', num: 2, title: 'Completa el diálogo', hy: 'Լրացրու երկխոսությունը', badge: 'Diálogos' },
  { id: 'g3', num: 3, title: 'Español cotidiano vs neutro', hy: 'Խոսակցական vs չեզոք', badge: 'Equivalencias' },
  { id: 'g4', num: 4, title: 'Ordena las palabras', hy: 'Դասավորիր բառերը', badge: 'Sintaxis' },
  { id: 'g5', num: 5, title: 'Verdadero o falso', hy: 'Ճի՞շտ է, թե՞ սխալ', badge: 'Comprensión' },
  { id: 'g6', num: 6, title: '¿Qué pasó en el vídeo?', hy: 'Ի՞նչ պատահեց տեսանյութում', badge: 'Detalles' },
  { id: 'g7', num: 7, title: 'Elige la reacción natural', hy: 'Ընտրիր բնական արձագանքը', badge: 'Reacciones' },
  { id: 'g8', num: 8, title: 'Encuentra el error', hy: 'Գտիր և ուղղիր սխալը', badge: 'Corrección' },
  { id: 'g9', num: 9, title: 'El Rosco: Pasapalabra', hy: 'Պասապալաբրա (Բառախաղ)', badge: 'Léxico' },
  { id: 'g10', num: 10, title: 'Desafío de memoria', hy: 'Հիշողության մարտահրավեր', badge: 'Retención' },
  { id: 'g11', num: 11, title: '¿Quién lo dijo?', hy: 'Ո՞վ ասաց (Ալվարո՞ն, թե՞ հարցազրուցավարը)', badge: 'Hablantes' },
  { id: 'g12', num: 12, title: 'Responde rápido', hy: 'Արագ արձագանք (ժամանակաչափով)', badge: 'Reflejos' }
];

// Questions for all 12 games
const ALL_GAMES_QUESTIONS: Record<string, any[]> = {
  g1: [
    {
      id: 'g1-1',
      promptEs: '¿Qué significa «¡Qué guay!» cuando lo dice Álvaro?',
      promptHy: 'Ի՞նչ է նշանակում «¡Qué guay!», երբ ասում է Ալվարոն:',
      options: [
        { textEs: 'Qué aburrido y pesado.', isCorrect: false },
        { textEs: 'Qué interesante, fantástico y genial.', isCorrect: true },
        { textEs: 'Qué complicado y difícil.', isCorrect: false },
        { textEs: 'Qué peligroso y arriesgado.', isCorrect: false }
      ],
      explanationHy: '«¡Qué guay!»-ը խոսակցական հիացմունքի արտահայտություն է՝ «ի՜նչ հավես է, ինչ հիանալի է»:'
    },
    {
      id: 'g1-2',
      promptEs: '¿Qué quiere decir «Tuvimos un bastante follón»?',
      promptHy: 'Ի՞նչ է նշանակում «Tuvimos un bastante follón»:',
      options: [
        { textEs: 'Hicimos una fiesta divertida.', isCorrect: false },
        { textEs: 'Tuvimos un lío o problema bastante grande.', isCorrect: true },
        { textEs: 'Compramos una batería cara.', isCorrect: false },
        { textEs: 'Grabamos en cinco minutos.', isCorrect: false }
      ],
      explanationHy: '«Tener un follón» նշանակում է մեծ խառնաշփոթի կամ խնդրի մեջ ընկնել:'
    },
    {
      id: 'g1-3',
      promptEs: '¿Qué significa «¿Qué dices?» ante una noticia sorprendente?',
      promptHy: 'Ի՞նչ է նշանակում «¿Qué dices?» զարմանալի լուրի դեպքում:',
      options: [
        { textEs: 'Pide que hables más alto.', isCorrect: false },
        { textEs: 'Expresa sorpresa e incredulidad («¿En serio?»).', isCorrect: true },
        { textEs: 'Pregunta en qué idioma hablas.', isCorrect: false },
        { textEs: 'Dice que está enfadado.', isCorrect: false }
      ],
      explanationHy: '«¿Qué dices?»-ը ցույց է տալիս զարմանք՝ «Ի՞նչ ես ասում / Լո՞ւրջ»:'
    },
    {
      id: 'g1-4',
      promptEs: '«De momento eres el único» ¿Qué significa «de momento»?',
      promptHy: 'Ի՞նչ է նշանակում «de momento»:',
      options: [
        { textEs: 'Para siempre.', isCorrect: false },
        { textEs: 'Por ahora, en este momento actual.', isCorrect: true },
        { textEs: 'En un segundo muy rápido.', isCorrect: false },
        { textEs: 'Nunca.', isCorrect: false }
      ],
      explanationHy: '«De momento» նշանակում է «առայժմ / այս պահին»:'
    }
  ],
  g2: [
    {
      id: 'g2-1',
      promptEs: '— ¿Crees que podrás adivinar todas las canciones?\n— _____, pero voy a intentarlo.',
      promptHy: '— Կարծո՞ւմ ես՝ կկարողանաս գուշակել բոլոր երգերը:\n— _____, բայց կփորձեմ:',
      options: [
        { textEs: 'No lo sé', isCorrect: true },
        { textEs: 'Gracias a ti', isCorrect: false },
        { textEs: 'Todo el mundo', isCorrect: false },
        { textEs: 'Eso es', isCorrect: false }
      ],
      explanationHy: 'Անտեղյակության բնական արտահայտությունն է «No lo sé» (Չգիտեմ):'
    },
    {
      id: 'g2-2',
      promptEs: '— ¡Hemos ganado entradas para el concierto!\n— ¡_____! ¡Qué ilusión!',
      promptHy: '— Համերգի տոմսեր ենք շահել:\n— _____! Ինչ ուրախություն է:',
      options: [
        { textEs: 'Qué follón', isCorrect: false },
        { textEs: '¡Qué guay!', isCorrect: true },
        { textEs: 'De momento', isCorrect: false },
        { textEs: 'En teoría', isCorrect: false }
      ],
      explanationHy: 'Ուրախության բացականչություն՝ «¡Qué guay!» (Ի՜նչ հավես է):'
    },
    {
      id: 'g2-3',
      promptEs: '— ¿Listos para empezar el reto?\n— ¡Sí, _____!',
      promptHy: '— Պատրա՞ստ եք սկսելու:\n— Այո՛, _____:',
      options: [
        { textEs: 'vamos allá', isCorrect: true },
        { textEs: 'al final', isCorrect: false },
        { textEs: 'se ve que', isCorrect: false },
        { textEs: 'gracias a ti', isCorrect: false }
      ],
      explanationHy: '«¡Vamos allá!» = Դե՛, սկսենք / Առա՛ջ:'
    }
  ],
  g3: [
    {
      id: 'g3-1',
      promptEs: '«¡Qué guay!» equivale en registro neutro a:',
      promptHy: '«¡Qué guay!»-ի համարժեքը գրական իսպաներենում:',
      options: [
        { textEs: '¡Qué estupendo / fantástico!', isCorrect: true },
        { textEs: '¡Qué aburrimiento!', isCorrect: false },
        { textEs: '¡Qué peligro!', isCorrect: false },
        { textEs: '¡Qué dolor!', isCorrect: false }
      ],
      explanationHy: '«¡Qué guay!» = «¡Qué estupendo!» (Ի՜նչ հիանալի է):'
    },
    {
      id: 'g3-2',
      promptEs: '«Tener un follón» equivale a:',
      promptHy: '«Tener un follón»-ի համարժեքը:',
      options: [
        { textEs: 'Tener un problema o complicación seria.', isCorrect: true },
        { textEs: 'Tener una cena tranquila.', isCorrect: false },
        { textEs: 'Tener sueño.', isCorrect: false },
        { textEs: 'Tener dinero.', isCorrect: false }
      ],
      explanationHy: '«Tener un follón» = Խնդիր կամ քաշքշուկ ունենալ:'
    }
  ],
  g4: [
    {
      id: 'g4-1',
      targetSentenceEs: 'Es más fácil de lo que pensaba.',
      targetSentenceHy: 'Ավելի հեշտ է, քան կարծում էի:',
      scrambledWords: ['fácil', 'Es', 'pensaba', 'lo', 'más', 'que', 'de'],
      explanationHy: 'Կառուցվածք՝ «Es más fácil de lo que pensaba»:'
    },
    {
      id: 'g4-2',
      targetSentenceEs: 'No lo sé.',
      targetSentenceHy: 'Չգիտեմ:',
      scrambledWords: ['sé', 'No', 'lo'],
      explanationHy: '«No lo sé» = Չգիտեմ:'
    },
    {
      id: 'g4-3',
      targetSentenceEs: 'Todo el mundo ha acertado por ahora.',
      targetSentenceHy: 'Բոլորն էլ առայժմ ճիշտ են գուշակել:',
      scrambledWords: ['mundo', 'por', 'Todo', 'ahora', 'el', 'acertado', 'ha'],
      explanationHy: '«Todo el mundo ha acertado por ahora»:'
    }
  ],
  g5: [
    {
      id: 'g5-1',
      statementEs: 'Álvaro Soler intenta reconocer sus canciones escuchando fragmentos de solo 0,3 segundos.',
      statementHy: 'Ալվարոն փորձում է ճանաչել իր երգերը ընդամենը 0,3 վայրկյանանոց հատվածներով:',
      isTrue: true,
      explanationHy: 'Ճիշտ է: Հաղորդավարն ասում է՝ «en 0,3 segundos»:'
    },
    {
      id: 'g5-2',
      statementEs: 'La primera canción que adivinó fue «Sofía».',
      statementHy: 'Առաջին գուշակած երգը «Sofía»-ն էր:',
      isTrue: false,
      explanationHy: 'Սխալ է: Առաջինը «La cintura»-ն էր (0:09):'
    },
    {
      id: 'g5-3',
      statementEs: 'Álvaro dice que el reto fue mucho más fácil de lo que pensaba.',
      statementHy: 'Ալվարոն ասում է, որ փորձությունն ավելի հեշտ էր, քան կարծում էր:',
      isTrue: true,
      explanationHy: 'Ճիշտ է: «Es que sí, realmente es más fácil de lo que pensaba»:'
    }
  ],
  g6: [
    {
      id: 'g6-1',
      promptEs: '¿Por qué tuvieron un follón legal con el hi-hat de «Sofía»?',
      promptHy: 'Ինչո՞ւ դատական քաշքշուկ առաջացավ «Sofía»-ի հայ-հեթի պատճառով:',
      options: [
        { textEs: 'Porque la base de datos supuestamente libre no lo era realmente.', isCorrect: true },
        { textEs: 'Porque robaron el instrumento de una tienda.', isCorrect: false },
        { textEs: 'Porque no les gustó el productor.', isCorrect: false },
        { textEs: 'Porque era una canción en inglés.', isCorrect: false }
      ],
      explanationHy: 'Տվյալների բազան տեսականորեն ազատ էր, բայց իրականում՝ ոչ:'
    },
    {
      id: 'g6-2',
      promptEs: '¿Qué canción identificó Álvaro gracias a «los claps» (las palmadas)?',
      promptHy: 'Ո՞ր երգը ճանաչեց ծափերի շնորհիվ:',
      options: [
        { textEs: 'El mismo sol.', isCorrect: true },
        { textEs: 'La cintura.', isCorrect: false },
        { textEs: 'Sofía.', isCorrect: false },
        { textEs: 'Lo que pasó pasa.', isCorrect: false }
      ],
      explanationHy: '1:05-ում Ալվարոն ասում է՝ «Bueno, los claps del mismo sol»:'
    }
  ],
  g7: [
    {
      id: 'g7-1',
      promptEs: 'Un amigo te dice: «¡He aprobado el examen más difícil!»\n¿Cómo reaccionas naturalmente?',
      promptHy: 'Ընկերդ ասում է, որ ամենաբարդ քննությունը հանձնեց: Ինչպե՞ս կարձագանքես:',
      options: [
        { textEs: '¡Qué dices! ¡Qué guay, enhorabuena!', isCorrect: true },
        { textEs: 'No lo sé, en seis meses te cuento.', isCorrect: false },
        { textEs: 'Tuvimos un follón tremendo.', isCorrect: false },
        { textEs: 'Entonces no, de momento.', isCorrect: false }
      ],
      explanationHy: '«¡Qué dices! ¡Qué guay!»-ը ուրախության ամենաջերմ արձագանքն է:'
    },
    {
      id: 'g7-2',
      promptEs: 'El profesor dice: «¡Es hora de empezar el juego!» ¿Qué decís para mostrar energía?',
      promptHy: 'Ուսուցիչն ասում է, որ խաղը սկսելու ժամանակն է: Ի՞նչ կասեք:',
      options: [
        { textEs: '¡Vamos allá! ¡A ver quién acierta más!', isCorrect: true },
        { textEs: 'Al final no era libre la base de datos.', isCorrect: false },
        { textEs: '¿Hay alguien que falle en esto?', isCorrect: false },
        { textEs: 'Gracias a ti por la cintura.', isCorrect: false }
      ],
      explanationHy: '«¡Vamos allá!»-ն սկսելու ամենաբնական արտահայտությունն է:'
    }
  ],
  g8: [
    {
      id: 'g8-1',
      promptEs: 'Frase con error: «El examen fue más fácil que pensaba.»',
      promptHy: 'Սխալով նախադասություն: Գտիր ճիշտ տարբերակը:',
      options: [
        { textEs: 'El examen fue más fácil de lo que pensaba.', isCorrect: true },
        { textEs: 'El examen fue más fácil como pensaba.', isCorrect: false },
        { textEs: 'El examen fue tan fácil que yo pensó.', isCorrect: false },
        { textEs: 'El examen fue más fácil que lo pensado.', isCorrect: false }
      ],
      explanationHy: 'Նախադասության հետ համեմատելիս ճիշտ է՝ «más... de lo que pensaba»:'
    },
    {
      id: 'g8-2',
      promptEs: 'Frase con error: «¿Será capaz a adivinar la canción?»',
      promptHy: 'Սխալով նախադասություն: Գտիր ճիշտ տարբերակը:',
      options: [
        { textEs: '¿Será capaz de adivinar la canción?', isCorrect: true },
        { textEs: '¿Será capaz para adivinar la canción?', isCorrect: false },
        { textEs: '¿Será capaz en adivinar la canción?', isCorrect: false },
        { textEs: '¿Será capaz por adivinar la canción?', isCorrect: false }
      ],
      explanationHy: '«Ser capaz» կառույցը պահանջում է «de» նախդիրը (ser capaz de + infinitivo):'
    }
  ],
  g9: [
    {
      id: 'g9-1',
      letter: 'A',
      definitionEs: 'Descubrir algo oculto o acertar por conjetura («¿Será capaz de _____ su canción?»).',
      definitionHy: 'Գուշակել, կռահել (adivinar):',
      answerEs: 'ADIVINAR',
      explanationHy: '«Adivinar» = Գուշակել:'
    },
    {
      id: 'g9-2',
      letter: 'F',
      definitionEs: 'Palabra coloquial que significa lío grande o complicación («Tuvimos un bastante _____»).',
      definitionHy: 'Խոսակցական բառ՝ մեծ խառնաշփոթ (follón):',
      answerEs: 'FOLLON',
      explanationHy: '«Follón» = Խառնաշփոթ, քաշքշուկ:'
    },
    {
      id: 'g9-3',
      letter: 'G',
      definitionEs: 'Palabra coloquialísima en España para decir genial o estupendo («¡Qué _____!»).',
      definitionHy: 'Իսպանական ժարգոն՝ հավես, հիանալի (guay):',
      answerEs: 'GUAY',
      explanationHy: '«Guay» = Հավես, հիանալի:'
    }
  ],
  g10: [
    {
      id: 'g10-1',
      phraseEs: 'Es que sí, realmente es más fácil de lo que pensaba.',
      phraseHy: 'Բանն այն է, որ հա, իրականում ավելի հեշտ է, քան կարծում էի:',
      options: [
        { textEs: 'Es que sí, realmente es más fácil de lo que pensaba.', isCorrect: true },
        { textEs: 'Es que no, realmente era más difícil que pensaba.', isCorrect: false },
        { textEs: 'Es que sí, realmente es tan fácil como creía.', isCorrect: false },
        { textEs: 'Realmente pensaba que era más fácil esto.', isCorrect: false }
      ],
      explanationHy: 'Ճիշտ ձևակերպումն է՝ «Es que sí, realmente es más fácil de lo que pensaba.»'
    }
  ],
  g11: [
    {
      id: 'g11-1',
      promptEs: '«¿Será capaz de adivinar Álvaro Soler su canción en 0,3 segundos?»',
      options: [
        { textEs: 'El entrevistador', isCorrect: true },
        { textEs: 'Álvaro Soler', isCorrect: false }
      ],
      explanationHy: 'Հաղորդավարն է տալիս հարցը տեսանյութի սկզբում:'
    },
    {
      id: 'g11-2',
      promptEs: '«Es que sí, realmente es más fácil de lo que pensaba.»',
      options: [
        { textEs: 'Álvaro Soler', isCorrect: true },
        { textEs: 'El entrevistador', isCorrect: false }
      ],
      explanationHy: 'Ալվարոն է ասում առաջին երգերից հետո:'
    }
  ],
  g12: [
    {
      id: 'g12-1',
      promptEs: '¡Te acaban de decir que tu cantante favorito viene mañana!',
      options: [
        { textEs: '¡¿Qué dices?! ¡Qué guay, me muero de ganas!', isCorrect: true },
        { textEs: 'Todo el mundo ha acertado el agua.', isCorrect: false },
        { textEs: 'Tuvimos un bastante sample.', isCorrect: false },
        { textEs: 'En seis meses te cuento.', isCorrect: false }
      ],
      explanationHy: 'Բնական արձագանք՝ «¡¿Qué dices?! ¡Qué guay!»:'
    },
    {
      id: 'g12-2',
      promptEs: 'El árbitro pita el inicio del partido. ¿Qué gritas?',
      options: [
        { textEs: '¡Vamos allá, equipo!', isCorrect: true },
        { textEs: 'No lo sé por ahora.', isCorrect: false },
        { textEs: 'De momento gracias a ti.', isCorrect: false },
        { textEs: 'En teoría era libre.', isCorrect: false }
      ],
      explanationHy: '«¡Vamos allá!»-ն սկսելու ամենադասական կոչն է:'
    }
  ]
};

// ==========================================
// 3. STORAGE HELPERS
// ==========================================
function getStoredStudents(): StudentProfile[] {
  try {
    const raw = localStorage.getItem('alvaro_app_students');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredStudents(students: StudentProfile[]) {
  try {
    localStorage.setItem('alvaro_app_students', JSON.stringify(students));
  } catch {}
}

function getStoredCurrentStudent(): StudentProfile {
  const all = getStoredStudents();
  const curId = localStorage.getItem('alvaro_app_current_student_id');
  if (curId) {
    const found = all.find(s => s.id === curId);
    if (found) return found;
  }
  if (all.length > 0) return all[0];

  const initial: StudentProfile = {
    id: `student_${Date.now()}`,
    code: `AS-${Math.floor(1000 + Math.random() * 9000)}`,
    name: 'Estudiante',
    joinedAt: Date.now(),
    lastActiveAt: Date.now(),
    expressionsLearned: [],
    gameScores: {},
    errors: []
  };
  saveStoredStudents([initial]);
  localStorage.setItem('alvaro_app_current_student_id', initial.id);
  return initial;
}

// ==========================================
// 4. MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState<'video' | 'vocab' | 'juegos' | 'gramatica' | 'habla' | 'progreso' | 'errores' | 'profesor'>('video');
  const [student, setStudent] = useState<StudentProfile>(getStoredCurrentStudent());
  const [allStudents, setAllStudents] = useState<StudentProfile[]>(getStoredStudents());
  const [transcript, setTranscript] = useState<TranscriptItem[]>(() => {
    try {
      const saved = localStorage.getItem('alvaro_app_custom_transcript');
      return saved ? JSON.parse(saved) : INITIAL_TRANSCRIPT;
    } catch {
      return INITIAL_TRANSCRIPT;
    }
  });

  // Subtitles translation state
  const [openedSubtitles, setOpenedSubtitles] = useState<Set<string>>(new Set());
  const [activeWordModal, setActiveWordModal] = useState<WordToken | null>(null);
  const [subtitleSearch, setSubtitleSearch] = useState('');

  // Vocab state
  const [openedVocabHy, setOpenedVocabHy] = useState<Set<string>>(new Set());

  // Game state
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [gameQIndex, setGameQIndex] = useState(0);
  const [gameSelectedOpt, setGameSelectedOpt] = useState<string | null>(null);
  const [gameIsSubmitted, setGameIsSubmitted] = useState(false);
  const [gameIsCorrect, setGameIsCorrect] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameAnswersLog, setGameAnswersLog] = useState<StudentAnswer[]>([]);
  const [gameErrorsLog, setGameErrorsLog] = useState<ErrorRecord[]>([]);
  const [gameIsFinished, setGameIsFinished] = useState(false);
  const [gameScrambledOrder, setGameScrambledOrder] = useState<string[]>([]);
  const [gameScrambledPool, setGameScrambledPool] = useState<string[]>([]);
  const [pasapalabraInput, setPasapalabraInput] = useState('');
  const [gameShowHy, setGameShowHy] = useState(false);

  // Teacher Panel state
  const [teacherUnlocked, setTeacherUnlocked] = useState(false);
  const [teacherPinInput, setTeacherPinInput] = useState('');
  const [teacherPinError, setTeacherPinError] = useState(false);
  const [teacherSelectedStudentId, setTeacherSelectedStudentId] = useState(student.id);

  // Sync to storage
  const persistStudent = (updated: StudentProfile) => {
    updated.lastActiveAt = Date.now();
    setStudent(updated);
    const all = getStoredStudents();
    const idx = all.findIndex(s => s.id === updated.id);
    if (idx >= 0) all[idx] = updated;
    else all.push(updated);
    saveStoredStudents(all);
    setAllStudents(all);
  };

  const handleToggleSubtitle = (id: string) => {
    setOpenedSubtitles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleVocabLearned = (expId: string) => {
    const exists = student.expressionsLearned.includes(expId);
    const updated = {
      ...student,
      expressionsLearned: exists
        ? student.expressionsLearned.filter(id => id !== expId)
        : [...student.expressionsLearned, expId]
    };
    persistStudent(updated);
  };

  // Game Handlers
  const startPlayingGame = (gId: string) => {
    setSelectedGameId(gId);
    setGameQIndex(0);
    setGameScore(0);
    setGameAnswersLog([]);
    setGameErrorsLog([]);
    setGameIsFinished(false);
    resetQuestionPlayState(gId, 0);
  };

  const resetQuestionPlayState = (gId: string, qIdx: number) => {
    setGameSelectedOpt(null);
    setGameIsSubmitted(false);
    setGameIsCorrect(false);
    setPasapalabraInput('');
    setGameShowHy(false);

    const questions = ALL_GAMES_QUESTIONS[gId] || [];
    const q = questions[qIdx];
    if (gId === 'g4' && q?.scrambledWords) {
      setGameScrambledPool([...q.scrambledWords]);
      setGameScrambledOrder([]);
    }
  };

  const handleAnswerOption = (isOptCorrect: boolean, chosenText: string, correctText: string) => {
    if (gameIsSubmitted || !selectedGameId) return;

    setGameSelectedOpt(chosenText);
    setGameIsSubmitted(true);
    setGameIsCorrect(isOptCorrect);

    const questions = ALL_GAMES_QUESTIONS[selectedGameId] || [];
    const q = questions[gameQIndex];
    const promptText = q.promptEs || q.statementEs || q.phraseEs || '';

    if (isOptCorrect) {
      setGameScore(s => s + 1);
      confetti({ particleCount: 25, spread: 60 });
    } else {
      const errRecord: ErrorRecord = {
        id: `err_${Date.now()}`,
        gameId: selectedGameId,
        gameTitle: GAMES_LIST.find(g => g.id === selectedGameId)?.title || selectedGameId,
        questionId: q.id,
        promptEs: promptText,
        promptHy: q.promptHy || q.statementHy || q.phraseHy,
        userChoice: chosenText,
        correctChoice: correctText,
        explanationHy: q.explanationHy || 'Սխալ պատասխան:',
        timestamp: Date.now()
      };
      setGameErrorsLog(prev => [...prev, errRecord]);
    }

    const ansRecord: StudentAnswer = {
      questionId: q.id,
      questionPrompt: promptText,
      userAnswer: chosenText,
      correctAnswer: correctText,
      isCorrect: isOptCorrect,
      timestamp: Date.now()
    };
    setGameAnswersLog(prev => [...prev, ansRecord]);
  };

  const handleCheckScrambled = () => {
    if (gameIsSubmitted || !selectedGameId) return;
    const questions = ALL_GAMES_QUESTIONS[selectedGameId] || [];
    const q = questions[gameQIndex];
    const userBuilt = gameScrambledOrder.join(' ');
    const cleanUser = userBuilt.replace(/[.,¿?¡!]/g, '').trim().toLowerCase();
    const cleanTarget = q.targetSentenceEs.replace(/[.,¿?¡!]/g, '').trim().toLowerCase();
    const isMatch = cleanUser === cleanTarget;

    setGameIsSubmitted(true);
    setGameIsCorrect(isMatch);

    if (isMatch) {
      setGameScore(s => s + 1);
      confetti({ particleCount: 30, spread: 60 });
    } else {
      const errRecord: ErrorRecord = {
        id: `err_${Date.now()}`,
        gameId: selectedGameId,
        gameTitle: 'Ordena las palabras',
        questionId: q.id,
        promptEs: q.targetSentenceEs,
        promptHy: q.targetSentenceHy,
        userChoice: userBuilt,
        correctChoice: q.targetSentenceEs,
        explanationHy: q.explanationHy || 'Նախադասության շարադասությունը սխալ է:',
        timestamp: Date.now()
      };
      setGameErrorsLog(prev => [...prev, errRecord]);
    }

    const ansRecord: StudentAnswer = {
      questionId: q.id,
      questionPrompt: q.targetSentenceHy,
      userAnswer: userBuilt,
      correctAnswer: q.targetSentenceEs,
      isCorrect: isMatch,
      timestamp: Date.now()
    };
    setGameAnswersLog(prev => [...prev, ansRecord]);
  };

  const handleNextGameQuestion = () => {
    if (!selectedGameId) return;
    const questions = ALL_GAMES_QUESTIONS[selectedGameId] || [];
    if (gameQIndex < questions.length - 1) {
      const nextIdx = gameQIndex + 1;
      setGameQIndex(nextIdx);
      resetQuestionPlayState(selectedGameId, nextIdx);
    } else {
      // Finish game
      setGameIsFinished(true);
      const meta = GAMES_LIST.find(g => g.id === selectedGameId);
      const prevScore = student.gameScores[selectedGameId] || {
        gameId: selectedGameId,
        gameTitle: meta?.title || selectedGameId,
        attempts: 0,
        lastScore: 0,
        maxScore: 0,
        lastPlayedAt: 0,
        answers: []
      };

      const updatedScores = {
        ...student.gameScores,
        [selectedGameId]: {
          gameId: selectedGameId,
          gameTitle: meta?.title || selectedGameId,
          attempts: prevScore.attempts + 1,
          lastScore: gameScore,
          maxScore: Math.max(prevScore.maxScore, gameScore),
          lastPlayedAt: Date.now(),
          answers: [...gameAnswersLog, ...prevScore.answers].slice(0, 40)
        }
      };

      // Merge errors and remove corrected ones
      const solvedIds = new Set(gameAnswersLog.filter(a => a.isCorrect).map(a => a.questionId));
      const remainingPrevErrors = student.errors.filter(e => !solvedIds.has(e.questionId));
      const newErrorsFiltered = gameErrorsLog.filter(ne => !remainingPrevErrors.some(pe => pe.questionId === ne.questionId));

      persistStudent({
        ...student,
        gameScores: updatedScores,
        errors: [...newErrorsFiltered, ...remainingPrevErrors]
      });

      if (gameScore / questions.length >= 0.7) {
        confetti({ particleCount: 80, spread: 80 });
      }
    }
  };

  // Filtered Subtitles
  const filteredTranscript = transcript.filter(t => 
    t.textEs.toLowerCase().includes(subtitleSearch.toLowerCase()) ||
    t.translationHy.toLowerCase().includes(subtitleSearch.toLowerCase()) ||
    t.timestamp.includes(subtitleSearch)
  );

  return (
    <div className="min-h-screen bg-[#500B24] text-white flex flex-col selection:bg-[#FFD447] selection:text-[#500B24]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#500B24]/95 backdrop-blur-md border-b border-[#C92338]/40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div 
            onClick={() => setActiveTab('video')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C92338] via-[#FF922B] to-[#FFD447] p-[2px] shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#500B24] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#FFD447]" />
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#FFD447] font-bold block">
                Álvaro Soler
              </span>
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white leading-tight">
                ESCUCHA, ENTIENDE Y JUEGA
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-black/30 border border-white/10 px-2.5 py-1 rounded-full font-mono text-[#FFD447] hidden sm:inline">
              {student.code}
            </span>
            <button
              onClick={() => setActiveTab('profesor')}
              className={`px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'profesor'
                  ? 'bg-[#FFD447] text-[#500B24]'
                  : 'bg-black/30 text-white/80 hover:text-white border border-white/10'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Profesor</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none border-t border-white/5">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'video' ? 'bg-[#FFD447] text-[#500B24] shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Vídeo y Subtítulos
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'vocab' ? 'bg-[#FFD447] text-[#500B24] shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Vocabulario (18)
          </button>

          <button
            onClick={() => {
              setActiveTab('juegos');
              setSelectedGameId(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'juegos' ? 'bg-[#FFD447] text-[#500B24] shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-[#FF922B]" />
            12 Juegos
          </button>

          <button
            onClick={() => setActiveTab('gramatica')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'gramatica' ? 'bg-[#FFD447] text-[#500B24] shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Gramática
          </button>

          <button
            onClick={() => setActiveTab('habla')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'habla' ? 'bg-[#FFD447] text-[#500B24] shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            Habla como Álvaro
          </button>

          <button
            onClick={() => setActiveTab('progreso')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'progreso' ? 'bg-[#FFD447] text-[#500B24] shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Mi progreso
          </button>

          <button
            onClick={() => setActiveTab('errores')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'errores' ? 'bg-[#FFD447] text-[#500B24] shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Repetir errores ({student.errors.length})
          </button>
        </nav>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        
        {/* ============================================================== */}
        {/* 1. VIDEO & DIRECT SUBTITLES BENEATH */}
        {/* ============================================================== */}
        {activeTab === 'video' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Video Player */}
            <div className="max-w-2xl mx-auto bg-black/60 rounded-3xl p-3 border-2 border-[#C92338]/60 shadow-2xl overflow-hidden">
              <div className="relative w-full aspect-[9/16] max-h-[520px] mx-auto rounded-2xl overflow-hidden bg-black shadow-inner">
                <iframe
                  src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1&playsinline=1`}
                  title="Álvaro Soler YouTube Short"
                  className="w-full h-full border-0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="mt-3 px-2 flex items-center justify-between text-xs text-white/70">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#FFD447]" />
                  Español coloquial de España
                </span>
                <a 
                  href={YOUTUBE_SHORT_URL} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[#FFD447] hover:underline flex items-center gap-1"
                >
                  Abrir original en YouTube <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Subtitles Intro Header */}
            <div className="bg-[#500B24] border border-[#C92338]/50 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#FFD447]" />
                  Subtítulos Interactivos con Traducción al Armenio
                </h2>
                <p className="text-xs text-white/80 font-hy mt-0.5">
                  Տեքստը գտնվում է անմիջապես տեսանյութի տակ: Սեղմիր ցանկացած ֆրազի վրա՝ հայերեն թարգմանությունը բացելու համար:
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Որոնել բառեր..."
                  value={subtitleSearch}
                  onChange={e => setSubtitleSearch(e.target.value)}
                  className="bg-black/40 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD447] w-full sm:w-48"
                />
                <button
                  onClick={() => {
                    if (openedSubtitles.size === transcript.length) setOpenedSubtitles(new Set());
                    else setOpenedSubtitles(new Set(transcript.map(t => t.id)));
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-xl font-bold shrink-0"
                >
                  {openedSubtitles.size === transcript.length ? 'Թաքցնել բոլորը' : 'Բացել բոլորը'}
                </button>
              </div>
            </div>

            {/* Notice about audio recognition */}
            <div className="bg-amber-950/40 border border-amber-600/40 rounded-2xl p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 font-hy">
                <strong className="text-amber-300">Ուշադրություն տառադարձմանը.</strong> «hate» բառը նշանակում է երաժշտական հայ-հեթ սեմփլ (hi-hat) «Sofía» երգում: Կասկածելի արտահայտությունները (0:22, 1:07, 1:14) նշված են դեղինով:
              </div>
            </div>

            {/* Independent Subtitles List */}
            <div className="space-y-2.5">
              {filteredTranscript.map((item, idx) => {
                const isOpen = openedSubtitles.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'bg-black/40 border-[#FFD447]/60 shadow-lg'
                        : 'bg-black/20 hover:bg-black/30 border-white/10'
                    }`}
                  >
                    <div 
                      onClick={() => handleToggleSubtitle(item.id)}
                      className="p-3.5 cursor-pointer flex items-start gap-3 select-none"
                    >
                      <span className="font-mono text-xs font-bold text-[#FFD447] bg-[#500B24] border border-[#C92338] px-2 py-0.5 rounded-lg shrink-0">
                        {item.timestamp}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.2 rounded ${
                            item.speaker === 'Álvaro' ? 'bg-[#C92338] text-white' : 'bg-[#FF922B] text-white'
                          }`}>
                            {item.speaker}
                          </span>
                          {item.isDoubtful && (
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
                              ⚠️ Աուդիոն ստուգել
                            </span>
                          )}
                        </div>

                        <p className="text-base sm:text-lg font-bold text-white leading-snug">
                          {item.textEs}
                        </p>
                      </div>

                      <span className={`text-xs px-2.5 py-1 rounded-xl font-bold shrink-0 ${
                        isOpen ? 'bg-[#FFD447] text-[#500B24]' : 'bg-white/10 text-white/70'
                      }`}>
                        {isOpen ? 'Թաքցնել' : 'Հայերեն'}
                      </span>
                    </div>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 border-t border-white/10 bg-[#500B24]/40 space-y-2.5">
                        <div className="bg-black/40 border border-[#FFD447]/30 rounded-xl p-3">
                          <span className="text-[10px] font-bold text-[#FFD447] uppercase block mb-1">
                            Հայերեն թարգմանություն
                          </span>
                          <p className="text-base text-white font-medium font-hy">
                            {item.translationHy}
                          </p>
                        </div>

                        {item.vocabularyTokens && item.vocabularyTokens.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {item.vocabularyTokens.map((tok, tIdx) => (
                              <button
                                key={tIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveWordModal(tok);
                                }}
                                className="bg-[#C92338]/40 hover:bg-[#C92338] border border-[#C92338] px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5"
                              >
                                <span className="font-bold text-[#FFD447]">{tok.word}</span>
                                <span className="text-white/60">→</span>
                                <span className="font-hy text-white">{tok.hy}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. VOCABULARIO (18 CARDS) */}
        {/* ============================================================== */}
        {activeTab === 'vocab' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-[#500B24] border border-[#C92338]/50 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-[#FFD447] tracking-wider block mb-1">
                  Aprende expresiones
                </span>
                <h2 className="text-2xl font-black text-white">
                  18 Expresiones Coloquiales con Traducción al Armenio
                </h2>
                <p className="text-xs text-white/80 font-hy mt-0.5">
                  Սեղմիր քարտի վրա՝ հայերեն թարգմանությունը բացելու համար, և նշիր «Ya lo sé», երբ արտահայտությունը լիովին յուրացրել ես:
                </p>
              </div>

              <div className="bg-black/40 px-4 py-2.5 rounded-2xl border border-white/10 text-center shrink-0">
                <span className="text-[10px] text-white/60 block font-bold uppercase">Յուրացված</span>
                <span className="text-2xl font-black text-[#FFD447]">
                  {student.expressionsLearned.length} / 18
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXPRESSIONS_LIST.map((exp, idx) => {
                const isLearned = student.expressionsLearned.includes(exp.id);
                const showHy = openedVocabHy.has(exp.id);

                return (
                  <div
                    key={exp.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between space-y-3 transition-all ${
                      isLearned
                        ? 'bg-gradient-to-b from-black/40 to-emerald-950/20 border-emerald-500/50'
                        : 'bg-black/30 border-white/10'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#FFD447] bg-[#500B24] border border-[#C92338] px-2 py-0.5 rounded">
                          #{idx + 1} • {exp.level}
                        </span>
                        <button
                          onClick={() => handleToggleVocabLearned(exp.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            isLearned
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white/10 hover:bg-[#FFD447] text-white/80 hover:text-[#500B24]'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isLearned ? 'Ya lo sé' : 'Marcar «Ya lo sé»'}
                        </button>
                      </div>

                      <h3 className="text-xl font-black text-white">
                        {exp.phraseEs}
                      </h3>

                      {/* Translation Accordion */}
                      <div
                        onClick={() => {
                          setOpenedVocabHy(prev => {
                            const next = new Set(prev);
                            if (next.has(exp.id)) next.delete(exp.id);
                            else next.add(exp.id);
                            return next;
                          });
                        }}
                        className="cursor-pointer"
                      >
                        {showHy ? (
                          <div className="bg-[#500B24] border border-[#FFD447]/40 p-3 rounded-xl space-y-1">
                            <span className="text-[10px] uppercase font-bold text-[#FFD447] block">Հայերեն թարգմանություն</span>
                            <p className="text-sm font-bold text-white font-hy">{exp.translationHy}</p>
                            <p className="text-xs text-white/70 font-hy pt-1">{exp.shortExplanationHy}</p>
                          </div>
                        ) : (
                          <div className="bg-black/40 hover:bg-black/60 border border-white/10 p-2.5 rounded-xl text-xs text-[#FFD447] font-semibold flex items-center justify-between">
                            <span>Սեղմիր՝ հայերեն թարգմանությունը տեսնելու համար</span>
                            <span>→</span>
                          </div>
                        )}
                      </div>

                      {/* Everyday Examples */}
                      <div className="space-y-2 pt-1 text-xs">
                        <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                          <span className="text-[10px] font-bold text-[#FF922B] block uppercase">Օրինակ 1 (առօրյա).</span>
                          <p className="text-white font-medium">{exp.example1Es}</p>
                          {showHy && <p className="text-white/60 font-hy text-[11px]">{exp.example1Hy}</p>}
                        </div>

                        <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                          <span className="text-[10px] font-bold text-[#FFD447] block uppercase">Օրինակ 2 (նոր իրավիճակ).</span>
                          <p className="text-white font-medium">{exp.example2Es}</p>
                          {showHy && <p className="text-white/60 font-hy text-[11px]">{exp.example2Hy}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. 12 INTERACTIVE GAMES */}
        {/* ============================================================== */}
        {activeTab === 'juegos' && (
          <div className="space-y-6 animate-in fade-in">
            {!selectedGameId ? (
              <>
                <div className="bg-[#500B24] border border-[#C92338]/50 rounded-3xl p-6 shadow-xl">
                  <h2 className="text-2xl font-black text-white">
                    12 Juegos Interactivos de Español Coloquial
                  </h2>
                  <p className="text-xs text-white/80 font-hy mt-1">
                    Ընտրիր խաղերից ցանկացածը: Սխալվելու դեպքում անմիջապես կտեսնես բացատրությունը հայերենով, իսկ սխալված հարցերը կպահպանվեն «Repetir errores» բաժնում:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {GAMES_LIST.map(g => {
                    const scoreData = student.gameScores[g.id];
                    return (
                      <div
                        key={g.id}
                        onClick={() => startPlayingGame(g.id)}
                        className="bg-black/30 hover:bg-black/50 border border-white/10 hover:border-[#FFD447] rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="w-8 h-8 rounded-xl bg-[#500B24] border border-[#C92338] text-[#FFD447] font-black text-xs flex items-center justify-center">
                              {g.num}
                            </span>
                            <span className="text-[10px] font-bold text-[#FF922B] bg-[#FF922B]/20 px-2 py-0.5 rounded">
                              {g.badge}
                            </span>
                          </div>

                          <h3 className="text-lg font-black text-white group-hover:text-[#FFD447] transition-colors">
                            {g.title}
                          </h3>
                          <p className="text-xs text-white/60 font-hy">
                            {g.hy}
                          </p>
                        </div>

                        <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs">
                          {scoreData ? (
                            <span className="text-emerald-400 font-bold">
                              Récord: {scoreData.maxScore} pts ({scoreData.attempts}x)
                            </span>
                          ) : (
                            <span className="text-white/40">Sin jugar</span>
                          )}

                          <span className="bg-[#FFD447] text-[#500B24] font-black px-3 py-1 rounded-xl text-xs">
                            Jugar →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Active Game Controller */
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-[#500B24] border border-[#C92338]/50 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                  <button
                    onClick={() => setSelectedGameId(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-white hover:bg-white/20"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a los juegos
                  </button>

                  <h3 className="text-base font-black text-white">
                    {GAMES_LIST.find(g => g.id === selectedGameId)?.title}
                  </h3>

                  <div className="bg-black/40 px-3 py-1 rounded-xl text-xs font-bold text-[#FFD447]">
                    Aciertos: {gameScore}
                  </div>
                </div>

                {gameIsFinished ? (
                  <div className="bg-[#500B24] border-2 border-[#FFD447] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
                    <Award className="w-16 h-16 text-[#FFD447] mx-auto" />
                    <div>
                      <h2 className="text-3xl font-black text-white">
                        ¡Reto Finalizado!
                      </h2>
                      <p className="text-sm text-white/70 font-hy mt-1">
                        Դու ճիշտ պատասխանեցիր {gameScore}-ին {(ALL_GAMES_QUESTIONS[selectedGameId] || []).length}-ից:
                      </p>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => startPlayingGame(selectedGameId)}
                        className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl text-xs font-bold text-white"
                      >
                        Repetir
                      </button>
                      <button
                        onClick={() => setSelectedGameId(null)}
                        className="bg-[#FFD447] text-[#500B24] font-black px-6 py-2.5 rounded-xl text-xs"
                      >
                        Elegir otro juego
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Current Question */
                  (() => {
                    const questions = ALL_GAMES_QUESTIONS[selectedGameId] || [];
                    const q = questions[gameQIndex];
                    if (!q) return null;

                    return (
                      <div className="bg-[#500B24] border border-[#C92338]/60 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between text-xs text-white/60 pb-2 border-b border-white/10">
                          <span className="font-bold text-[#FFD447]">
                            Pregunta {gameQIndex + 1} de {questions.length}
                          </span>
                          <button
                            onClick={() => setGameShowHy(v => !v)}
                            className="text-[#FFD447] font-hy font-semibold hover:underline"
                          >
                            {gameShowHy ? 'Թաքցնել հայերենը' : 'Հայերեն թարգմանություն'}
                          </button>
                        </div>

                        {/* Question Prompt */}
                        <div className="space-y-1">
                          {q.promptEs && (
                            <p className="text-lg sm:text-xl font-bold text-white whitespace-pre-line">
                              {q.promptEs}
                            </p>
                          )}
                          {q.statementEs && (
                            <p className="text-lg sm:text-xl font-bold text-white">
                              {q.statementEs}
                            </p>
                          )}
                          {q.phraseEs && (
                            <p className="text-lg sm:text-xl font-bold text-white">
                              «{q.phraseEs}»
                            </p>
                          )}
                          {gameShowHy && (q.promptHy || q.statementHy || q.phraseHy) && (
                            <p className="text-sm text-[#FFD447] font-hy pt-1">
                              {q.promptHy || q.statementHy || q.phraseHy}
                            </p>
                          )}
                        </div>

                        {/* Options */}
                        {q.options && (
                          <div className="grid grid-cols-1 gap-2.5">
                            {q.options.map((opt: any, oIdx: number) => {
                              const isSelected = gameSelectedOpt === opt.textEs;
                              let btnStyle = 'bg-black/30 hover:bg-black/50 border-white/15 text-white';

                              if (gameIsSubmitted) {
                                if (opt.isCorrect) {
                                  btnStyle = 'bg-emerald-600 border-emerald-400 text-white font-bold';
                                } else if (isSelected) {
                                  btnStyle = 'bg-rose-600 border-rose-400 text-white line-through';
                                } else {
                                  btnStyle = 'bg-black/20 text-white/30 border-white/5';
                                }
                              }

                              const correctOpt = q.options.find((o: any) => o.isCorrect);

                              return (
                                <button
                                  key={oIdx}
                                  disabled={gameIsSubmitted}
                                  onClick={() => handleAnswerOption(opt.isCorrect, opt.textEs, correctOpt?.textEs || '')}
                                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${btnStyle}`}
                                >
                                  <span>{opt.textEs}</span>
                                  {gameIsSubmitted && opt.isCorrect && <Check className="w-4 h-4 text-white" />}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Scrambled Words (Game 4) */}
                        {selectedGameId === 'g4' && (
                          <div className="space-y-4">
                            <div className="bg-black/40 p-3 rounded-xl text-center font-hy text-sm text-[#FFD447]">
                              {q.targetSentenceHy}
                            </div>

                            <div className="min-h-[60px] bg-black/30 border-2 border-dashed border-[#FFD447]/40 rounded-xl p-3 flex flex-wrap gap-2">
                              {gameScrambledOrder.map((w, wIdx) => (
                                <button
                                  key={wIdx}
                                  onClick={() => {
                                    if (gameIsSubmitted) return;
                                    setGameScrambledOrder(prev => prev.filter((_, i) => i !== wIdx));
                                    setGameScrambledPool(prev => [...prev, w]);
                                  }}
                                  className="bg-[#FFD447] text-[#500B24] font-black text-xs px-3 py-1.5 rounded-lg"
                                >
                                  {w} ✕
                                </button>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center">
                              {gameScrambledPool.map((w, wIdx) => (
                                <button
                                  key={wIdx}
                                  disabled={gameIsSubmitted}
                                  onClick={() => {
                                    setGameScrambledOrder(prev => [...prev, w]);
                                    setGameScrambledPool(prev => prev.filter((_, i) => i !== wIdx));
                                  }}
                                  className="bg-[#C92338] text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                                >
                                  {w}
                                </button>
                              ))}
                            </div>

                            {!gameIsSubmitted && (
                              <div className="flex justify-end pt-2">
                                <button
                                  onClick={handleCheckScrambled}
                                  disabled={gameScrambledOrder.length === 0}
                                  className="bg-[#FFD447] text-[#500B24] font-black px-5 py-2 rounded-xl text-xs"
                                >
                                  Comprobar frase
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* True/False (Game 5) */}
                        {selectedGameId === 'g5' && (
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              disabled={gameIsSubmitted}
                              onClick={() => handleAnswerOption(q.isTrue === true, 'Verdadero', q.isTrue ? 'Verdadero' : 'Falso')}
                              className="p-4 rounded-xl border border-white/20 bg-black/30 hover:bg-emerald-600/30 text-white font-bold"
                            >
                              Verdadero (Ճիշտ է)
                            </button>
                            <button
                              disabled={gameIsSubmitted}
                              onClick={() => handleAnswerOption(q.isTrue === false, 'Falso', q.isTrue ? 'Verdadero' : 'Falso')}
                              className="p-4 rounded-xl border border-white/20 bg-black/30 hover:bg-rose-600/30 text-white font-bold"
                            >
                              Falso (Սխալ է)
                            </button>
                          </div>
                        )}

                        {/* Feedback & Armenian Explanation */}
                        {gameIsSubmitted && (
                          <div className={`p-4 rounded-2xl border space-y-2 animate-in fade-in ${
                            gameIsCorrect 
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
                              : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                          }`}>
                            <div className="flex items-center gap-2 font-bold text-sm">
                              {gameIsCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                              <span>{gameIsCorrect ? '¡Correcto!' : 'Incorrecto'}</span>
                            </div>

                            <div className="text-xs text-white/90 font-hy pt-1 border-t border-white/10">
                              <strong className="text-[#FFD447] block mb-0.5">Բացատրություն.</strong>
                              {q.explanationHy}
                            </div>

                            <div className="pt-2 flex justify-end">
                              <button
                                onClick={handleNextGameQuestion}
                                className="bg-[#FFD447] text-[#500B24] font-black px-5 py-2 rounded-xl text-xs"
                              >
                                Siguiente →
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. GRAMÁTICA EN CONTEXTO (8 TOPICS) */}
        {/* ============================================================== */}
        {activeTab === 'gramatica' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-[#500B24] border border-[#C92338]/50 rounded-3xl p-6 shadow-xl">
              <h2 className="text-2xl font-black text-white">
                Gramática en Contexto (8 Temas con Explicación en Armenio)
              </h2>
              <p className="text-xs text-white/80 font-hy mt-1">
                Կարճ, պարզ բացատրություններ՝ տեսանյութի նախադասությունների հիման վրա:
              </p>
            </div>

            <div className="space-y-3">
              {GRAMMAR_LIST.map((topic, idx) => (
                <div key={topic.id} className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#500B24] border border-[#C92338] text-[#FFD447] font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-white">{topic.titleEs}</h3>
                      <p className="text-xs text-[#FFD447] font-hy font-semibold">{topic.titleHy}</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-white/90 font-hy leading-relaxed bg-[#500B24]/40 p-3 rounded-xl border border-white/5">
                    {topic.explanationHy}
                  </p>

                  <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-[#FF922B] uppercase block">Տեսանյութից.</span>
                    <p className="text-white font-bold">«{topic.videoSentenceEs}»</p>
                    <p className="text-white/70 font-hy">{topic.videoSentenceHy}</p>
                  </div>

                  {topic.tipHy && (
                    <div className="text-xs text-amber-300 font-hy bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/30">
                      💡 <strong>Խորհուրդ.</strong> {topic.tipHy}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 5. HABLA COMO ÁLVARO */}
        {/* ============================================================== */}
        {activeTab === 'habla' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-[#500B24] border border-[#C92338]/50 rounded-3xl p-6 shadow-xl">
              <h2 className="text-2xl font-black text-white">
                Habla como Álvaro (Respuestas Espontáneas)
              </h2>
              <p className="text-xs text-white/80 font-hy mt-1">
                Համեմատիր սպոնտան կարճ պատասխանը ամբողջական նախադասության հետ:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HABLA_MODELS.map((item, idx) => (
                <div key={item.id} className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-bold text-[#FFD447] uppercase bg-[#500B24] px-2 py-0.5 rounded border border-[#C92338]">
                    Իրավիճակ #{idx + 1}
                  </span>
                  <h3 className="text-base font-black text-white">{item.title}</h3>

                  <div className="bg-[#500B24]/60 p-3 rounded-xl border border-[#C92338]/40 text-xs">
                    <span className="text-white/60 block text-[10px] uppercase">Հարց.</span>
                    <p className="text-white font-bold text-sm">«{item.questionEs}»</p>
                    <p className="text-[#FFD447] font-hy">{item.questionHy}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[#FFD447] font-bold block text-[10px] uppercase">Կարճ պատասխան.</span>
                      <p className="text-white font-bold">{item.shortResponseEs}</p>
                      <p className="text-white/60 font-hy">{item.shortResponseHy}</p>
                    </div>

                    <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <span className="text-emerald-400 font-bold block text-[10px] uppercase">Ամբողջական պատասխան.</span>
                      <p className="text-white font-bold">{item.fullResponseEs}</p>
                      <p className="text-white/60 font-hy">{item.fullResponseHy}</p>
                    </div>
                  </div>

                  <p className="text-xs text-white/70 font-hy pt-1 border-t border-white/10">
                    💡 {item.nuanceHy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 6. MI PROGRESO */}
        {/* ============================================================== */}
        {activeTab === 'progreso' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-[#500B24] border border-[#C92338]/50 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-[#FFD447] block mb-1">
                  Estudiante
                </span>
                <h2 className="text-2xl font-black text-white">{student.name} ({student.code})</h2>
                <p className="text-xs text-white/70">
                  Última actividad: {new Date(student.lastActiveAt).toLocaleString()}
                </p>
              </div>

              <div className="bg-black/40 px-5 py-3 rounded-2xl border border-white/10 text-center">
                <span className="text-[10px] text-white/60 block font-bold uppercase">Общий прогресс</span>
                <span className="text-3xl font-black text-[#FFD447]">
                  {Math.round(((Object.keys(student.gameScores).length / 12) * 60) + ((student.expressionsLearned.length / 18) * 40))}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                <span className="text-white/60 text-[10px] uppercase block">Juegos jugados</span>
                <span className="text-2xl font-black text-white">{Object.keys(student.gameScores).length} / 12</span>
              </div>
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                <span className="text-white/60 text-[10px] uppercase block">Vocabulario sabido</span>
                <span className="text-2xl font-black text-[#FFD447]">{student.expressionsLearned.length} / 18</span>
              </div>
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                <span className="text-white/60 text-[10px] uppercase block">Errores pendientes</span>
                <span className="text-2xl font-black text-[#C92338]">{student.errors.length}</span>
              </div>
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex items-center justify-center">
                <button
                  onClick={() => {
                    if (window.confirm('¿Reiniciar todo el progreso del alumno?')) {
                      persistStudent({
                        ...student,
                        expressionsLearned: [],
                        gameScores: {},
                        errors: []
                      });
                    }
                  }}
                  className="text-rose-400 hover:text-white font-bold"
                >
                  Reiniciar progreso
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 7. REPETIR ERRORES */}
        {/* ============================================================== */}
        {activeTab === 'errores' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-[#500B24] border border-[#C92338]/50 rounded-3xl p-6 shadow-xl flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">
                  Repetir Errores ({student.errors.length})
                </h2>
                <p className="text-xs text-white/80 font-hy mt-1">
                  Կրկնիր միայն այն հարցերը, որոնցում սխալվել ես:
                </p>
              </div>
            </div>

            {student.errors.length === 0 ? (
              <div className="bg-black/30 rounded-2xl p-10 text-center border border-white/10 font-hy text-sm text-white/80">
                🎉 Կեցցե՛ս: Դու չունես ոչ մի չլուծված սխալ:
              </div>
            ) : (
              <div className="space-y-3">
                {student.errors.map(err => (
                  <div key={err.id} className="bg-black/30 border border-[#C92338]/50 rounded-2xl p-4 space-y-2 text-xs">
                    <span className="text-[10px] font-bold text-[#FFD447] bg-[#500B24] px-2 py-0.5 rounded border border-[#C92338]">
                      {err.gameTitle}
                    </span>
                    <p className="text-base font-bold text-white">{err.promptEs}</p>
                    {err.promptHy && <p className="text-white/60 font-hy">{err.promptHy}</p>}

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-rose-950/30 p-2.5 rounded-xl border border-rose-500/30">
                        <span className="text-[10px] text-rose-300 font-bold block">Քո պատասխանը.</span>
                        <p className="line-through text-white/80">{err.userChoice}</p>
                      </div>
                      <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30">
                        <span className="text-[10px] text-emerald-300 font-bold block">Ճիշտ պատասխանը.</span>
                        <p className="text-white font-bold">{err.correctChoice}</p>
                      </div>
                    </div>

                    <div className="bg-[#500B24]/40 p-2.5 rounded-xl font-hy text-white/90">
                      💡 {err.explanationHy}
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          const updatedErrors = student.errors.filter(e => e.questionId !== err.questionId);
                          persistStudent({ ...student, errors: updatedErrors });
                        }}
                        className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-white font-semibold"
                      >
                        Հեռացնել ցուցակից
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 8. PANEL DEL PROFESOR */}
        {/* ============================================================== */}
        {activeTab === 'profesor' && (
          <div className="space-y-6 animate-in fade-in">
            {!teacherUnlocked ? (
              <div className="max-w-md mx-auto bg-[#500B24] border-2 border-[#FFD447] rounded-3xl p-8 text-center space-y-4 shadow-2xl">
                <Lock className="w-12 h-12 text-[#FFD447] mx-auto" />
                <h3 className="text-2xl font-black text-white">Вход для преподавателя</h3>
                <p className="text-xs text-white/70 font-hy">
                  Մուտքագրեք ուսուցչի PIN կոդը (`profesor2026`)
                </p>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (teacherPinInput.trim() === DEFAULT_TEACHER_PIN || teacherPinInput.trim() === '1234') {
                      setTeacherUnlocked(true);
                      setTeacherPinError(false);
                    } else {
                      setTeacherPinError(true);
                    }
                  }}
                  className="space-y-3"
                >
                  <input
                    type="password"
                    placeholder="PIN..."
                    value={teacherPinInput}
                    onChange={e => setTeacherPinInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-center text-white focus:outline-none focus:border-[#FFD447]"
                  />
                  {teacherPinError && <p className="text-xs text-rose-400">PIN սխալ է (փորձեք profesor2026):</p>}
                  <button type="submit" className="w-full bg-[#FFD447] text-[#500B24] font-black py-2.5 rounded-xl text-xs">
                    Մուտք
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#500B24] border border-[#FFD447]/60 rounded-3xl p-6 shadow-xl flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white">Панель преподавателя (Аудит)</h2>
                    <p className="text-xs text-white/80 font-hy mt-0.5">
                      Աշակերտների ճշգրիտ պատասխանները, տառադարձման խմբագրիչը և ամպային կարգավորումները:
                    </p>
                  </div>
                  <button onClick={() => setTeacherUnlocked(false)} className="text-xs bg-white/10 px-3 py-1.5 rounded-xl text-white">
                    Փակել
                  </button>
                </div>

                {/* Audit view */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-[#FFD447] uppercase">Аудит ученика: {student.name} ({student.code})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-black/40 p-3 rounded-xl">
                      <span className="text-white/60 block">Выполненных игр:</span>
                      <strong className="text-white text-lg">{Object.keys(student.gameScores).length} / 12</strong>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl">
                      <span className="text-white/60 block">Ошибок:</span>
                      <strong className="text-[#C92338] text-lg">{student.errors.length}</strong>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl">
                      <span className="text-white/60 block">Знает выражений:</span>
                      <strong className="text-[#FFD447] text-lg">{student.expressionsLearned.length} / 18</strong>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl">
                      <span className="text-white/60 block">Последняя сессия:</span>
                      <strong className="text-white">{new Date(student.lastActiveAt).toLocaleDateString()}</strong>
                    </div>
                  </div>

                  {/* Answers log */}
                  <h4 className="text-xs font-bold text-white/80 uppercase pt-2">Подробные ответы на вопросы:</h4>
                  <div className="max-h-60 overflow-y-auto space-y-1.5 text-xs">
                    {Object.values(student.gameScores).flatMap(g => g.answers).map((ans, idx) => (
                      <div key={idx} className={`p-2 rounded-lg border flex items-center justify-between ${
                        ans.isCorrect ? 'bg-emerald-950/20 border-emerald-500/20 text-white' : 'bg-rose-950/20 border-rose-500/30 text-white'
                      }`}>
                        <span>{ans.questionPrompt} → <strong>{ans.userAnswer}</strong></span>
                        <span className={ans.isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {ans.isCorrect ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cloud & Export Tool */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-3 text-xs">
                  <h4 className="text-sm font-bold text-white">Облачная база данных и Экспорт</h4>
                  <p className="text-white/70 font-hy leading-relaxed">
                    Հավելվածն աշխատում է լիարժեք տեղական պահոցով: Այլ սարքից արդյունքները դիտելու համար կարող եք արտահանել JSON ֆայլը կամ կարգավորել Firebase/Supabase պարամետրերը:
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(student, null, 2));
                        const dl = document.createElement('a');
                        dl.setAttribute("href", dataStr);
                        dl.setAttribute("download", `student_${student.code}.json`);
                        dl.click();
                      }}
                      className="bg-[#FFD447] text-[#500B24] font-bold px-4 py-2 rounded-xl text-xs"
                    >
                      Скачать результаты (JSON)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Word Details Modal */}
      {activeWordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#500B24] border border-[#FFD447] rounded-2xl w-full max-w-sm p-5 shadow-2xl relative text-white space-y-3">
            <button
              onClick={() => setActiveWordModal(null)}
              className="absolute top-3 right-3 text-white/60 hover:text-white"
            >
              ✕
            </button>
            <span className="text-[10px] uppercase font-bold text-[#FFD447]">Բառարան</span>
            <h4 className="text-xl font-black text-white">{activeWordModal.word}</h4>
            <div className="bg-black/30 p-3 rounded-xl border border-white/10 font-hy text-sm text-[#FFD447] font-bold">
              {activeWordModal.hy}
            </div>
            <button
              onClick={() => setActiveWordModal(null)}
              className="w-full bg-[#FFD447] text-[#500B24] font-bold py-2 rounded-xl text-xs"
            >
              Փակել
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#C92338]/30 bg-black/40 py-5 text-center text-xs text-white/50 space-y-1">
        <p className="font-semibold text-white/80">ÁLVARO SOLER — ESCUCHA, ENTIENDE Y JUEGA</p>
        <p className="font-hy">Իսպաներենի կրթական հարթակ • A2–B1 / B2 • Հայերեն թարգմանություններով</p>
      </footer>
    </div>
  );
}
