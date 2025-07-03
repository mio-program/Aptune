import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { calculateDetailedTypeFromStage2 } from '@/lib/assessment-analysis';
import type { Database } from '@/lib/database.types';

type Answer = { questionId: string; value: number };

export async function POST(request: Request) {
  const { assessmentId, answers } = await request.json();
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data: { session },} = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the original assessment from Stage 1
  const { data: assessment, error: fetchError } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', assessmentId)
    .single();

  if (fetchError || !assessment) {
    return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
  }

  // Authorization check
  if (assessment.user_id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Check payment status again on the server side
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('subscription_status, premium_assessment_purchased')
    .eq('user_id', session.user.id)
    .single();

  if (!profile?.subscription_status && !profile?.premium_assessment_purchased) {
    return NextResponse.json({ error: 'Payment required' }, { status: 402 });
  }

  const stage1Result = assessment.result as any;
  const stage2Answers = Object.entries(answers).map(([questionId, value]) => ({
    questionId,
    value,
  })) as Answer[];

  // Calculate detailed result
  const detailedResult = calculateDetailedTypeFromStage2(stage1Result, stage2Answers);

  // Combine answers from both stages
  const allAnswers = [
      ...(assessment.answers as any[]), 
      ...Object.entries(answers).map(([question_id, answer_value]) => ({ question_id, answer_value }))
  ];

  // Update the assessment record
  const { data: updatedAssessment, error: updateError } = await supabase
    .from('assessments')
    .update({
      answers: allAnswers,
      detailed_result: detailedResult as any,
      stage: 2,
      updated_at: new Date().toISOString(),
    })
    .eq('id', assessmentId)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating assessment:', updateError);
    return NextResponse.json({ error: 'Failed to update assessment' }, { status: 500 });
  }

  return NextResponse.json({ assessmentId: updatedAssessment.id });
} 