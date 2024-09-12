import { NextResponse } from 'next/server';
import { OpenAIService } from '@/app/utils/openai';

const openAIService = new OpenAIService();

export async function POST(req: Request) {
    try {
        const { content } = await req.json();
        const analysis = await openAIService.analyzeSyllabus(content);
        return NextResponse.json({ analysis });
    } catch (error) {
        console.error('API 라우트 오류:', error);
        return NextResponse.json({ error: '분석 중 오류가 발생했습니다.' }, { status: 500 });
    }
}