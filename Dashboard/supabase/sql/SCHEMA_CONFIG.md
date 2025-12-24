# Schema Configuration Guide

## Overview

All SQL files in the schema and seed-data folders now support **schema variables**, allowing you to deploy the database objects to any PostgreSQL schema (not just `public`).

## 🎯 Key Features

- **Configurable Schema**: Change one variable at the top of each file to deploy to a different schema
- **Schema Auto-Creation**: The first file (`00_enums.sql`) creates the schema if it doesn't exist
- **Consistent Naming**: All objects (tables, functions, triggers, policies) use the same schema
- **Easy Multi-Tenant Setup**: Deploy multiple isolated schemas for different institutions

## 📝 How to Use

### Method 1: Edit the Variable (Recommended)

At the top of each SQL file, you'll find:

```sql
-- Set the target schema name (change this to use a different schema)
\set target_schema 'public'
```

**To use a different schema:**

1. Change `'public'` to your desired schema name (e.g., `'demo_university'`)
2. Make the same change in **all** SQL files you plan to run
3. Execute the files in order

### Method 2: Command-Line Variable

You can override the variable when executing with `psql`:

```bash
psql -v target_schema=demo_university -f 00_enums.sql
psql -v target_schema=demo_university -f 01_user_roles_table.sql
# ... and so on
```

## 🚀 Execution Order

For a fresh schema setup, execute in this order:

### 1. Schema Files (in order)

```bash
# Required: Run first to create schema and enums
psql -f sql/schema/00_enums.sql

# Core tables and functions
psql -f sql/schema/01_user_roles_table.sql
psql -f sql/schema/02_institution_settings_table.sql
psql -f sql/schema/03_therapist_team_table.sql
psql -f sql/schema/04_student_therapist_assignment_table.sql
psql -f sql/schema/05_analytics_functions.sql
```

### 2. Seed Data (optional)

```bash
psql -f sql/seed-data/institution_settings_seed.sql
```

### 3. Updates (only if updating existing schema)

```bash
psql -f sql/updates/01_add_role_based_policies_for_student_data.sql
psql -f sql/updates/02_add_viewer_role_to_rls_policies.sql
psql -f sql/updates/03_fix_handle_new_user_exclude_userspub.sql
```

## 🏢 Multi-Tenant Example

Create separate schemas for different universities:

```bash
# University A
psql -v target_schema=university_a -f sql/schema/00_enums.sql
psql -v target_schema=university_a -f sql/schema/01_user_roles_table.sql
# ... continue with all files

# University B
psql -v target_schema=university_b -f sql/schema/00_enums.sql
psql -v target_schema=university_b -f sql/schema/01_user_roles_table.sql
# ... continue with all files
```

Each university gets isolated data in their own schema.

## 📋 Schema Variable Locations

Every file now includes:

```sql
-- ============================================
-- Schema Configuration
-- ============================================
\set target_schema 'public'
SET search_path TO :target_schema;
```

And all objects are created with the schema prefix:

```sql
CREATE TABLE :target_schema.user_roles (...)
CREATE FUNCTION :target_schema.has_role(...)
CREATE POLICY "..." ON :target_schema.user_roles ...
```

## ⚠️ Important Notes

1. **Consistency**: Make sure to use the **same schema name** across all files
2. **auth schema**: The `auth` schema (Supabase authentication) always remains separate
3. **Search Path**: Functions are configured to search within the target schema
4. **RLS Policies**: Row Level Security policies reference the correct schema
5. **First Run**: Always run `00_enums.sql` first - it creates the schema

## 🔍 Verification

After running the scripts, verify your schema:

```sql
-- List all tables in your schema
SELECT tablename FROM pg_tables WHERE schemaname = 'your_schema_name';

-- List all functions in your schema
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'your_schema_name';

-- Check if schema exists
SELECT schema_name FROM information_schema.schemata
WHERE schema_name = 'your_schema_name';
```

## 🛠️ Default Configuration

By default, all files are set to use the `public` schema to maintain backward compatibility with existing deployments.

To deploy to a new schema, simply change the variable in each file before running.
