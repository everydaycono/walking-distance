import { FC } from 'react';

import { UploadDropzone } from '@uploadthing/react';

import { OurFileRouter } from '@/app/api/uploadthing/core';
import { thumbNailType } from '@/app/(dashboard)/article/new-post/page';
interface UploadDropzoneProps {
  onUploadComplete: ({ name, status, url }: thumbNailType) => void;
}

const ThumbnailImage: FC<UploadDropzoneProps> = ({ onUploadComplete }) => {
  return (
    <UploadDropzone<OurFileRouter>
      className="py-10 px-20"
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        // Do something with the response
        if (!res) return;
        onUploadComplete({
          status: 'complete',
          url: res[0].url,
          name: res[0].name
        });
      }}
      onUploadError={(error: Error) => {
        onUploadComplete({
          status: 'error',
          url: '',
          name: error.message
        });
      }}
      onUploadBegin={(name) => {
        // Do something once upload begins
        onUploadComplete({
          status: 'loading',
          url: '',
          name: name
        });
      }}
    />
  );
};

export default ThumbnailImage;
