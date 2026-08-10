# Freshers Orientation Strategy

Targeting freshers during orientation is the best way to guarantee mass adoption. If they start using the app on Day 1 to navigate the campus and track orientation events, they will never uninstall it.

Here is a comprehensive strategy to engage and map them into the app.

## User Review Required
Please review the proposed strategy. I need your feedback on the **Auth Bypass** approach before we write any code.

---

## 1. The Core Problem: No PEC Email
Freshers usually do not receive their official `@pec.edu.in` email IDs until a few weeks into the semester. Currently, our `AuthController.php` strictly blocks any login without a PEC email. If we don't fix this, 0% of freshers will be able to use the app during orientation.

### Open Question 1: How should we bypass the email lock?
I propose we modify the backend to accept personal Gmails **only if** they provide an "Invite Code".
- **How it works:** On the login screen, we add a button "I'm a Fresher (No PEC Email Yet)". They tap it, enter an invite code (e.g., `PEC2026` — which you can announce during orientation), and then log in with their personal Gmail.
- **Why this is good:** It keeps random outsiders out of the app, but allows freshers in immediately. 
- **Alternative:** We just permanently open the app to *any* Gmail account, but outsiders won't find the app useful anyway. 

**👉 Do you prefer the Invite Code approach, or just opening it up to all Gmails temporarily?**

---

## 2. Mapping Them: 1st Year Sections
Freshers do not have "Branches" yet for timetable purposes; they are divided into Sections (e.g., Section A, Section B... Section P).

### Proposed Changes
- **Database:** Create a `FreshersSeeder.php` that generates a generic "B.Tech 1st Year" Branch, and creates `CourseClass` entries for "Section A" through "Section P".
- **App Flow:** When a fresher logs in, the app forces them to select their Section from a dropdown so they are correctly mapped to their orientation/class timetable.

---

## 3. Engaging Them: The Orientation Hub
We need to provide immediate value to freshers so they keep opening the app.

### Proposed Changes
- **Frontend Widget:** Build a massive, beautiful "Orientation Hub" widget on the Dashboard (only visible to 1st Years).
- **Features inside the Hub:**
  1. **Live Orientation Schedule:** What is happening right now in the auditorium?
  2. **Campus Map Links:** Direct links to Google Maps pins for Auditorium, Hostels, and Academic Blocks.
  3. **Fresher FAQs:** A small list of essential tips for Day 1.

---

## Next Steps
Once you let me know your preference on the **Auth Bypass (Invite Code vs Open Gmail)**, I will create a concrete technical plan with the exact files we will modify, and we can begin execution!
