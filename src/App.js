// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AccountSetup from './components/AccountSetup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DashboardContent from './components/DashboardContent';
import ClassroomManagement from './components/ClassroomManagement';
import TimeTable from './components/TimeTable';
import Attendance from './components/Attendance';
import Examination from './components/Examination';
import ViewAdmitCard from './components/ViewAdmitCard';
import ViewAnnouncements from './components/ViewAnnouncements';
import Profile from './components/Profile';
import AssignmentCreate from './components/AssignmentCreate';
import AssignmentView from './components/AssignmentView';
import Chat from './components/Chat';
import Lesson from './components/Lesson';
import Topic from './components/Topic';

const appStyles = {
  minHeight: '100vh',
  backgroundColor: '#f5f5f5'
};

function App() {
  return (
    <Router>
      <div style={appStyles}>
        <Routes>
          <Route path="/" element={<AccountSetup />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard route (only dashboard has /dashboard URL) */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardContent />} />
          </Route>

          {/* All other routes have direct URLs */}
          <Route path="/classroom" element={<Dashboard />}>
            <Route index element={<ClassroomManagement />} />
          </Route>

          <Route path="/timetable" element={<Dashboard />}>
            <Route index element={<TimeTable />} />
          </Route>

          <Route path="/attendance" element={<Dashboard />}>
            <Route index element={<Attendance />} />
          </Route>

          <Route path="/examination" element={<Dashboard />}>
            <Route index element={<Examination />} />
          </Route>

          <Route path="/profile" element={<Dashboard />}>
            <Route index element={<Profile />} />
          </Route>

          <Route path="/assignment-create" element={<Dashboard />}>
            <Route index element={<AssignmentCreate />} />
          </Route>

          <Route path="/assignment-view" element={<Dashboard />}>
            <Route index element={<AssignmentView />} />
          </Route>

          <Route path="/chat" element={<Dashboard />}>
            <Route index element={<Chat />} />
          </Route>

          <Route path="/lesson" element={<Dashboard />}>
            <Route index element={<Lesson />} />
          </Route>

          <Route path="/topic" element={<Dashboard />}>
            <Route index element={<Topic />} />
          </Route>

          <Route path="/view-admit-card" element={<Dashboard />}>
            <Route index element={<ViewAdmitCard />} />
          </Route>

          <Route path="/view-announcements" element={<Dashboard />}>
            <Route index element={<ViewAnnouncements />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;