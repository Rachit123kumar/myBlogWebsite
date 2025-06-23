'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function GenerateBlogPage() {
  const [headline, setHeadline] = useState('');
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch('/api/generate-blog', {
      method: 'POST',
      body: JSON.stringify({ headline, keyword }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
  const de = data.content
  // Ensure there's a double line after headings
  .replace(/(#+ .+)\n(?!\n)/g, '$1\n\n')
  // Ensure there's a double line after paragraphs
  .replace(/([^\n])\n([^\n#])/g, '$1\n\n$2');

    setResult(de || 'Something went wrong');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Input
        placeholder="Enter Headline"
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
      />
      <Input
        placeholder="Enter Related Keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Blog'}
      </Button>

      {result && (
        <div className="prose max-w-none mt-6 border p-4 rounded bg-white shadow">
    <ReactMarkdown remarkPlugins={[require('remark-gfm')]}>{result}</ReactMarkdown>


      </div>
      )}
    </div>
  );
}
