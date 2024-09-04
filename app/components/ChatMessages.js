// ChatMessages.js
"use client"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatMessages = ({ chat }) => {
  return (
    <div>
      {chat.map((entry, index) => (
        <div key={index} className="mb-4 px-2 md:mx-[10%]">
          <h2 className="bg-[#1e1f20] py-2 px-4 rounded-lg md:min-w-[60%] min-w-[90%]  md:max-w-[60%] max-w-[90%] mr-0 ml-auto my-4">
            {entry.prompt}
          </h2>
          <div className="rounded-lg w-[90%]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {entry.response}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
