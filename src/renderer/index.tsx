// import React from "react";
// import ReactDOM from "react-dom/client";
// import './styles.css';
// import { EditModeProvider } from "./context/EditModeContext";
// import Main from "./components/Main";
// import { firebaseService } from "../firebase";
// import { AuthProvider } from "./context/AuthContext";
// import { HashRouter, Routes, Route } from 'react-router-dom';
// import LoginPage from './components/auth/LoginPage';
// // import { RealtimeProvider } from "./context/RealtimeContext";


// const env = process.env.NODE_ENV === 'development' ? 'test' : 'release';
// firebaseService.initialize(env);
// console.log('Current environment:', firebaseService.getCurrentEnvironment());

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <HashRouter>
//       <AuthProvider>
//         {/* <RealtimeProvider> */}
//           <EditModeProvider>
//             <Routes>
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/" element={<Main />} />
//             </Routes>
//           </EditModeProvider>
//         {/* </RealtimeProvider> */}
//       </AuthProvider>
//     </HashRouter>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import './styles.css';
import { EditModeProvider } from "./context/EditModeContext";
import Main from "./components/Main";
import { firebaseService } from "../firebase";
import { AuthProvider } from "./context/AuthContext";
import { HashRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import FeedbackModal from './components/modals/FeedbackModal'; // 피드백 모달 임포트 추가

// import { RealtimeProvider } from "./context/RealtimeContext";
const env = process.env.NODE_ENV === 'development' ? 'test' : 'release';
firebaseService.initialize(env);
console.log('Current environment:', firebaseService.getCurrentEnvironment());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        {/* <RealtimeProvider> */}
        <EditModeProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Main />} />
          </Routes>
        </EditModeProvider>
        {/* </RealtimeProvider> */}
      </AuthProvider>
    </HashRouter>
    {/* 모든 컨텍스트와 라우터 바깥에 FeedbackModal 배치 */}
    <FeedbackModal />
  </React.StrictMode>
);