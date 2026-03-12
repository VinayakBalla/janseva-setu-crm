# JanSeva Setu Hackathon Prototype

This is the interactive front-end prototype for the **JanSeva Setu (Digital Democracy Portal)** project, designed specifically for a rapid hackathon presentation.

## Features Built
1. **No Setup Required**: Built with Vanilla HTML/CSS/JS. No backend server is required to show to judges. Open `index.html` in Chrome/Edge and you are good to go!
2. **JanMitra AI Assistant**: A fully functional floating chat widget on the bottom right of the screen that takes Voice input via your browser's Web Speech API. 
3. **Citizen Portal (`index.html`)**: Allows users to submit mock complaints with Anonymous/Aadhaar/OTP authentications and features a Geo-Democracy map snippet.
4. **Complaint Tracking Dashboard (`dashboard.html`)**: Allows government workers to see complaints. The AI automatically routes them to the correct Indian Government department (like Jal Board or PWD) and assigns it to a real mock officer character.
5. **State Management**: Uses `localStorage` to save all reports instantly. You can submit on the portal and immediately watch it appear on the dashboard.

## How to Present to Judges
1. Open `index.html` in your web browser. Showcase the "NIC Blue" accessible design scheme conforming to GIGW standards.
2. Click the Language Modal (`भाषा चुनें`) to explain how the entire site handles multiline translation dynamically.
3. Show the **"Submit Anonymous Complaint"** button and highlight your privacy focus.
4. Scroll to the **"Report an Issue"** section. Emphasize that location validation is strictly mandatory.
5. **THE AI DEMO**: 
   - Click the "JanMitra Assist" chat bubble in the bottom right corner.
   - Tell the judges, "We built a zero-backend voice AI". 
   - Click the microphone and literally speak into your browser: *"I want to report a huge pothole."*
   - Let the bot reply and guide you to submit the location. 
6. Show the "Geo-Democracy" map and explain how you are giving citizens tracking data on local budget expenditure.
7. Click "Complaint Tracking Dashboard" in the navigation. Show how the AI autonomously routed your pothole complaint straight to the **PWD Officer**!

Good luck pitching your project!
