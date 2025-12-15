# Supabase Database Schema Organization

This folder contains the reorganized database schema, separated into logical components for better maintainability.

## 📁 Folder Structure

### `/sql` - All SQL Files
Parent folder containing all database-related SQL files, organized into subfolders:

#### `/sql/schema` - Database Schema Definitions

Contains all table definitions, policies, triggers, indexes, and associated functions. Each file is self-contained and represents a complete database object with all its dependencies.

**Files:**

- `00_enums.sql` - Custom enum types (app_role)
- `01_user_roles_table.sql` - User roles and authentication setup
- `02_institution_settings_table.sql` - Institution/subscription configuration
- `03_therapist_team_table.sql` - Therapist profiles and related functions
- `04_student_therapist_assignment_table.sql` - Student-therapist assignments
- `05_analytics_functions.sql` - Reporting and analytics functions

#### `/sql/seed-data` - Initial Data

Contains INSERT statements for populating tables with initial/demo data.

**Files:**

- `institution_settings_seed.sql` - Demo School initial configuration

#### `/sql/updates` - Schema Updates

Contains modifications to existing tables, policies, or functions. These represent changes made after initial schema creation.

**Files:**

- `01_add_role_based_policies_for_student_data.sql` - Adds role-based access to student tables
- `02_add_viewer_role_to_rls_policies.sql` - Fixes viewer role access bug
- `03_fix_handle_new_user_exclude_userspub.sql` - Excludes portal users from student table

#### `/sql/migrations` - Original Timestamped Migrations

The original Supabase migration files (timestamped). These are kept for historical reference and database version control.

## 🚀 Execution Order

For a fresh database setup, execute in this order:

1. **Schema files** (in order 00 → 05)
2. **Seed data files**
3. **Update files** (if needed, in order 01 → 03)

## 📝 Notes

- Schema files are idempotent where possible (using `CREATE OR REPLACE`, `DROP IF EXISTS`)
- Each schema file includes its own RLS policies, triggers, indexes, and functions
- Update files should only be run on existing databases that need modifications
- The `/sql/migrations` folder contains the original timestamped files for Supabase migration history

## 🔍 Quick Reference

| Table/Object                          | Schema File                                 | Purpose                        |
| ------------------------------------- | ------------------------------------------- | ------------------------------ |
| `app_role` enum                       | `00_enums.sql`                              | User role types                |
| `user_roles`                          | `01_user_roles_table.sql`                   | Role assignments               |
| `institution_settings`                | `02_institution_settings_table.sql`         | Subscription config            |
| `therapist_team`                      | `03_therapist_team_table.sql`               | Therapist profiles             |
| `student_therapist_assignment`        | `04_student_therapist_assignment_table.sql` | Assignment tracking            |
| `get_therapeutic_engagement_growth()` | `05_analytics_functions.sql`                | Weekly activity analytics      |
| `get_students_overview()`             | `05_analytics_functions.sql`                | Student dashboard data         |
| `get_students_under_care()`           | `04_student_therapist_assignment_table.sql` | Critical students needing help |
| `get_therapist_team()`                | `03_therapist_team_table.sql`               | List all therapists            |
