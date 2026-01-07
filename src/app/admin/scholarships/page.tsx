'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ExternalLink,
    Filter,
    ChevronDown,
} from 'lucide-react';

/**
 * AdminScholarshipsPage
 * Feature 7: 장학금 관리
 */

// 장학금 타입 정의
interface Scholarship {
    id: string;
    title: string;
    category: string;
    amount_text: string;
    deadline: string;
    views?: number;
    scraps?: number;
    organization?: string;
    target_summary?: string;
    support_conditions?: string;
    description?: string;
    url?: string;
}

export default function AdminScholarshipsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, title: string } | null>(null);
    const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null); // 수정 중인 장학금

    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        amount_text: '',
        deadline: '',
        organization: '',
        target_summary: '',
        support_conditions: '',
        description: '',
        url: '',
    });

    // 장학금 데이터 로드
    React.useEffect(() => {
        fetchScholarships();
    }, []);

    const fetchScholarships = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/scholarships');
            if (!response.ok) throw new Error('Failed to fetch scholarships');
            const data = await response.json();
            console.log('Fetched scholarships:', data);
            setScholarships(data.data || []);
        } catch (error) {
            console.error('Error fetching scholarships:', error);
            alert('장학금 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 삭제 핸들러
    const handleDelete = async (id: string, title: string) => {
        setDeleteConfirm({ id, title });
    };

    // 삭제 확인
    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            const response = await fetch(`/api/scholarships/${deleteConfirm.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('삭제 실패');

            alert('장학금이 삭제되었습니다.');
            await fetchScholarships();
        } catch (error) {
            console.error('Delete error:', error);
            alert('장학금 삭제 중 오류가 발생했습니다.');
        } finally {
            setDeleteConfirm(null);
        }
    };

    // 외부 링크 핸들러
    const handleExternalLink = (url: string | undefined) => {
        if (!url) {
            alert('등록된 URL이 없습니다.');
            return;
        }
        window.open(url, '_blank');
    };

    // 폼 입력 핸들러
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // 폼 제출 핸들러
    const handleSubmit = async () => {
        console.log('Form submission started', formData);

        // 필수 필드 검증
        if (!formData.title || !formData.category || !formData.amount_text || !formData.deadline) {
            const missingFields = [];
            if (!formData.title) missingFields.push('장학금명');
            if (!formData.category) missingFields.push('분류');
            if (!formData.amount_text) missingFields.push('지원 금액');
            if (!formData.deadline) missingFields.push('마감일');

            alert(`필수 항목을 모두 입력해주세요.\n누락된 항목: ${missingFields.join(', ')}`);
            console.error('Missing required fields:', missingFields);
            return;
        }

        setIsSubmitting(true);
        try {
            const url = editingScholarship
                ? `/api/scholarships/${editingScholarship.id}`
                : '/api/scholarships';

            const method = editingScholarship ? 'PATCH' : 'POST';

            console.log(`Sending ${method} request to ${url}`);

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log('API Response:', result);

            if (!response.ok) {
                throw new Error(result.error || (editingScholarship ? '수정 실패' : '등록 실패'));
            }

            alert(editingScholarship ? '장학금이 수정되었습니다.' : '장학금이 성공적으로 등록되었습니다!');
            setIsModalOpen(false);
            setEditingScholarship(null); // 수정 모드 초기화

            // 폼 초기화
            setFormData({
                title: '',
                category: '',
                amount_text: '',
                deadline: '',
                organization: '',
                target_summary: '',
                support_conditions: '',
                description: '',
                url: '',
            });
            // 데이터 다시 불러오기
            await fetchScholarships();
        } catch (error) {
            console.error('Scholarship submit error:', error);
            alert(`오류가 발생했습니다.\n${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 수정 버튼 핸들러
    const handleEdit = (scholarship: Scholarship) => {
        setEditingScholarship(scholarship);
        setFormData({
            title: scholarship.title,
            category: scholarship.category,
            amount_text: scholarship.amount_text,
            deadline: new Date(scholarship.deadline).toISOString().split('T')[0],
            organization: scholarship.organization || '',
            target_summary: scholarship.target_summary || '',
            support_conditions: scholarship.support_conditions || '',
            description: scholarship.description || '',
            url: scholarship.url || '',
        });
        setIsModalOpen(true);
    };

    // 등록 버튼 핸들러 (초기화 후 열기)
    const handleOpenCreateModal = () => {
        setEditingScholarship(null);
        setFormData({
            title: '',
            category: '',
            amount_text: '',
            deadline: '',
            organization: '',
            target_summary: '',
            support_conditions: '',
            description: '',
            url: '',
        });
        setIsModalOpen(true);
    };

    const getCategoryLabel = (cat: string) => {
        switch (cat) {
            case 'tuition': return '등록금성';
            case 'living': return '생활비성';
            case 'mixed': return '복합지원';
            default: return '기타';
        }
    };

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'tuition': return 'bg-blue-50 text-blue-600';
            case 'living': return 'bg-green-50 text-green-600';
            case 'mixed': return 'bg-purple-50 text-purple-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    const filteredScholarships = scholarships.filter(s => {
        const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = !selectedCategory || s.category === selectedCategory;
        return matchSearch && matchCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-[#757575]">총 {scholarships.length}개의 장학금이 등록되어 있습니다.</p>
                <Button className="gap-2" onClick={handleOpenCreateModal}>
                    <Plus className="w-4 h-4" />
                    장학금 등록
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 border border-[#E0E0E0] flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                    <Input
                        placeholder="장학금명 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#757575]" />
                    {['tuition', 'living', 'mixed'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat
                                ? 'bg-[#FF6B35] text-white'
                                : 'bg-[#F8F9FA] text-[#757575] hover:bg-[#E0E0E0]'
                                }`}
                        >
                            {getCategoryLabel(cat)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#F8F9FA] border-b border-[#E0E0E0]">
                        <tr>
                            <th className="text-left px-6 py-3 text-sm font-semibold text-[#212121]">장학금명</th>
                            <th className="text-left px-6 py-3 text-sm font-semibold text-[#212121]">분류</th>
                            <th className="text-left px-6 py-3 text-sm font-semibold text-[#212121]">금액</th>
                            <th className="text-left px-6 py-3 text-sm font-semibold text-[#212121]">마감일</th>
                            <th className="text-left px-6 py-3 text-sm font-semibold text-[#212121]">상태</th>
                            <th className="text-center px-6 py-3 text-sm font-semibold text-[#212121]">조회</th>
                            <th className="text-center px-6 py-3 text-sm font-semibold text-[#212121]">찜</th>
                            <th className="text-center px-6 py-3 text-sm font-semibold text-[#212121]">액션</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-sm text-[#757575]">장학금 목록을 불러오는 중...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredScholarships.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-sm text-[#757575]">
                                    {searchQuery || selectedCategory ? '검색 결과가 없습니다.' : '등록된 장학금이 없습니다.'}
                                </td>
                            </tr>
                        ) : (
                            filteredScholarships.map((scholarship) => {
                                const isActive = new Date(scholarship.deadline) > new Date();
                                return (
                                    <tr key={scholarship.id} className="border-b border-[#F8F9FA] hover:bg-[#FAFAFA]">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-[#212121] line-clamp-1">
                                                {scholarship.title}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryColor(scholarship.category)}`}>
                                                {getCategoryLabel(scholarship.category)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-[#757575]">{scholarship.amount_text}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-[#757575]">
                                                {new Date(scholarship.deadline).toLocaleDateString('ko-KR')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={isActive ? 'default' : 'secondary'}>
                                                {isActive ? '진행중' : '마감'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm text-[#757575]">{scholarship.views || 0}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm text-[#757575]">{scholarship.scraps || 0}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    className="p-1.5 hover:bg-[#F8F9FA] rounded-lg transition-colors"
                                                    onClick={() => handleEdit(scholarship)}
                                                    title="수정"
                                                >
                                                    <Edit2 className="w-4 h-4 text-[#757575]" />
                                                </button>
                                                <button
                                                    className="p-1.5 hover:bg-[#F8F9FA] rounded-lg transition-colors"
                                                    onClick={() => handleExternalLink(scholarship.url)}
                                                    title="외부 링크 열기"
                                                >
                                                    <ExternalLink className="w-4 h-4 text-[#757575]" />
                                                </button>
                                                <button
                                                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                                    onClick={() => handleDelete(scholarship.id, scholarship.title)}
                                                    title="삭제"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* 장학금 등록 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-[#E0E0E0] px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[#212121]">
                                {editingScholarship ? '장학금 수정' : '장학금 등록'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#212121] mb-2">
                                    장학금명 <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="예: 동국대학교 성적우수 장학금"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#212121] mb-2">
                                        분류 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="tuition">등록금성</option>
                                        <option value="living">생활비성</option>
                                        <option value="mixed">복합지원</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#212121] mb-2">
                                        지원 금액 <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        placeholder="예: 등록금 전액"
                                        value={formData.amount_text}
                                        onChange={(e) => handleInputChange('amount_text', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#212121] mb-2">
                                        마감일 <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#212121] mb-2">
                                        주관 기관
                                    </label>
                                    <Input
                                        placeholder="예: 동국대학교"
                                        value={formData.organization}
                                        onChange={(e) => handleInputChange('organization', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#212121] mb-2">
                                    지원 대상 요약
                                </label>
                                <Input
                                    placeholder="예: 전 학년 성적 우수자"
                                    value={formData.target_summary}
                                    onChange={(e) => handleInputChange('target_summary', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#212121] mb-2">
                                    지원 조건
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] min-h-[80px]"
                                    placeholder="예: 직전학기 평점 3.8 이상"
                                    value={formData.support_conditions}
                                    onChange={(e) => handleInputChange('support_conditions', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#212121] mb-2">
                                    상세 설명
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] min-h-[100px]"
                                    placeholder="장학금에 대한 상세 설명을 입력하세요"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#212121] mb-2">
                                    URL
                                </label>
                                <Input
                                    type="url"
                                    placeholder="https://www.dongguk.edu"
                                    value={formData.url}
                                    onChange={(e) => handleInputChange('url', e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    취소
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? '처리 중...' : (editingScholarship ? '수정하기' : '등록하기')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 삭제 확인 모달 */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-[#212121] mb-2">
                            장학금 삭제
                        </h3>
                        <p className="text-sm text-[#757575] mb-6">
                            "<span className="font-medium text-[#212121]">{deleteConfirm.title}</span>" 장학금을 삭제하시겠습니까?
                            <br />
                            이 작업은 되돌릴 수 없습니다.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-sm font-medium text-[#757575] hover:bg-[#F8F9FA] rounded-lg transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
