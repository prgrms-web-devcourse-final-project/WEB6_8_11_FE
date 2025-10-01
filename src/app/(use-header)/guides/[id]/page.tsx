'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GuideProfilePage } from '@/components/guide/GuideProfilePage';
import { useAuth } from '@/hooks/useAuth';
import { GuideProfile, ChatRating } from '@/types';

// Mock guide data for development
const mockGuides: { [key: string]: GuideProfile } = {
  guide1: {
    id: 'guide1',
    name: '김민수',
    nickname: '서울전문가',
    email: 'guide1@example.com',
    userType: 'guide',
    joinDate: new Date('2023-01-15'),
    provider: 'google',
    specialties: ['서울관광', '역사문화', '맛집탐방'],
    description: '서울의 숨겨진 명소와 맛집을 소개해드립니다. 15년간 서울에서 살면서 쌓인 경험과 지식을 바탕으로 특별한 여행을 만들어드리겠습니다.',
    languages: ['한국어', '영어'],
    isOnline: true,
    averageRating: 4.8,
    totalReviews: 156,
    profileImage: '/guide1.jpg',
  },
  guide2: {
    id: 'guide2',
    name: '이영희',
    nickname: '부산가이드',
    email: 'guide2@example.com',
    userType: 'guide',
    joinDate: new Date('2023-03-20'),
    provider: 'kakao',
    specialties: ['부산관광', '해변문화', '야경투어'],
    description: '부산의 아름다운 바다와 야경을 함께 즐겨보세요. 해운대, 광안리, 감천문화마을까지 부산의 모든 것을 알려드립니다.',
    languages: ['한국어', '일본어', '영어'],
    isOnline: false,
    averageRating: 4.9,
    totalReviews: 203,
    profileImage: '/guide2.jpg',
  },
  guide3: {
    id: 'guide3',
    name: '박철수',
    nickname: '제주마스터',
    email: 'guide3@example.com',
    userType: 'guide',
    joinDate: new Date('2022-11-10'),
    provider: 'naver',
    specialties: ['제주관광', '자연체험', '트래킹'],
    description: '제주도의 자연과 함께하는 특별한 여행을 만들어드립니다. 한라산 등반부터 올레길 걷기까지 제주도를 온몸으로 느껴보세요.',
    languages: ['한국어', '중국어'],
    isOnline: true,
    averageRating: 4.7,
    totalReviews: 98,
    profileImage: '/guide3.jpg',
  },
  guide4: {
    id: 'guide4',
    name: '최지원',
    nickname: '경주가이드',
    email: 'guide4@example.com',
    userType: 'guide',
    joinDate: new Date('2023-06-05'),
    provider: 'google',
    specialties: ['경주관광', '역사문화', '전통문화'],
    description: '천년고도 경주의 역사와 문화를 생생하게 전해드립니다. 불국사, 석굴암에서부터 첨성대까지 경주의 모든 유적지를 안내해드려요.',
    languages: ['한국어', '영어', '중국어'],
    isOnline: true,
    averageRating: 4.6,
    totalReviews: 87,
    profileImage: '/guide4.jpg',
  },
  guide5: {
    id: 'guide5',
    name: '정수연',
    nickname: '전주맛집러',
    email: 'guide5@example.com',
    userType: 'guide',
    joinDate: new Date('2023-04-12'),
    provider: 'kakao',
    specialties: ['전주관광', '맛집탐방', '전통문화'],
    description: '전주 한옥마을과 맛집을 누구보다 잘 아는 로컬 가이드입니다. 비빔밥의 고장에서 진짜 맛집만 소개해드릴게요!',
    languages: ['한국어', '일본어'],
    isOnline: false,
    averageRating: 4.5,
    totalReviews: 142,
    profileImage: '/guide5.jpg',
  },
};

interface GuideDetailPageProps {
  params: {
    id: string;
  };
}

export default function GuideDetailPage({ params }: GuideDetailPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = params;

  const guide = mockGuides[id];

  const handleBack = () => {
    router.back();
  };

  const handleStartChat = async () => {
    try {
      // 실제로는 API 호출하여 새 채팅 생성
      const newChatId = Date.now().toString();

      // Mock: 새 가이드 채팅 생성
      console.log('Starting chat with guide:', guide.id);

      // 채팅 페이지로 이동
      router.push(`/chat/${newChatId}?guideId=${guide.id}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  // Guide not found
  if (!guide) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2>가이드를 찾을 수 없습니다</h2>
        <button onClick={handleBack}>돌아가기</button>
      </div>
    );
  }

  return (
    <GuideProfilePage
      guide={guide}
      reviews={[]} // 실제로는 API에서 리뷰 데이터 가져오기
      onBack={handleBack}
      onStartChat={handleStartChat}
    />
  );
}