'use client';
import React, { useState } from 'react';

export default function TagsInput({ value = [], onChange, placeholder = 'Add tag' }) {
  const [text, setText] = useState('');

  function add() {
    const v = text.trim();
    if (!v) return;
    if (!value.includes(v)) onChange([...value, v]);
    setText('');
  }

  function remove(tag) {
    onChange(value.filter(x => x !== tag));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
            <span>{t}</span>
            <button type="button" onClick={() => remove(t)} className="text-gray-500 hover:text-gray-700">×</button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          className="flex-1 rounded-md border border-gray-200 p-2 text-sm focus:ring-2 focus:ring-indigo-200"
        />
        <button type="button" onClick={add} className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm">Add</button>
      </div>
    </div>
  );
}
