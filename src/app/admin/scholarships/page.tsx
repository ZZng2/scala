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
    Check,
    X,
} from 'lucide-react';
import { departments as DEPARTMENTS_DATA } from '@/data/departments';

/**
 * AdminScholarshipsPage
 * Feature 7: 장학금 관리
 */

// 학과 선택을 위한 헬퍼 컴포넌트


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
    min_gpa?: number;
    max_income_bracket?: number;
    target_grades?: number[];
    target_departments?: string[];
    target_regions?: string[];
    requires_disability?: boolean;
    requires_multi_child?: boolean;
    requires_national_merit?: boolean;
}

export default function AdminScholarshipsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [deptSearchQuery, setDeptSearchQuery] = useState(''); // 학과 검색 쿼리
    const [isDeptListOpen, setIsDeptListOpen] = useState(false); // 전체 학과 목록 토글
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, title: string } | null>(null);
    const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null); // 수정 중인 장학금
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set()); // 선택된 ID들
    const [isBulkDeleting, setIsBulkDeleting] = useState(false); // 대량 삭제 중 상태
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false); // 대량 삭제 모달 상태

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
        min_gpa: '' as any,
        max_income_bracket: '' as any,
        target_grades: [] as number[],
        target_departments: [] as string[],
        target_regions: [] as string[],
        requires_disability: false,
        requires_multi_child: false,
        requires_national_merit: false,
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
            setSelectedIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(deleteConfirm.id);
                return newSet;
            });
            await fetchScholarships();
        } catch (error) {
            console.error('Delete error:', error);
            alert('장학금 삭제 중 오류가 발생했습니다.');
        } finally {
            setDeleteConfirm(null);
        }
    };

    // 대량 삭제 핸들러
    const handleBulkDelete = () => {
        if (selectedIds.size === 0) return;
        setIsBulkDeleteModalOpen(true);
    };

    // 대량 삭제 확인
    const confirmBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            const response = await fetch('/api/scholarships', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: Array.from(selectedIds) }),
            });

            if (!response.ok) throw new Error('대량 삭제 실패');

            alert(`${selectedIds.size}개의 장학금이 삭제되었습니다.`);
            setSelectedIds(new Set());
            await fetchScholarships();
        } catch (error) {
            console.error('Bulk delete error:', error);
            alert('장학금 대량 삭제 중 오류가 발생했습니다.');
        } finally {
            setIsBulkDeleting(false);
            setIsBulkDeleteModalOpen(false);
        }
    };

    // 학과 검색 엔터 키 핸들러
    const handleDeptKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const filtered = DEPARTMENTS_DATA.filter(d =>
                d.name.toLowerCase().includes(deptSearchQuery.toLowerCase()) ||
                d.college.toLowerCase().includes(deptSearchQuery.toLowerCase())
            );

            if (filtered.length > 0) {
                const firstMatch = filtered[0].name;
                const current = formData.target_departments || [];
                if (!current.includes(firstMatch)) {
                    handleInputChange('target_departments', [...current, firstMatch] as any);
                }
                setDeptSearchQuery(''); // 검색어 초기화
            }
        }
    };

    // 학과 토글 핸들러
    const toggleDepartment = (deptName: string) => {
        const current = formData.target_departments || [];
        if (current.includes(deptName)) {
            handleInputChange('target_departments', current.filter(d => d !== deptName) as any);
        } else {
            handleInputChange('target_departments', [...current, deptName] as any);
        }
    };

    // 단과대별 학과 그룹화 및 렌더링
    const renderGroupedDepartments = () => {
        const grouped = DEPARTMENTS_DATA.reduce((acc, dept) => {
            if (!acc[dept.college]) acc[dept.college] = [];
            acc[dept.college].push(dept);
            return acc;
        }, {} as Record<string, typeof DEPARTMENTS_DATA>);

        return Object.entries(grouped).map(([college, depts]) => (
            <div key={college} className="mb-4">
                <h5 className="text-sm font-bold text-[#212121] mb-2">{college}</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {depts.map((dept) => {
                        const isSelected = formData.target_departments?.includes(dept.name);
                        return (
                            <div
                                key={dept.id}
                                onClick={() => toggleDepartment(dept.name)}
                                className={`
                                    cursor-pointer px-3 py-2 rounded-lg text-sm transition-all border
                                    ${isSelected
                                        ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                                        : 'bg-white text-[#424242] border-[#E0E0E0] hover:bg-[#FAFAFA]'}
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{dept.name}</span>
                                    {isSelected && <Check size={14} />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ));
    };

    // 체크박스 토글 함수들
    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleAll = () => {
        if (selectedIds.size === filteredScholarships.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredScholarships.map(s => s.id)));
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
                min_gpa: '' as any,
                max_income_bracket: '' as any,
                target_grades: [],
                target_departments: [],
                target_regions: [],
                requires_disability: false,
                requires_multi_child: false,
                requires_national_merit: false,
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
            min_gpa: scholarship.min_gpa ?? '' as any,
            max_income_bracket: scholarship.max_income_bracket ?? '' as any,
            target_grades: scholarship.target_grades || [],
            target_departments: scholarship.target_departments || [],
            target_regions: scholarship.target_regions || [],
            requires_disability: scholarship.requires_disability || false,
            requires_multi_child: scholarship.requires_multi_child || false,
            requires_national_merit: scholarship.requires_national_merit || false,
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
            min_gpa: '' as any,
            max_income_bracket: '' as any,
            target_grades: [],
            target_departments: [],
            target_regions: [],
            requires_disability: false,
            requires_multi_child: false,
            requires_national_merit: false,
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
                <div className="flex items-center gap-4">
                    <p className="text-[#757575]">총 {scholarships.length}개의 장학금이 등록되어 있습니다.</p>
                    {selectedIds.size > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="gap-2 animate-in fade-in slide-in-from-left-2"
                            onClick={handleBulkDelete}
                        >
                            <Trash2 className="w-4 h-4" />
                            {selectedIds.size}개 삭제
                        </Button>
                    )}
                </div>
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
                            <th className="px-6 py-3 text-left w-10">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-[#E0E0E0] text-[#FF6B35] focus:ring-[#FF6B35]"
                                    checked={filteredScholarships.length > 0 && selectedIds.size === filteredScholarships.length}
                                    onChange={toggleAll}
                                />
                            </th>
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
                                    <tr key={scholarship.id} className={`border-b border-[#F8F9FA] hover:bg-[#FAFAFA] transition-colors ${selectedIds.has(scholarship.id) ? 'bg-[#FFF9F6]' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-[#E0E0E0] text-[#FF6B35] focus:ring-[#FF6B35]"
                                                checked={selectedIds.has(scholarship.id)}
                                                onChange={() => toggleSelect(scholarship.id)}
                                            />
                                        </td>
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
                        </div>

                        {/* --- 매칭 상세 설정 --- */}
                        <div className="pt-4 border-t border-[#E0E0E0]">
                            <h3 className="text-sm font-bold text-[#FF6B35] mb-4">매칭 상세 설정 (자동 추천용)</h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#212121] mb-2">
                                        최소 학점 (0.0~4.5)
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="4.5"
                                        placeholder="예: 3.5"
                                        value={formData.min_gpa || ''}
                                        onChange={(e) => handleInputChange('min_gpa', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#212121] mb-2">
                                        최대 소득분위 (1~10)
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="10"
                                        placeholder="예: 8"
                                        value={formData.max_income_bracket || ''}
                                        onChange={(e) => handleInputChange('max_income_bracket', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#212121] mb-2">
                                    대상 학년 (다중 선택 가능)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[1, 2, 3, 4].map((grade) => {
                                        const isSelected = formData.target_grades?.includes(grade);
                                        return (
                                            <button
                                                key={grade}
                                                type="button"
                                                onClick={() => {
                                                    const current = formData.target_grades || [];
                                                    const next = isSelected
                                                        ? current.filter(g => g !== grade)
                                                        : [...current, grade].sort();
                                                    handleInputChange('target_grades', next as any);
                                                }}
                                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isSelected
                                                    ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                                                    : 'bg-white border-[#E0E0E0] text-[#757575] hover:border-[#FF6B35]'
                                                    }`}
                                            >
                                                {grade}학년
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#212121] mb-2">
                                    대상 학과 (미선택 시 전체 학과 대상)
                                </label>
                                <div className="space-y-2">
                                    <div className="relative">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" size={16} />
                                            <Input
                                                placeholder="학과 검색 (엔터 시 자동 추가)"
                                                className="pl-9 pr-20"
                                                value={deptSearchQuery}
                                                onChange={(e) => setDeptSearchQuery(e.target.value)}
                                                onKeyDown={handleDeptKeyDown}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setIsDeptListOpen(!isDeptListOpen)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-[#FF6B35] hover:bg-[#FFF0EB] px-2 py-1 rounded transition-colors"
                                            >
                                                {isDeptListOpen ? '목록 닫기' : '전체 목록'}
                                            </button>
                                        </div>

                                        {/* 검색 결과 드롭다운 (검색어가 있을 때만 표시) */}
                                        {deptSearchQuery && !isDeptListOpen && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {DEPARTMENTS_DATA
                                                    .filter(d =>
                                                        d.name.toLowerCase().includes(deptSearchQuery.toLowerCase()) ||
                                                        d.college.toLowerCase().includes(deptSearchQuery.toLowerCase())
                                                    )
                                                    .map(dept => (
                                                        <div
                                                            key={dept.id}
                                                            className="px-4 py-2 text-sm text-[#424242] hover:bg-[#FAFAFA] cursor-pointer flex justify-between items-center"
                                                            onClick={() => {
                                                                toggleDepartment(dept.name);
                                                                setDeptSearchQuery('');
                                                            }}
                                                        >
                                                            <span>{dept.name} <span className="text-xs text-[#9E9E9E]">({dept.college})</span></span>
                                                            {formData.target_departments?.includes(dept.name) && <Check size={14} className="text-[#FF6B35]" />}
                                                        </div>
                                                    ))
                                                }
                                                {DEPARTMENTS_DATA.filter(d =>
                                                    d.name.toLowerCase().includes(deptSearchQuery.toLowerCase()) ||
                                                    d.college.toLowerCase().includes(deptSearchQuery.toLowerCase())
                                                ).length === 0 && (
                                                        <div className="px-4 py-2 text-sm text-[#757575]">검색 결과가 없습니다.</div>
                                                    )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {formData.target_departments?.map(deptName => (
                                            <span key={deptName} className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFF9F6] text-[#FF6B35] border border-[#FF6B35]/20 rounded-full text-xs font-medium">
                                                {deptName}
                                                <X className="w-3 h-3 cursor-pointer" onClick={() => {
                                                    const next = formData.target_departments?.filter(d => d !== deptName);
                                                    handleInputChange('target_departments', next as any);
                                                }} />
                                            </span>
                                        ))}
                                        {(formData.target_departments?.length || 0) > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => handleInputChange('target_departments', [] as any)}
                                                className="text-xs text-[#757575] hover:text-red-500 underline"
                                            >
                                                전체 삭제
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {/* 전체 학과 목록 (단과대별 그룹화) */}
                                {isDeptListOpen && (
                                    <div className="mt-3 p-4 bg-[#FAFAFA] rounded-xl border border-[#EEEEEE] max-h-80 overflow-y-auto">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-semibold text-[#616161]">전체 학과 목록</span>
                                            <button
                                                onClick={() => setIsDeptListOpen(false)}
                                                className="text-xs text-[#9E9E9E] hover:text-[#424242]"
                                            >
                                                닫기
                                            </button>
                                        </div>
                                        {renderGroupedDepartments()}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-[#F8F9FA] hover:bg-[#FAFAFA] transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-[#E0E0E0] text-[#FF6B35] focus:ring-[#FF6B35]"
                                        checked={formData.requires_disability}
                                        onChange={(e) => handleInputChange('requires_disability', e.target.checked as any)}
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-[#212121]">장애 대학생 대상 장학금</p>
                                        <p className="text-xs text-[#757575]">장애 여부가 '참'인 학생에게만 매칭됩니다.</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-[#F8F9FA] hover:bg-[#FAFAFA] transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-[#E0E0E0] text-[#FF6B35] focus:ring-[#FF6B35]"
                                        checked={formData.requires_multi_child}
                                        onChange={(e) => handleInputChange('requires_multi_child', e.target.checked as any)}
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-[#212121]">다자녀 가구 대상 장학금</p>
                                        <p className="text-xs text-[#757575]">다자녀 가정 여부가 '참'인 학생에게만 매칭됩니다.</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-[#F8F9FA] hover:bg-[#FAFAFA] transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-[#E0E0E0] text-[#FF6B35] focus:ring-[#FF6B35]"
                                        checked={formData.requires_national_merit}
                                        onChange={(e) => handleInputChange('requires_national_merit', e.target.checked as any)}
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-[#212121]">보훈 대상자(국가유공자) 장학금</p>
                                        <p className="text-xs text-[#757575]">보훈 대상 여부가 '참'인 학생에게만 매칭됩니다.</p>
                                    </div>
                                </label>
                            </div>
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
            )}

            {/* 개별 삭제 확인 모달 */}
            {
                deleteConfirm && (
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
                )
            }

            {/* 대량 삭제 확인 모달 */}
            {
                isBulkDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsBulkDeleteModalOpen(false)}>
                        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-lg font-semibold text-[#212121] mb-2">
                                장학금 {selectedIds.size}개 삭제
                            </h3>
                            <p className="text-sm text-[#757575] mb-6">
                                선택한 <span className="font-bold text-[#FF6B35]">{selectedIds.size}개</span>의 장학금을 정말로 삭제하시겠습니까?
                                <br />
                                이 작업은 되돌릴 수 없습니다.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setIsBulkDeleteModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-[#757575] hover:bg-[#F8F9FA] rounded-lg transition-colors"
                                    disabled={isBulkDeleting}
                                >
                                    취소
                                </button>
                                <button
                                    onClick={confirmBulkDelete}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2"
                                    disabled={isBulkDeleting}
                                >
                                    {isBulkDeleting && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    {isBulkDeleting ? '삭제 중...' : '선택 삭제'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
