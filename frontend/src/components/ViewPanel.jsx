import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/ViewPanel.css';

const ViewPanel = ({ content, format = 'text' }) => {
  const renderTextView = () => (
    <div className="view-panel text-view">
      <div className="view-content">
        {content.split('\n').map((line, idx) => (
          <div key={idx} className="text-line">
            <span className="line-number">{idx + 1}</span>
            <span className="line-content">{line || ' '}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCodeView = () => (
    <div className="view-panel code-view">
      <SyntaxHighlighter 
        language="javascript" 
        style={atomDark}
        showLineNumbers={true}
        customStyle={{
          padding: '20px',
          borderRadius: '0px',
          fontSize: '13px',
          lineHeight: '1.6',
          margin: '0',
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );

  const renderJsonView = () => {
    try {
      // Try to parse as JSON, or use content as-is
      let jsonContent = content;
      try {
        const parsed = JSON.parse(content);
        jsonContent = JSON.stringify(parsed, null, 2);
      } catch (e) {
        // If not valid JSON, try to format it as JSON with line numbers
      }

      return (
        <div className="view-panel json-view">
          <SyntaxHighlighter 
            language="json" 
            style={atomDark}
            showLineNumbers={true}
            customStyle={{
              padding: '20px',
              borderRadius: '0px',
              fontSize: '13px',
              lineHeight: '1.6',
              margin: '0',
            }}
          >
            {jsonContent}
          </SyntaxHighlighter>
        </div>
      );
    } catch (e) {
      return (
        <div className="view-panel json-view error">
          <div className="error-message">
            <p>Invalid JSON format</p>
            <p>{e.message}</p>
          </div>
          <SyntaxHighlighter 
            language="json" 
            style={atomDark}
            showLineNumbers={true}
            customStyle={{
              padding: '20px',
              borderRadius: '0px',
              fontSize: '13px',
              lineHeight: '1.6',
              margin: '0',
            }}
          >
            {content}
          </SyntaxHighlighter>
        </div>
      );
    }
  };

  return (
    <div className="view-panel-wrapper">
      {format === 'text' && renderTextView()}
      {format === 'code' && renderCodeView()}
      {format === 'json' && renderJsonView()}
    </div>
  );
};

export default ViewPanel;
