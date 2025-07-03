import { assessmentQuestions } from '../data/assessment-questions';

export type CareerType = 'FV' | 'AT' | 'VA' | 'HC' | 'MB' | 'GS';

export interface UserAnswers {
  [questionId: string]: number; // 1-5
}

export type TypeScores = {
  [type in CareerType]: number;
};

export interface DiagnosisResult {
  scores: TypeScores;
  primaryType: CareerType;
  secondaryTypes: CareerType[];
}

export function calculateScores(answers: UserAnswers): DiagnosisResult {
  const scores: TypeScores = { FV: 0, AT: 0, VA: 0, HC: 0, MB: 0, GS: 0 };
  for (const q of assessmentQuestions) {
    const value = answers[q.id];
    if (!value) continue;
    for (const type of Object.keys(scores) as CareerType[]) {
      scores[type] += (q.weights[type] || 0) * value;
    }
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return {
    scores,
    primaryType: sorted[0][0] as CareerType,
    secondaryTypes: [sorted[1][0] as CareerType, sorted[2][0] as CareerType],
  };
} 