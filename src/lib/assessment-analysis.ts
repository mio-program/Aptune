import { assessmentQuestions } from '@/data/assessment-questions';
// import { diagnosisTypes } from '@/data/diagnosis-types';

export interface AnalysisResult {
  primaryType: string;
  scores: Record<string, number>;
  confidence: number;
}

export function analyzeAssessmentResults(responses: Record<string, number>): AnalysisResult {
  // 6タイプのスコア計算
  const scores: Record<string, number> = { FV: 0, VA: 0, HC: 0, MB: 0, AT: 0, GS: 0 };
  for (const q of assessmentQuestions) {
    const value = responses[q.id];
    if (value == null) continue;
    for (const type of Object.keys(scores)) {
      scores[type] += (q.weights[type] || 0) * value;
    }
  }
  // 最高スコアのタイプ
  const primaryType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  // 信頼度（仮: 最高スコア/合計スコア）
  const total = Object.values(scores).reduce((a, b) => a + Math.abs(b), 0);
  const confidence = total > 0 ? Math.abs(scores[primaryType]) / total : 0;
  return { primaryType, scores, confidence };
}

export function calculateDetailedTypeFromStage2(responses: Record<string, number>): AnalysisResult {
  // Stage2の詳細分析（Stage1と同じロジックを使用）
  return analyzeAssessmentResults(responses);
} 