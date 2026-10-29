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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      ai_grading_jobs: {
        Row: {
          attempt_count: number
          completed_at: string | null
          created_at: string
          id: string
          idempotency_key: string
          last_error_code: string | null
          leased_until: string | null
          max_score: number
          next_retry_at: string | null
          proposed_score: number | null
          provider_config_id: string
          provider_model_id: string | null
          quiz_answer_id: string
          rationale: Json
          status: Database["public"]["Enums"]["ai_job_status"]
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          idempotency_key?: string
          last_error_code?: string | null
          leased_until?: string | null
          max_score: number
          next_retry_at?: string | null
          proposed_score?: number | null
          provider_config_id: string
          provider_model_id?: string | null
          quiz_answer_id: string
          rationale?: Json
          status?: Database["public"]["Enums"]["ai_job_status"]
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          idempotency_key?: string
          last_error_code?: string | null
          leased_until?: string | null
          max_score?: number
          next_retry_at?: string | null
          proposed_score?: number | null
          provider_config_id?: string
          provider_model_id?: string | null
          quiz_answer_id?: string
          rationale?: Json
          status?: Database["public"]["Enums"]["ai_job_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_grading_jobs_provider_config_id_fkey"
            columns: ["provider_config_id"]
            isOneToOne: false
            referencedRelation: "ai_provider_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_grading_jobs_quiz_answer_id_fkey"
            columns: ["quiz_answer_id"]
            isOneToOne: true
            referencedRelation: "quiz_answers"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_provider_configs: {
        Row: {
          created_at: string
          encrypted_api_key: string
          endpoint: string | null
          id: string
          key_fingerprint: string
          last_test_status: string | null
          last_tested_at: string | null
          model_capabilities: Json
          owner_teacher_id: string
          provider: Database["public"]["Enums"]["ai_provider"]
          selected_model_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          encrypted_api_key: string
          endpoint?: string | null
          id?: string
          key_fingerprint: string
          last_test_status?: string | null
          last_tested_at?: string | null
          model_capabilities?: Json
          owner_teacher_id: string
          provider: Database["public"]["Enums"]["ai_provider"]
          selected_model_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          encrypted_api_key?: string
          endpoint?: string | null
          id?: string
          key_fingerprint?: string
          last_test_status?: string | null
          last_tested_at?: string | null
          model_capabilities?: Json
          owner_teacher_id?: string
          provider?: Database["public"]["Enums"]["ai_provider"]
          selected_model_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_provider_configs_owner_teacher_id_fkey"
            columns: ["owner_teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_classes: {
        Row: {
          assignment_id: string
          class_id: string
          created_at: string
        }
        Insert: {
          assignment_id: string
          class_id: string
          created_at?: string
        }
        Update: {
          assignment_id?: string
          class_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_classes_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_grades: {
        Row: {
          feedback: string | null
          graded_by: string
          id: string
          max_score: number
          published_at: string | null
          reviewed_at: string
          score: number
          submission_id: string
          updated_at: string
        }
        Insert: {
          feedback?: string | null
          graded_by: string
          id?: string
          max_score: number
          published_at?: string | null
          reviewed_at?: string
          score: number
          submission_id: string
          updated_at?: string
        }
        Update: {
          feedback?: string | null
          graded_by?: string
          id?: string
          max_score?: number
          published_at?: string | null
          reviewed_at?: string
          score?: number
          submission_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_grades_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_grades_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: true
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          archived_at: string | null
          created_at: string
          details: string | null
          id: string
          owner_teacher_id: string
          published_at: string | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          details?: string | null
          id?: string
          owner_teacher_id: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          details?: string | null
          id?: string
          owner_teacher_id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_owner_teacher_id_fkey"
            columns: ["owner_teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: number
          metadata: Json
          request_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: never
          metadata?: Json
          request_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: never
          metadata?: Json
          request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      class_invites: {
        Row: {
          class_id: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          max_uses: number | null
          revoked_at: string | null
          status: Database["public"]["Enums"]["invite_status"]
          token_hash: string
          updated_at: string
          uses_count: number
        }
        Insert: {
          class_id: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["invite_status"]
          token_hash: string
          updated_at?: string
          uses_count?: number
        }
        Update: {
          class_id?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["invite_status"]
          token_hash?: string
          updated_at?: string
          uses_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "class_invites_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_invites_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      class_memberships: {
        Row: {
          class_id: string
          created_at: string
          id: string
          joined_at: string
          left_at: string | null
          moved_to_class_id: string | null
          status: Database["public"]["Enums"]["membership_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          joined_at?: string
          left_at?: string | null
          moved_to_class_id?: string | null
          status?: Database["public"]["Enums"]["membership_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          joined_at?: string
          left_at?: string | null
          moved_to_class_id?: string | null
          status?: Database["public"]["Enums"]["membership_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_memberships_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_memberships_moved_to_class_id_fkey"
            columns: ["moved_to_class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_memberships_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          archived_at: string | null
          capacity: number
          created_at: string
          description: string | null
          id: string
          name: string
          owner_teacher_id: string
          status: Database["public"]["Enums"]["class_status"]
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_teacher_id: string
          status?: Database["public"]["Enums"]["class_status"]
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_teacher_id?: string
          status?: Database["public"]["Enums"]["class_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_owner_teacher_id_fkey"
            columns: ["owner_teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          href: string | null
          id: string
          kind: Database["public"]["Enums"]["notification_kind"]
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          href?: string | null
          id?: string
          kind: Database["public"]["Enums"]["notification_kind"]
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          href?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["notification_kind"]
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          phone_e164: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["account_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id: string
          phone_e164?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          phone_e164?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
        }
        Relationships: []
      }
      quiz_answers: {
        Row: {
          attempt_id: string
          boolean_answer: boolean | null
          essay_answer: string | null
          grading_feedback: string | null
          id: string
          max_score: number
          question_id: string
          score: number
          selected_option_ids: string[]
          updated_at: string
        }
        Insert: {
          attempt_id: string
          boolean_answer?: boolean | null
          essay_answer?: string | null
          grading_feedback?: string | null
          id?: string
          max_score?: number
          question_id: string
          score?: number
          selected_option_ids?: string[]
          updated_at?: string
        }
        Update: {
          attempt_id?: string
          boolean_answer?: boolean | null
          essay_answer?: string | null
          grading_feedback?: string | null
          id?: string
          max_score?: number
          question_id?: string
          score?: number
          selected_option_ids?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          created_at: string
          id: string
          idempotency_key: string
          max_score: number
          objective_score: number
          quiz_id: string
          quiz_version_id: string
          result_published_at: string | null
          server_deadline_at: string | null
          started_at: string
          status: Database["public"]["Enums"]["attempt_status"]
          student_id: string
          submitted_at: string | null
          total_score: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          idempotency_key?: string
          max_score?: number
          objective_score?: number
          quiz_id: string
          quiz_version_id: string
          result_published_at?: string | null
          server_deadline_at?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["attempt_status"]
          student_id: string
          submitted_at?: string | null
          total_score?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          idempotency_key?: string
          max_score?: number
          objective_score?: number
          quiz_id?: string
          quiz_version_id?: string
          result_published_at?: string | null
          server_deadline_at?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["attempt_status"]
          student_id?: string
          submitted_at?: string | null
          total_score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_quiz_version_id_fkey"
            columns: ["quiz_version_id"]
            isOneToOne: false
            referencedRelation: "quiz_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_classes: {
        Row: {
          class_id: string
          created_at: string
          quiz_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          quiz_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_classes_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_question_options: {
        Row: {
          created_at: string
          id: string
          position: number
          question_id: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          position: number
          question_id: string
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          position?: number
          question_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_boolean: boolean | null
          correct_option_ids: string[]
          created_at: string
          explanation: string | null
          id: string
          model_answer: string | null
          points: number
          position: number
          quiz_version_id: string
          rubric: Json
          text: string
          type: Database["public"]["Enums"]["question_type"]
          updated_at: string
        }
        Insert: {
          correct_boolean?: boolean | null
          correct_option_ids?: string[]
          created_at?: string
          explanation?: string | null
          id?: string
          model_answer?: string | null
          points: number
          position: number
          quiz_version_id: string
          rubric?: Json
          text: string
          type: Database["public"]["Enums"]["question_type"]
          updated_at?: string
        }
        Update: {
          correct_boolean?: boolean | null
          correct_option_ids?: string[]
          created_at?: string
          explanation?: string | null
          id?: string
          model_answer?: string | null
          points?: number
          position?: number
          quiz_version_id?: string
          rubric?: Json
          text?: string
          type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_version_id_fkey"
            columns: ["quiz_version_id"]
            isOneToOne: false
            referencedRelation: "quiz_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_versions: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          published_at: string | null
          quiz_id: string
          settings: Json
          snapshot: Json
          status: Database["public"]["Enums"]["content_status"]
          title: string
          version_number: number
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          published_at?: string | null
          quiz_id: string
          settings?: Json
          snapshot?: Json
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          version_number: number
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          published_at?: string | null
          quiz_id?: string
          settings?: Json
          snapshot?: Json
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_versions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          archived_at: string | null
          created_at: string
          current_draft_version_id: string | null
          current_published_version_id: string | null
          description: string | null
          id: string
          owner_teacher_id: string
          published_at: string | null
          settings: Json
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          current_draft_version_id?: string | null
          current_published_version_id?: string | null
          description?: string | null
          id?: string
          owner_teacher_id: string
          published_at?: string | null
          settings?: Json
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          current_draft_version_id?: string | null
          current_published_version_id?: string | null
          description?: string | null
          id?: string
          owner_teacher_id?: string
          published_at?: string | null
          settings?: Json
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_draft_version_fk"
            columns: ["current_draft_version_id"]
            isOneToOne: false
            referencedRelation: "quiz_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_owner_teacher_id_fkey"
            columns: ["owner_teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_published_version_fk"
            columns: ["current_published_version_id"]
            isOneToOne: false
            referencedRelation: "quiz_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      student_notes: {
        Row: {
          created_at: string
          id: string
          note: string
          student_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          note: string
          student_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          student_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_notes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_notes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_files: {
        Row: {
          byte_size: number
          created_at: string
          id: string
          mime_type: string
          original_filename: string
          sha256: string | null
          storage_bucket: string
          storage_path: string
          submission_version_id: string
        }
        Insert: {
          byte_size: number
          created_at?: string
          id?: string
          mime_type: string
          original_filename: string
          sha256?: string | null
          storage_bucket?: string
          storage_path: string
          submission_version_id: string
        }
        Update: {
          byte_size?: number
          created_at?: string
          id?: string
          mime_type?: string
          original_filename?: string
          sha256?: string | null
          storage_bucket?: string
          storage_path?: string
          submission_version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_files_submission_version_id_fkey"
            columns: ["submission_version_id"]
            isOneToOne: true
            referencedRelation: "submission_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_versions: {
        Row: {
          created_at: string
          id: string
          idempotency_key: string
          submission_id: string
          uploaded_at: string
          uploaded_by: string
          version_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          idempotency_key?: string
          submission_id: string
          uploaded_at?: string
          uploaded_by: string
          version_number: number
        }
        Update: {
          created_at?: string
          id?: string
          idempotency_key?: string
          submission_id?: string
          uploaded_at?: string
          uploaded_by?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "submission_versions_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_versions_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          assignment_id: string
          created_at: string
          current_version_id: string | null
          id: string
          status: Database["public"]["Enums"]["submission_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          assignment_id: string
          created_at?: string
          current_version_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["submission_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          assignment_id?: string
          created_at?: string
          current_version_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["submission_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_current_version_fk"
            columns: ["current_version_id"]
            isOneToOne: false
            referencedRelation: "submission_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_class_invite: {
        Args: {
          invite_expires_at?: string
          invite_max_uses?: number
          target_class_id: string
        }
        Returns: {
          class_id: string
          expires_at: string
          invite_id: string
          max_uses: number
          token: string
        }[]
      }
      get_quiz_for_student: { Args: { target_quiz_id: string }; Returns: Json }
      is_active_class_member: {
        Args: { target_class_id: string; user_id?: string }
        Returns: boolean
      }
      is_teacher: { Args: { user_id?: string }; Returns: boolean }
      join_class_from_invite: { Args: { raw_token: string }; Returns: string }
      owns_assignment: {
        Args: { target_assignment_id: string; user_id?: string }
        Returns: boolean
      }
      owns_class: {
        Args: { target_class_id: string; user_id?: string }
        Returns: boolean
      }
      owns_quiz: {
        Args: { target_quiz_id: string; user_id?: string }
        Returns: boolean
      }
      update_my_display_name: {
        Args: { next_display_name: string }
        Returns: undefined
      }
    }
    Enums: {
      account_status: "active" | "suspended"
      ai_job_status:
        | "pending"
        | "processing"
        | "graded"
        | "failed"
        | "review_required"
      ai_provider: "google_ai_studio" | "groq"
      app_role: "teacher" | "student"
      attempt_status: "in_progress" | "submitted" | "graded" | "review_required"
      class_status: "active" | "archived"
      content_status: "draft" | "published" | "archived"
      invite_status: "active" | "revoked" | "expired" | "exhausted"
      membership_status: "active" | "removed" | "transferred"
      notification_kind: "assignment" | "grade" | "quiz" | "system" | "invite"
      question_type: "mcq" | "true_false" | "essay"
      submission_status: "submitted" | "reviewed" | "late" | "needs_revision"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["active", "suspended"],
      ai_job_status: [
        "pending",
        "processing",
        "graded",
        "failed",
        "review_required",
      ],
      ai_provider: ["google_ai_studio", "groq"],
      app_role: ["teacher", "student"],
      attempt_status: ["in_progress", "submitted", "graded", "review_required"],
      class_status: ["active", "archived"],
      content_status: ["draft", "published", "archived"],
      invite_status: ["active", "revoked", "expired", "exhausted"],
      membership_status: ["active", "removed", "transferred"],
      notification_kind: ["assignment", "grade", "quiz", "system", "invite"],
      question_type: ["mcq", "true_false", "essay"],
      submission_status: ["submitted", "reviewed", "late", "needs_revision"],
    },
  },
} as const

