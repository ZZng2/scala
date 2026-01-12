export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            admin_settings: {
                Row: {
                    id: string
                    key: string
                    updated_at: string | null
                    value: Json
                }
                Insert: {
                    id?: string
                    key: string
                    updated_at?: string | null
                    value: Json
                }
                Update: {
                    id?: string
                    key?: string
                    updated_at?: string | null
                    value?: Json
                }
                Relationships: []
            }
            click_events: {
                Row: {
                    created_at: string | null
                    event_type: string
                    id: string
                    metadata: Json | null
                    push_log_id: string | null
                    scholarship_id: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    event_type: string
                    id?: string
                    metadata?: Json | null
                    push_log_id?: string | null
                    scholarship_id?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    event_type?: string
                    id?: string
                    metadata?: Json | null
                    push_log_id?: string | null
                    scholarship_id?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "click_events_push_log_id_fkey"
                        columns: ["push_log_id"]
                        isOneToOne: false
                        referencedRelation: "push_logs"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "click_events_scholarship_id_fkey"
                        columns: ["scholarship_id"]
                        isOneToOne: false
                        referencedRelation: "scholarships"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "click_events_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            push_logs: {
                Row: {
                    body: string
                    created_at: string | null
                    id: string
                    scholarship_id: string | null
                    sent_at: string | null
                    target_user_count: number
                    sent_count: number | null
                    failure_count: number | null
                    status: string | null
                    title: string
                    clicked_count: number | null
                }
                Insert: {
                    body: string
                    created_at?: string | null
                    id?: string
                    scholarship_id?: string | null
                    sent_at?: string | null
                    target_user_count?: number
                    sent_count?: number | null
                    failure_count?: number | null
                    status?: string | null
                    title: string
                    clicked_count?: number | null
                }
                Update: {
                    body?: string
                    created_at?: string | null
                    id?: string
                    scholarship_id?: string | null
                    sent_at?: string | null
                    target_user_count?: number
                    sent_count?: number | null
                    failure_count?: number | null
                    status?: string | null
                    title?: string
                    clicked_count?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "push_logs_scholarship_id_fkey"
                        columns: ["scholarship_id"]
                        isOneToOne: false
                        referencedRelation: "scholarships"
                        referencedColumns: ["id"]
                    }
                ]
            }
            scholarships: {
                Row: {
                    amount_text: string | null
                    category: string | null
                    created_at: string | null
                    deadline: string | null
                    enrollment_status: string[] | null
                    id: string
                    is_closed: boolean | null
                    max_income_bracket: number | null
                    min_gpa: number | null
                    organization: string | null
                    requires_disability: boolean | null
                    requires_multi_child: boolean | null
                    requires_national_merit: boolean | null
                    scraps: number | null
                    support_conditions: string | null
                    target_departments: string[] | null
                    target_grades: number[] | null
                    target_regions: string[] | null
                    target_summary: string | null
                    title: string
                    updated_at: string | null
                    views: number | null
                }
                Insert: {
                    amount_text?: string | null
                    category?: string | null
                    created_at?: string | null
                    deadline?: string | null
                    enrollment_status?: string[] | null
                    id?: string
                    is_closed?: boolean | null
                    max_income_bracket?: number | null
                    min_gpa?: number | null
                    organization?: string | null
                    requires_disability?: boolean | null
                    requires_multi_child?: boolean | null
                    requires_national_merit?: boolean | null
                    scraps?: number | null
                    support_conditions?: string | null
                    target_departments?: string[] | null
                    target_grades?: number[] | null
                    target_regions?: string[] | null
                    target_summary?: string | null
                    title: string
                    updated_at?: string | null
                    views?: number | null
                }
                Update: {
                    amount_text?: string | null
                    category?: string | null
                    created_at?: string | null
                    deadline?: string | null
                    enrollment_status?: string[] | null
                    id?: string
                    is_closed?: boolean | null
                    max_income_bracket?: number | null
                    min_gpa?: number | null
                    organization?: string | null
                    requires_disability?: boolean | null
                    requires_multi_child?: boolean | null
                    requires_national_merit?: boolean | null
                    scraps?: number | null
                    support_conditions?: string | null
                    target_departments?: string[] | null
                    target_grades?: number[] | null
                    target_regions?: string[] | null
                    target_summary?: string | null
                    title?: string
                    updated_at?: string | null
                    views?: number | null
                }
                Relationships: []
            }
            scraps: {
                Row: {
                    created_at: string | null
                    id: string
                    scholarship_id: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    scholarship_id?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    scholarship_id?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "scraps_scholarship_id_fkey"
                        columns: ["scholarship_id"]
                        isOneToOne: false
                        referencedRelation: "scholarships"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "scraps_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_profiles: {
                Row: {
                    avg_gpa: number | null
                    created_at: string | null
                    department_id: string | null
                    department_name: string | null
                    college: string | null
                    grade: number | null
                    enrollment_status: string | null
                    id: string
                    is_multi_child_family: boolean | null
                    is_national_merit: boolean | null
                    hometown_region: string | null
                    income_bracket: number | null
                    prev_semester_gpa: number | null
                    has_disability: boolean | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    avg_gpa?: number | null
                    created_at?: string | null
                    department_id?: string | null
                    department_name?: string | null
                    college?: string | null
                    grade?: number | null
                    enrollment_status?: string | null
                    id?: string
                    is_multi_child_family?: boolean | null
                    is_national_merit?: boolean | null
                    hometown_region?: string | null
                    income_bracket?: number | null
                    prev_semester_gpa?: number | null
                    has_disability?: boolean | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    avg_gpa?: number | null
                    created_at?: string | null
                    department_id?: string | null
                    department_name?: string | null
                    college?: string | null
                    grade?: number | null
                    enrollment_status?: string | null
                    id?: string
                    is_multi_child_family?: boolean | null
                    is_national_merit?: boolean | null
                    hometown_region?: string | null
                    income_bracket?: number | null
                    prev_semester_gpa?: number | null
                    has_disability?: boolean | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_profiles_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            users: {
                Row: {
                    admission_year: number | null
                    created_at: string | null
                    email: string | null
                    id: string
                    last_login_at: string | null
                    onboarding_completed: boolean | null
                    push_enabled: boolean | null
                    fcm_token: string | null
                    is_interview_agreed: boolean | null
                    is_admin: boolean | null
                    updated_at: string | null
                }
                Insert: {
                    admission_year?: number | null
                    created_at?: string | null
                    email?: string | null
                    id: string
                    last_login_at?: string | null
                    onboarding_completed?: boolean | null
                    push_enabled?: boolean | null
                    fcm_token?: string | null
                    is_interview_agreed?: boolean | null
                    is_admin?: boolean | null
                    updated_at?: string | null
                }
                Update: {
                    admission_year?: number | null
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    last_login_at?: string | null
                    onboarding_completed?: boolean | null
                    push_enabled?: boolean | null
                    fcm_token?: string | null
                    is_interview_agreed?: boolean | null
                    is_admin?: boolean | null
                    updated_at?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            match_scholarships: {
                Args: {
                    p_grade: number
                    p_gpa: number
                    p_income_bracket: number
                    p_department_id: string
                    p_region: string
                    p_has_disability: boolean
                    p_is_multi_child: boolean
                    p_is_national_merit: boolean
                }
                Returns: {
                    amount_text: string | null
                    deadline: string | null
                    id: string
                    is_closed: boolean | null
                    category: string | null
                    title: string
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database["public"]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
