import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-serif prose-headings:text-ink prose-p:text-gray-700 prose-li:text-gray-700">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 border-b-2 border-accent/30 pb-2 text-accent" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-8 mb-4 text-ink" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 border-l-4 border-accent pl-3" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 my-4 space-y-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 my-4 space-y-2" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 italic text-gray-700 rounded-r" {...props} />,
            code: ({node, inline, className, children, ...props} : any) => {
                return inline ? 
                    <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded font-mono text-sm" {...props}>{children}</code> :
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4" {...props}>{children}</pre>
            }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;