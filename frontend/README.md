# Adaptive Learning Quiz Engine

## I. Project Overview
A full-stack adaptive learning platform that generates real-time quizzes using AI, adjusts difficulty based on user performance, and tracks detailed analytics.

## II. Product Functions

The main functions of the system include:

1.  **Secure Authentication & Authorization**:
    *   **User Registration & Login**: JWT-based secure authentication for Students and Admins.
    *   **Single Device Enforcement**: Prevents multiple active sessions by invalidating older sessions on new logins.
    *   **Google OAuth Integration**: Option to log in using Google credentials.

2.  **AI-Powered Quiz Generation**:
    *   **Dynamic Question Creation**: Integrates with **OpenAI API** to generate unique, subject-specific questions (CDAC/PG-DAC level) in real-time.
    *   **Subject Selection**: Supports multiple subjects like Java, C++, DSA, and Database Technologies.

3.  **Adaptive Learning Engine**:
    *   **Real-time Adaptation**: Adjusts difficulty based on user performance (Correct → **Harder**, Wrong → **Easier**) to maintain optimal challenge.
    *   **Skill Scoring**: Calculates a weighted "Skill Score" considering both accuracy and difficulty level.

4.  **Student Progress & Gamification**:
    *   **Instant Result & Review**: Provides immediate feedback, accuracy percentage, and a detailed question-by-question review.
    *   **Weekly Leaderboard**: Ranks students based on their Skill Score to foster healthy competition.
    *   **Dashboard**: Displays personal stats like total quizzes taken, accuracy trends, and skill growth.

5.  **Admin Dashboard & Analytics**:
    *   **Deep Analytics**: View total active users, subject popularity, and difficulty distribution (Easy vs. Hard questions served).
    *   **Report Generation**: Ability to download detailed student performance reports in **CSV format**.
    *   **System Management**: Monitor system health and user activity.
