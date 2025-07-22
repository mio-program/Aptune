'use client'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

interface UserProfile {
  id: string
  user_id: string
  full_name: string
  current_role: string
  experience_years: number
  skills: string[]
  industry: string
  education: string
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    current_role: '',
    experience_years: 0,
    skills: [] as string[],
    industry: '',
    education: ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
      return
    }

    if (user) {
      loadProfile()
    }
  }, [user, loading, router])

  const loadProfile = async () => {
    try {
      // 現在のプロジェクトではuser_profilesテーブルが存在しないため、
      // 基本的なユーザー情報のみ表示
      const mockProfile = {
        id: user?.id || '',
        user_id: user?.id || '',
        full_name: user?.user_metadata?.full_name || '',
        current_role: '',
        experience_years: 0,
        skills: [],
        industry: '',
        education: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setProfile(mockProfile)
      setFormData({
        full_name: mockProfile.full_name,
        current_role: mockProfile.current_role,
        experience_years: mockProfile.experience_years,
        skills: mockProfile.skills,
        industry: mockProfile.industry,
        education: mockProfile.education
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setMessage('')

    try {
      // 現在のプロジェクトではデータベース保存は実装せず、
      // ローカルストレージに保存
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_profile', JSON.stringify(formData))
      }
      
      setMessage('プロフィールを保存しました')
      setIsEditing(false)
      
      // プロフィール状態を更新
      const updatedProfile = {
        ...profile!,
        ...formData,
        updated_at: new Date().toISOString()
      }
      setProfile(updatedProfile)
    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage('プロフィールの保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleSkillChange = (skill: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s !== skill)
      }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">プロフィール</h1>
              <div className="space-x-3">
                <Link
                  href="/dashboard"
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  ダッシュボード
                </Link>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    編集
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      loadProfile()
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    キャンセル
                  </button>
                )}
              </div>
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded-md ${
                message.includes('失敗') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
              }`}>
                {message}
              </div>
            )}

            {isEditing ? (
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      氏名
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      現在の役職
                    </label>
                    <input
                      type="text"
                      value={formData.current_role}
                      onChange={(e) => setFormData(prev => ({ ...prev, current_role: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      経験年数
                    </label>
                    <input
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      業界
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    スキル
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git', 'TypeScript', 'Next.js'].map((skill) => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.skills.includes(skill)}
                          onChange={(e) => handleSkillChange(skill, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    学歴
                  </label>
                  <textarea
                    value={formData.education}
                    onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? '保存中...' : '保存'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">氏名</h3>
                    <p className="mt-1 text-sm text-gray-900">{profile?.full_name || '未設定'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">現在の役職</h3>
                    <p className="mt-1 text-sm text-gray-900">{profile?.current_role || '未設定'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">経験年数</h3>
                    <p className="mt-1 text-sm text-gray-900">{profile?.experience_years || 0}年</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">業界</h3>
                    <p className="mt-1 text-sm text-gray-900">{profile?.industry || '未設定'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">スキル</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {profile?.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill) => (
                        <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">未設定</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">学歴</h3>
                  <p className="mt-1 text-sm text-gray-900">{profile?.education || '未設定'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 