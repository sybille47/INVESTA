import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectInfoCard = () => {
  const navigate = useNavigate();

  const handleDocumentationClick = () => {
    navigate('/documentation');
  };

  const handleGitHubClick = () => {
    window.open('https://github.com/sybille47/INVESTA', '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          {/* <svg
            width="0"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-slate-600"
          > */}
            {/* <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            /> */}
            {/* <path
              d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            /> */}
          {/* </svg> */}
          <h3 className="text-lg font-semibold text-slate-800">
            Exploring This Project?
          </h3>
        </div>

        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          View the functional documentation and requirements analysis, or check out the code repository.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDocumentationClick}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-7 bg-white border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm"
          >
            {/* <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg> */}
            View Documentation
          </button>

          <button
            onClick={handleGitHubClick}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm"
          >
            {/* <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg> */}
            GitHub Repository
          </button>


          <button
            onClick={handleGitHubClick}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm"
          >
            {/* <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg> */}
            Watch Demo (3 min)
          </button>
        </div>



        <p className="text-xs text-slate-500 mt-3 text-center">
          No login required
        </p>
      </div>
    </div>
  );
};

export default ProjectInfoCard;