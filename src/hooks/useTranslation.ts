'use client';

import { useState, useEffect } from 'react';
import { Language } from '@/types';

type TranslationKey = string;
type Translations = Record<string, any>;

const translations: Record<Language, Translations> = {
  ko: {
    'service.name': '한국 여행 가이드 챗봇',
    'service.slogan': '한국 여행이 더 쉬워집니다',
    'service.description': '한국을 방문하는 외국인 여행객을 위한 AI 기반 여행 가이드 서비스입니다. 궁금한 모든 것을 물어보세요!',
    'auth.login': '로그인',
    'auth.loginGuide': '로그인하여 한국 여행을 시작하세요',
    'auth.loginWith': '{{provider}}로 로그인',
    'auth.logout': '로그아웃',
    'auth.deleteAccount': '회원탈퇴',
    'chat.newChat': '새 채팅 시작',
    'chat.chatHistory': '채팅 기록',
    'chat.sendMessage': '메시지 보내기',
    'chat.typeMessage': '메시지를 입력하세요...',
    'profile.profile': '프로필',
    'profile.name': '이름',
    'profile.email': '이메일',
    'profile.joinDate': '가입일',
    'header.brandName': 'Korea Travel Guide',
    'header.chat': '채팅',
    'header.guides': '가이드',
    'header.searchPlaceholder': '가이드 검색...',
    'header.searchPlaceholderFull': '가이드 이름이나 전문분야를 검색하세요',
    'header.profile': '프로필',
    'header.guideManagement': '가이드 관리',
    'common.loading': '로딩 중...',
    'common.error': '오류가 발생했습니다',
    'common.retry': '다시 시도',
    'common.cancel': '취소',
    'common.confirm': '확인',
    'common.save': '저장',
    'common.edit': '편집',
    'common.delete': '삭제',
    'common.back': '뒤로',
    'common.next': '다음',
    'common.language': '언어',
    'profile.editProfile': '프로필 수정',
    'profile.location': '위치',
    'profile.bio': '소개',
    'profile.joinedIn': '가입',
    'profile.nickname': '닉네임',
    'profile.specialties': '전문분야',
    'profile.languages': '지원언어',
    'profile.rating': '평균 평점',
    'profile.reviews': '리뷰',
    'profile.status': '상태',
    'profile.online': '온라인',
    'profile.offline': '오프라인',
    'profile.about': '소개',
    'profile.ratings': '평점',
    'profile.guides': '가이드',
    'profile.settings': '설정',
    'profile.accountSettings': '계정 설정',
    'profile.languageSettings': '언어 설정',
    'profile.languageDescription': '인터페이스 언어를 선택하세요.',
    'profile.accountActions': '계정 관리',
    'profile.accountActionsDescription': '계정 보안 및 데이터를 관리합니다.',
    'profile.logoutConfirm': '정말로 로그아웃하시겠습니까?',
    'profile.deleteConfirm': '계정을 삭제하면 모든 채팅 기록과 개인정보가 영구적으로 삭제됩니다. 정말로 계정을 삭제하시겠습니까?',
    'profile.deleteWarning': '이 작업은 되돌릴 수 없습니다!',
    'profile.editProfileTitle': '프로필 수정',
    'profile.changePhoto': '프로필 사진 변경',
    'profile.emailCannotChange': '이메일은 변경할 수 없습니다',
    'profile.bioHelp': '자기소개를 입력하세요',
    'profile.specialtiesHelp': '예: 역사, 음식, 문화',
    'profile.languagesHelp': '예: 한국어, 영어, 일본어',
    'profile.saveChanges': '변경사항 저장',
    'profile.reviewsContent': '리뷰 내용이 여기에 표시됩니다.',
    'profile.guidesContent': '가이드 내용이 여기에 표시됩니다.',
  },
  en: {
    'service.name': 'Korea Travel Guide Chatbot',
    'service.slogan': 'Make your Korea travel easier',
    'service.description': 'AI-powered travel guide service for foreign visitors to Korea. Ask us anything you want to know!',
    'auth.login': 'Login',
    'auth.loginGuide': 'Login to start your Korea journey',
    'auth.loginWith': 'Login with {{provider}}',
    'auth.logout': 'Logout',
    'auth.deleteAccount': 'Delete Account',
    'chat.newChat': 'Start New Chat',
    'chat.chatHistory': 'Chat History',
    'chat.sendMessage': 'Send Message',
    'chat.typeMessage': 'Type your message...',
    'profile.profile': 'Profile',
    'profile.name': 'Name',
    'profile.email': 'Email',
    'profile.joinDate': 'Join Date',
    'header.brandName': 'Korea Travel Guide',
    'header.chat': 'Chat',
    'header.guides': 'Guides',
    'header.searchPlaceholder': 'Search guides...',
    'header.searchPlaceholderFull': 'Search by guide name or specialty',
    'header.profile': 'Profile',
    'header.guideManagement': 'Guide Management',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Retry',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.language': 'Language',
    'profile.editProfile': 'Edit Profile',
    'profile.location': 'Location',
    'profile.bio': 'Bio',
    'profile.joinedIn': 'Joined in',
    'profile.nickname': 'Nickname',
    'profile.specialties': 'Specialties',
    'profile.languages': 'Languages',
    'profile.rating': 'Average Rating',
    'profile.reviews': 'reviews',
    'profile.status': 'Status',
    'profile.online': 'Online',
    'profile.offline': 'Offline',
    'profile.about': 'About',
    'profile.ratings': 'Ratings',
    'profile.guides': 'Guides',
    'profile.settings': 'Settings',
    'profile.accountSettings': 'Account Settings',
    'profile.languageSettings': 'Language',
    'profile.languageDescription': 'Select your preferred language for the interface.',
    'profile.accountActions': 'Account Actions',
    'profile.accountActionsDescription': 'Manage your account security and data.',
    'profile.logoutConfirm': 'Are you sure you want to logout?',
    'profile.deleteConfirm': 'Deleting your account will permanently remove all chat history and personal information. Are you sure you want to delete your account?',
    'profile.deleteWarning': 'This action cannot be undone!',
    'profile.editProfileTitle': 'Edit Profile',
    'profile.changePhoto': 'Click to change profile photo',
    'profile.emailCannotChange': 'Email cannot be changed',
    'profile.bioHelp': 'Tell us about yourself',
    'profile.specialtiesHelp': 'e.g., History, Food, Culture',
    'profile.languagesHelp': 'e.g., Korean, English, Japanese',
    'profile.saveChanges': 'Save Changes',
    'profile.reviewsContent': 'Reviews content will be displayed here.',
    'profile.guidesContent': 'Guides content will be displayed here.',
  },
  'zh-CN': {
    'service.name': '韩国旅游指南聊天机器人',
    'service.slogan': '让您的韩国之旅更轻松',
    'service.description': '为访韩外国游客提供AI驱动的旅游指南服务。有任何问题都可以问我们！',
    'auth.login': '登录',
    'auth.loginGuide': '登录开始您的韩国之旅',
    'auth.loginWith': '使用{{provider}}登录',
    'auth.logout': '登出',
    'auth.deleteAccount': '删除账户',
    'chat.newChat': '开始新对话',
    'chat.chatHistory': '聊天记录',
    'chat.sendMessage': '发送消息',
    'chat.typeMessage': '请输入您的消息...',
    'profile.profile': '个人资料',
    'profile.name': '姓名',
    'profile.email': '邮箱',
    'profile.joinDate': '注册日期',
    'header.brandName': 'Korea Travel Guide',
    'header.chat': '聊天',
    'header.guides': '导游',
    'header.searchPlaceholder': '搜索导游...',
    'header.searchPlaceholderFull': '按导游名称或专业领域搜索',
    'header.profile': '个人资料',
    'header.guideManagement': '导游管理',
    'common.loading': '加载中...',
    'common.error': '发生错误',
    'common.retry': '重试',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.save': '保存',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.back': '返回',
    'common.next': '下一步',
    'common.language': '语言',
  },
  ja: {
    'service.name': '韓国旅行ガイドチャットボット',
    'service.slogan': '韓国旅行をもっと簡単に',
    'service.description': '韓国を訪問する外国人旅行者のためのAI搭載旅行ガイドサービスです。何でもお気軽にお聞きください！',
    'auth.login': 'ログイン',
    'auth.loginGuide': 'ログインして韓国旅行を始めましょう',
    'auth.loginWith': '{{provider}}でログイン',
    'auth.logout': 'ログアウト',
    'auth.deleteAccount': 'アカウント削除',
    'chat.newChat': '新しいチャットを開始',
    'chat.chatHistory': 'チャット履歴',
    'chat.sendMessage': 'メッセージを送信',
    'chat.typeMessage': 'メッセージを入力してください...',
    'profile.profile': 'プロフィール',
    'profile.name': '名前',
    'profile.email': 'メール',
    'profile.joinDate': '登録日',
    'header.brandName': 'Korea Travel Guide',
    'header.chat': 'チャット',
    'header.guides': 'ガイド',
    'header.searchPlaceholder': 'ガイドを検索...',
    'header.searchPlaceholderFull': 'ガイド名または専門分野で検索',
    'header.profile': 'プロフィール',
    'header.guideManagement': 'ガイド管理',
    'common.loading': '読み込み中...',
    'common.error': 'エラーが発生しました',
    'common.retry': '再試行',
    'common.cancel': 'キャンセル',
    'common.confirm': '確認',
    'common.save': '保存',
    'common.edit': '編集',
    'common.delete': '削除',
    'common.back': '戻る',
    'common.next': '次へ',
    'common.language': '言語',
  },
  es: {
    'service.name': 'Chatbot Guía de Viaje de Corea',
    'service.slogan': 'Haz que tu viaje a Corea sea más fácil',
    'service.description': 'Servicio de guía de viaje impulsado por IA para visitantes extranjeros a Corea. ¡Pregúntanos lo que quieras saber!',
    'auth.login': 'Iniciar Sesión',
    'auth.loginGuide': 'Inicia sesión para comenzar tu viaje a Corea',
    'auth.loginWith': 'Iniciar sesión con {{provider}}',
    'auth.logout': 'Cerrar Sesión',
    'auth.deleteAccount': 'Eliminar Cuenta',
    'chat.newChat': 'Iniciar Nuevo Chat',
    'chat.chatHistory': 'Historial de Chat',
    'chat.sendMessage': 'Enviar Mensaje',
    'chat.typeMessage': 'Escribe tu mensaje...',
    'profile.profile': 'Perfil',
    'profile.name': 'Nombre',
    'profile.email': 'Correo',
    'profile.joinDate': 'Fecha de Registro',
    'header.brandName': 'Korea Travel Guide',
    'header.chat': 'Chat',
    'header.guides': 'Guías',
    'header.searchPlaceholder': 'Buscar guías...',
    'header.searchPlaceholderFull': 'Buscar por nombre de guía o especialidad',
    'header.profile': 'Perfil',
    'header.guideManagement': 'Gestión de Guías',
    'common.loading': 'Cargando...',
    'common.error': 'Ocurrió un error',
    'common.retry': 'Reintentar',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.save': 'Guardar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.language': 'Idioma',
  },
};

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('ko');

  useEffect(() => {
    // Get saved language from localStorage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      const supportedLang = Object.keys(translations).find(lang =>
        lang.startsWith(browserLang)
      ) as Language;

      if (supportedLang) {
        setLanguage(supportedLang);
      }
    }

    // Listen for language change events
    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const t = (key: TranslationKey, params?: Record<string, string>): string => {
    const value = translations[language][key];

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters like {{provider}}
    if (params) {
      return Object.entries(params).reduce((text, [param, val]) => {
        return text.replace(new RegExp(`{{${param}}}`, 'g'), val);
      }, value);
    }

    return value;
  };

  return { t, language };
};