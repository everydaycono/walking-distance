'use client';

import { FC, useMemo, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadFiles } from '@/utils/uploadthing/config';

interface QuillNoSSRWrapperProps {
  className?: string;
  onChange?: (value: string) => void;
}

const QuillNoSSRWrapper: FC<QuillNoSSRWrapperProps> = ({
  className,
  onChange
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const imageHandler = async () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file: File | null = input && input.files ? input.files[0] : null;
      if (quillRef.current && file) {
        let quillObj = quillRef.current.getEditor();

        try {
          const uploadFile = await uploadFiles({
            files: [new File([file], file.name, { type: file.type })],
            endpoint: 'imageUploader',
            onUploadBegin: () => {
              const range = quillObj.getSelection(true)?.index ?? 0;
              quillObj.insertEmbed(
                range,
                'image',
                'https://media4.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
              );
            },
            onUploadProgress: (progress) => {}
          });

          const range = quillObj.getSelection(true)?.index ?? 0;

          const uploadImg = uploadFile[0];
          quillObj.deleteText(range, 1);
          quillObj.insertEmbed(range, 'image', uploadImg.url);
          quillObj.setSelection(range, 1);
        } catch (error) {
          console.error(error, 'This is an error message');
          return false;
        }
      }
    };
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          //[{ 'font': [] }],
          [{ header: [1, 2, 3, 4, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' }
          ],
          ['link', 'image'],
          [{ align: [] }, { color: [] }, { background: [] }], // dropdown with defaults from theme
          ['clean']
        ],
        handlers: {
          image: imageHandler
        }
      }
      // ImageResize: {
      //   parchment: Quill.import('parchment')
      // }
    };
  }, []);

  return (
    <ReactQuill
      style={{ height: '500px', maxWidth: '100%' }}
      ref={quillRef}
      theme="snow"
      modules={modules}
      onChange={onChange}
    />
  );
};

export default QuillNoSSRWrapper;

// import 'react-quill/dist/quill.snow.css';
// import dynamic from 'next/dynamic';

// export const QuillNoSSRWrapper = dynamic(() => import('react-quill'), {
//   ssr: false,
//   loading: () => <p>Loading ...</p>
// });

// export const modules = {
//   toolbar: [
//     [{ header: '1' }, { header: '2' }, { font: [] }],
//     [{ size: [] }],
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     [
//       { list: 'ordered' },
//       { list: 'bullet' },
//       { indent: '-1' },
//       { indent: '+1' }
//     ],
//     ['link', 'image', 'video'],
//     ['clean']
//   ],
//   clipboard: {
//     // toggle to add extra line breaks when pasting HTML:
//     matchVisual: false
//   }
// };
// /*
//  * Quill editor formats
//  * See https://quilljs.com/docs/formats/
//  */
// export const formats = [
//   'header',
//   'font',
//   'size',
//   'bold',
//   'italic',
//   'underline',
//   'strike',
//   'blockquote',
//   'list',
//   'bullet',
//   'indent',
//   'link',
//   'image',
//   'video'
// ];
