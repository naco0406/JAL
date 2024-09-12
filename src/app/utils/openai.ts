import OpenAI from 'openai';
import { SyllabusInfo } from '../types';
import { SyllabusAnalysisSystemMessage } from './SystemMessage';

export class OpenAIService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
            dangerouslyAllowBrowser: true
        });
    }

    async analyzeSyllabus(content: string): Promise<SyllabusInfo> {
        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: SyllabusAnalysisSystemMessage
                    },
                    {
                        role: "user",
                        content: `Please analyze the following course syllabus and extract the information in the specified JSON format: ${content}`
                    }
                ],
                temperature: 0.2,
            });

            const result = completion.choices[0].message.content?.trim();

            if (!result) {
                throw new Error("분석 결과가 없습니다.");
            }

            return JSON.parse(result) as SyllabusInfo;
        } catch (error) {
            console.error('OpenAI API 오류:', error);
            throw error;
        }
    }
}