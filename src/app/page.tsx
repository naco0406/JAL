'use client';

import { Spin, Typography, message } from 'antd';
import { useState } from 'react';
import FileUpload from './components/FileUpload';
import SyllabusDisplay from './components/SyllabusDisplay';
import { SyllabusInfo } from './types';
import { OpenAIService } from './utils/openai'; // Import OpenAIService

const { Title } = Typography;

export default function Home() {
  const [syllabusInfo, setSyllabusInfo] = useState<SyllabusInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openAIService = new OpenAIService(); // Instantiate OpenAIService

  const handleFileUploaded = async (content: string) => {
    setIsLoading(true);
    try {
      const analysis = await openAIService.analyzeSyllabus(content);
      setSyllabusInfo(analysis);
    } catch (error) {
      console.error('오류:', error);
      message.error('강의 계획서 분석에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Title>JAL - Just Above the Line</Title>
      <FileUpload onFileUploaded={handleFileUploaded} />
      {isLoading ? (
        <div className="mt-8">
          <Spin size="large" tip="강의 계획서를 분석 중입니다..." />
        </div>
      ) : (
        <SyllabusDisplay syllabusInfo={syllabusInfo} />
      )}
    </main>
  );
}
