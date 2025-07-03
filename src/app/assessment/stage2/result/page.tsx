'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { characters, Character } from '@/data/characters';
import Image from 'next/image';
import Link from 'next/link';
import type { Database } from '@/lib/database.types';
import type { MainTypeResult, DetailedTypeResult } from '@/lib/assessment-analysis';

type Assessment = Database['public']['Tables']['assessments']['Row'];

const CharacterCard = ({ character }: { character: Character }) => (
    <div className="bg-white rounded-lg shadow-xl p-6 transition-transform transform hover:scale-105">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{character.name}</h3>
        {character.image && (
            <div className="mb-4">
            <Image src={character.image} alt={character.name} width={200} height={200} className="rounded-lg mx-auto" />
            </div>
        )}
        <p className="text-gray-600 mb-4">{character.description}</p>
        <div className="text-left">
            <h4 className="font-semibold mb-2">主な特性:</h4>
            <ul className="list-disc list-inside text-gray-600">
            {character.traits.map((trait, index) => <li key={index}>{trait}</li>)}
            </ul>
        </div>
    </div>
);


export default function Stage2ResultPage() {
    const searchParams = useSearchParams();
    const assessmentId = searchParams.get('assessmentId');
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [character, setCharacter] = useState<Character | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!assessmentId) {
            setError('診断IDが見つかりません。');
            setIsLoading(false);
            return;
        }

        const supabase = createClient();
        const fetchAssessment = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('assessments')
                .select('*')
                .eq('id', assessmentId)
                .single();

            if (error || !data) {
                setError('診断結果の取得に失敗しました。');
            } else {
                setAssessment(data);
                const stage1Result = data.result as MainTypeResult | null;
                const mainTypeId = stage1Result?.main_type.id;
                if (mainTypeId) {
                    const foundCharacter = characters.find(c => c.id === mainTypeId);
                    setCharacter(foundCharacter || null);
                }
            }
            setIsLoading(false);
        };

        fetchAssessment();
    }, [assessmentId]);

    const result = assessment?.result as MainTypeResult | null;
    const detailedResult = assessment?.detailed_result as DetailedTypeResult | null;

    if (isLoading) return <div className="text-center py-12">結果を読み込んでいます...</div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
    if (!assessment || !result || !detailedResult) return <div className="text-center py-12">診断結果が見つかりません。</div>;
    
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2">あなたの詳細診断結果</h1>
                <p className="text-xl text-gray-600">お疲れ様でした！これがあなたの内なるタイプです。</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
                {character && <CharacterCard character={character} />}
                
                <div className="bg-white rounded-lg shadow-xl p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">分析サマリー</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-lg">基本タイプ (Stage 1)</h4>
                            <p className="text-gray-700">{result.main_type.name}: {result.main_type.description}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg">最終アーキタイプ (Stage 2)</h4>
                            <p className="font-bold text-blue-600 text-xl">{detailedResult.final_archetype.name}</p>
                            <p className="text-gray-700">{detailedResult.final_archetype.description}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg">AI適応スタイル</h4>
                            <p className="text-gray-700">{detailedResult.ai_adaptation_style.id}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg">学習・成長ドライバー</h4>
                            <p className="text-gray-700">{detailedResult.learning_driver.id}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-12">
                <Link href="/dashboard" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                    ダッシュボードで学習コンテンツを見る
                </Link>
            </div>
        </div>
    );
} 