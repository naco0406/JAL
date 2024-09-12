import React from 'react';
import { Card, List, Typography, Table } from 'antd';
import { SyllabusInfo } from '../types';

const { Title, Text } = Typography;

interface SyllabusDisplayProps {
  syllabusInfo: SyllabusInfo | null;
}

const SyllabusDisplay: React.FC<SyllabusDisplayProps> = ({ syllabusInfo }) => {
  if (!syllabusInfo) return null;

  const columns = [
    {
      title: '날짜',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '세부 내용',
      dataIndex: 'details',
      key: 'details',
      render: (details: string[]) => details.join(', '),
    },
  ];

  return (
    <Card title="강의 계획서 정보" className="w-full max-w-2xl mx-auto mt-8">
      <Title level={4}>{syllabusInfo.courseName} ({syllabusInfo.courseCode})</Title>
      <Text strong>교수: </Text>
      <Text>{syllabusInfo.professorName.join(', ')}</Text>

      <Title level={5} className="mt-4">수업 일정</Title>
      <Text>시간: {syllabusInfo.schedule.hours}</Text>
      <br />
      <Text>장소: {syllabusInfo.schedule.location}</Text>

      <Table
        className="mt-4"
        dataSource={syllabusInfo.schedule.sessions}
        columns={columns}
        pagination={false}
        rowKey="date"
      />

      <Title level={5} className="mt-4">평가 기준</Title>
      <Text>{syllabusInfo.gradingCriteria}</Text>
    </Card>
  );
};

export default SyllabusDisplay;