import React from 'react';
import { createRoot } from 'react-dom/client';
import TaskPage from './presentation/pages/TaskPage';
import './styles.css';
createRoot(document.getElementById('root')).render(<React.StrictMode><TaskPage/></React.StrictMode>);
