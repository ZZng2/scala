export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
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
                    clicked_count: number | null
                    created_at: string | null
                    id: string
                    scholarship_id: string | null
                    sent_at: string | null
                    target_user_count: number
                    title: string
                }
                Insert: {
                    body: string
                    clicked_count?: number | null
                    created_at?: string | null
                    id?: string
                    scholarship_id?: string | null
                    sent_at?: string | null
                    target_user_count?: number
                    title: string
                }
                Update: {
                    body?: string
                    clicked_count?: number | null
                    created_at?: string | null
                    id?: string
                    scholarship_id?: string | null
                    sent_at?: string | null
                    target_user_count?: number
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "push_logs_scholarship_id_fkey"
                        columns: ["scholarship_id"]
                        isOneToOne: false
                        referencedRelation: "scholarships"
                        referencedColumns: ["id"]
                    },
                ]
            }
            scholarships: {
                Row: {
                    amount_text: string | null
                    category: string
                    created_at: string | null
                    deadline: string
                    description: string | null
                    documents_required: string | null
                    id: string
                    is_closed: boolean | null
                    is_duplicate_allowed: boolean | null
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
                    url: string | null
                    views: number | null
                }
                Insert: {
                    amount_text?: string | null
                    category: string
                    created_at?: string | null
                    deadline: string
                    description?: string | null
                    documents_required?: string | null
                    id?: string
                    is_closed?: boolean | null
                    is_duplicate_allowed?: boolean | null
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
                    url?: string | null
                    views?: number | null
                }
                Update: {
                    amount_text?: string | null
                    category?: string
                    created_at?: string | null
                    deadline?: string
                    description?: string | null
                    documents_required?: string | null
                    id?: string
                    is_closed?: boolean | null
                    is_duplicate_allowed?: boolean | null
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
                    url?: string | null
                    views?: number | null
                }
                Relationships: []
            }
            scraps: {
                Row: {
                    created_at: string | null
                    id: string
                    scholarship_id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    scholarship_id: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    scholarship_id?: string
                    user_id?: string
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
                    college: string | null
                    created_at: string | null
                    department_id: string | null
                    department_name: string | null
                    enrollment_status: string | null
                    grade: number | null
                    has_disability: boolean | null
                    hometown_region: string | null
                    id: string
                    income_bracket: number | null
                    is_multi_child_family: boolean | null
                    is_national_merit: boolean | null
                    prev_semester_gpa: number | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    avg_gpa?: number | null
                    college?: string | null
                    created_at?: string | null
                    department_id?: string | null
                    department_name?: string | null
                    enrollment_status?: string | null
                    grade?: number | null
                    has_disability?: boolean | null
                    hometown_region?: string | null
                    id?: string
                    income_bracket?: number | null
                    is_multi_child_family?: boolean | null
                    is_national_merit?: boolean | null
                    prev_semester_gpa?: number | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    avg_gpa?: number | null
                    college?: string | null
                    created_at?: string | null
                    department_id?: string | null
                    department_name?: string | null
                    enrollment_status?: string | null
                    grade?: number | null
                    has_disability?: boolean | null
                    hometown_region?: string | null
                    id?: string
                    income_bracket?: number | null
                    is_multi_child_family?: boolean | null
                    is_national_merit?: boolean | null
                    prev_semester_gpa?: number | null
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
                    created_at: string | null
                    email: string | null
                    fcm_token: string | null
                    id: string
                    last_login_at: string | null
                    push_enabled: boolean | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    email?: string | null
                    fcm_token?: string | null
                    id?: string
                    last_login_at?: string | null
                    push_enabled?: boolean | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    email?: string | null
                    fcm_token?: string | null
                    id?: string
                    last_login_at?: string | null
                    push_enabled?: boolean | null
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
                    id: string
                    title: string
                    category: string
                    amount_text: string
                    deadline: string
                    is_closed: boolean
                }[]
            }
            update_updated_at: {
                Args: Record<PropertyKey, never>
                Returns: unknown
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

type PublicSchema = Database[Extract<keyof Database, "public">]

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

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
