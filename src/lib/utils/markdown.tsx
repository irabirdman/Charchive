import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

interface MarkdownProps {
  content: string | null | undefined;
  className?: string;
}

export function Markdown({ content, className = '' }: MarkdownProps) {
  if (!content) return null;

  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkBreaks]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
