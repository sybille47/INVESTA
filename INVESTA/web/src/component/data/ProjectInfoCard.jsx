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
            View Documentation
          </button>

          <button
            onClick={handleGitHubClick}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm"
          >
            GitHub Repository
          </button>


          {/* <button
            onClick={handleGitHubClick}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm"
          >
            Watch Demo (3 min)
          </button> */}
        </div>



        <p className="text-xs text-slate-500 mt-3 text-center">
          No login required
        </p>
      </div>
    </div>
  );
};

export default ProjectInfoCard;