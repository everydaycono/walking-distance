'use client';

import {
  FC,
  LegacyRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadFiles } from '@/utils/uploadthing/config';
import dynamic from 'next/dynamic';

interface IWrappedComponent extends React.ComponentProps<typeof ReactQuill> {
  forwardedRef: LegacyRef<ReactQuill>;
}
const ReactQuillBase = dynamic(
  async () => {
    const { default: ReactQuill } = await import('react-quill');

    function QuillJS({ forwardedRef, ...props }: IWrappedComponent) {
      return <ReactQuill ref={forwardedRef} {...props} />;
    }

    return QuillJS;
  },
  {
    ssr: false
  }
);

interface QuillNoSSRWrapperProps {
  onChange: (value: string) => void;
  className?: string;
  value: string;
}
const QuillWrapper: FC<QuillNoSSRWrapperProps> = ({
  value,
  onChange,
  className
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  // const [editor, setEditor] = useState('');
  const quillRef = useRef<ReactQuill>(null);

  const imageHandler = useCallback(async () => {
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
            }
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
  }, [quillRef.current]);

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
    };
  }, []);

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video'
  ];
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <div className="h-full">
        <ReactQuillBase
          className="h-[90%]]"
          onChange={onChange}
          modules={modules}
          formats={formats}
          forwardedRef={quillRef}
          value={value}
        />
      </div>
    </>
  );
};

export default QuillWrapper;
