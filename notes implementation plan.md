# Notes & Study Materials: Implementation Plan

You are correct; we currently do not have any database tables or UI for uploading and managing notes. Implementing this is a fantastic next step to make the app a true academic hub.

Here is a proposed robust architecture for the "Study Materials" feature.

## 1. Database Architecture
We will create a new `study_materials` table via a Laravel migration:

- `id` (Primary Key)
- `class_id` (Foreign Key -> `classes`): Ensures notes are siloed to the correct branch/class (e.g., CSE G1).
- `uploader_id` (Foreign Key -> `users`): Tracks who uploaded the file.
- `title` (String): e.g., "Unit 1 Thermodynamics Summary".
- `subject` (String): e.g., "THERMO".
- `file_type` (Enum): `pdf`, `image`, `link` (for Drive links).
- `file_url` (String): The actual link to the file.
- `created_at` / `updated_at`

## 2. File Storage Mechanism

> [!IMPORTANT]
> **Storage Decision Needed**
> Storing hundreds of PDFs locally on your server will eat up your hosting disk space quickly. I propose two options:
> 
> **Option A (Recommended): Cloudinary / Supabase Storage**
> We integrate a free cloud bucket. When a user uploads a PDF, it goes straight to the cloud, and we just save the secure URL in our database. It's infinitely scalable and fast.
> 
> **Option B: Google Drive Links Only**
> Instead of handling raw file uploads, the app only accepts Google Drive / Dropbox URLs. This costs zero storage and is easiest to build, but users have to upload to Drive first.
>
> **Option C: Laravel Local Storage**
> We store files directly on your backend server (`storage/app/public`). Simple to build, but you might run out of disk space in production.

## 3. Role-Based Access (Security)

> [!WARNING]
> **Who is allowed to upload notes?**
> - Do you want **only Class Representatives (CRs)** to have the power to upload official notes to prevent spam?
> - Or do you want **any student** in the class to be able to upload, creating a community-driven repository? (We could add a "Verified/Official" badge for CR uploads).

## 4. Frontend UI Experience
- **Location:** We will add a new "Study Materials" button on the Dashboard.
- **List View:** A sleek SaaS-style list grouped by Subject.
- **Interactivity:** Tapping a PDF will open it instantly in an in-app viewer (using `expo-web-browser` or a PDF library), or redirect to the link.
- **Upload Modal:** A clean modal for CRs/Students to attach a file from their phone using `expo-document-picker`.

## User Review Required
Please review the open questions regarding **File Storage** and **Upload Permissions**. Once you decide, I will create the migration and build the feature!
