export interface Student {
  id?: number
  email: string
  name?: string
  created_at?: string
}

export interface Question {
  id?: number
  name: string
  stars: number
  test_case_count: number
}

export interface Attempt {
  id: number
  student_id: number
  question_id: number
  score: number
  created_at?: string
}