@echo off
REM Create all necessary folder structure for Next.js app

echo Creating folders...

REM Auth pages
mkdir src\app\auth\login
mkdir src\app\auth\register

REM Dashboard pages
mkdir src\app\dashboard
mkdir src\app\dashboard\events\new
mkdir src\app\dashboard\events\[id]\preview
mkdir src\app\dashboard\events\[id]\contacts
mkdir src\app\dashboard\events\[id]\schedule

REM RSVP pages
mkdir src\app\rsvp\[eventId]

REM API routes
mkdir src\app\api\events\[id]
mkdir src\app\api\contacts\[id]
mkdir src\app\api\contacts\rsvp

REM Components
mkdir src\components\ui
mkdir src\components\layout

echo Folder structure created!
echo Now run: npm run dev
