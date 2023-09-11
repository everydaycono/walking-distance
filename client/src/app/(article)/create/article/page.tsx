'use client';

import {
  QuillNoSSRWrapper,
  formats,
  modules
} from '@/components/wrapper/QuillWrapper';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { articleValidator } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { arrayTag } from '@/utils';

export default function Page() {
  const [editor, setEditor] = useState('');

  // define my custom form with z
  const form = useForm<z.infer<typeof articleValidator>>({
    resolver: zodResolver(articleValidator)
  });
  const { handleSubmit, control } = form;

  // handle quill editor change
  const handleChange = (value: string) => {
    setEditor(value);
  };

  // onSubmit
  const onSubmit: SubmitHandler<z.infer<typeof articleValidator>> = (data) => {
    const hashtag = arrayTag(data.tags);
    const formatData = { ...data, tags: hashtag, content: editor };
    console.log(formatData, '@@');

    // mutate(formatData);
  };

  return (
    <div className="m-10">
      <div className="text-4xl font-semibold text-center mb-10">
        Create Article
      </div>
      <Form {...form}>
        <form className="mt-20" onSubmit={handleSubmit(onSubmit)}>
          {/* title */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div className="mb-5">
                  <FormLabel>Title</FormLabel>
                  <FormControl className="mt-2">
                    <Input placeholder="your article title" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* content quill editor */}
          <FormItem>
            <div className="mb-20">
              <FormLabel>Content</FormLabel>
              <QuillNoSSRWrapper
                style={{
                  height: '300px'
                }}
                modules={modules}
                formats={formats}
                theme="snow"
                onChange={handleChange}
              />
            </div>
          </FormItem>

          {/* tags */}
          <FormField
            control={control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <div className="mb-5">
                  <FormLabel>Tags</FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Type tags for article separated by comma"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* category */}
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <div className="mb-5">
                  <FormLabel>Category</FormLabel>
                  <FormControl className="mt-2">
                    <Input placeholder="Type category for article" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          {/* submit button */}
          <Button
            // disabled={!form.formState.isValid}
            className=" mt-5"
            type="submit"
            // isLoading={isLoading}
          >
            Create Article
          </Button>
        </form>
      </Form>
    </div>
  );
}
