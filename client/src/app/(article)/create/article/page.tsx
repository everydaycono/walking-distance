'use client';

import {
  QuillNoSSRWrapper,
  formats,
  modules
} from '@/components/wrapper/QuillWrapper';

export default function Page() {
  const handleChange = (value: string) => {};

  return (
    <>
      <h1> create article</h1>
      <QuillNoSSRWrapper
        modules={modules}
        formats={formats}
        theme="snow"
        onChange={handleChange}
      />
    </>
  );
}
