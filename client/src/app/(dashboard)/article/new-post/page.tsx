'use client';

import QuillNoSSRWrapper from '@/components/wrapper/QuillWrapper';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { articleValidator } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { arrayTag } from '@/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { CategoryType, CreateArticleType } from './article.type';
import { categoryAPI } from '@/services/api/categoryQuery';
import { articleAPI } from '@/services/api/articleQuery';
import { Label } from '@/components/ui/label';
import next from 'next';

export default function Page() {
  const [editor, setEditor] = useState('');
  const [categoryStatus, setCategoryStatus] = useState(false);
  const [nextPage, setNextPage] = useState(false);

  const router = useRouter();

  // define my custom form with z
  const form = useForm<z.infer<typeof articleValidator>>({
    resolver: zodResolver(articleValidator),
    defaultValues: {
      category: '',
      tags: '',
      title: ''
    }
  });
  const { handleSubmit, control, watch, formState } = form;
  // tanstack query create article
  const { mutate, isLoading } = useMutation({
    mutationFn: (data: CreateArticleType) => articleAPI.createArticle(data),

    onError: (error: { response: { data: { message: any } } }) => {
      console.log(error?.response?.data?.message, 'create article error');
    },
    onSuccess: () => {
      router.push('/article');
    }
  });

  // get category from server
  const { data: categoryData } = useQuery({
    queryKey: ['getAllCategory'],
    queryFn: () => categoryAPI.getAllCategory()
  });

  // handle quill editor change
  const handleChange = (value: string) => {
    setEditor(value);
  };

  // hook form onSubmit
  const onSubmit: SubmitHandler<z.infer<typeof articleValidator>> = (data) => {
    // // convert to arraytag
    // const tags = arrayTag(data.tags);
    // // customCategory가 이미 존재하는 category인경우 찾기
    // // const existTag: CategoryType = categoryData?.find(
    // //   (item: CategoryType) => item.label === data.customCategory
    // // );
    // // 만약 존재하는 경우, category에 해당 customCategory를 삽입
    // // if (existTag) {
    // //   data.category = existTag.label;
    // //   data.customCategory = undefined;
    // // }
    // // format data
    // const formatData = { ...data, tags, content: editor };
    // // call react query mutate
    // mutate(formatData);

    // next page
    setNextPage(true);
  };

  console.log(watch());
  console.log(formState.isValid);
  console.log(editor);

  useEffect(() => {
    if (!nextPage) return;

    window.scrollTo({ left: 0, top: 9999, behavior: 'smooth' });
  }, [nextPage]);

  // return jsx
  // -----------------------------------------------------------
  return (
    <div className="m-10">
      <div className="text-4xl font-semibold text-center mb-10">
        Create Article
      </div>
      <Form {...form}>
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
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
          <Label>Content</Label>
          <QuillNoSSRWrapper
            // style={{
            //   height: '280px'
            // }}
            // modules={modules}
            // formats={formats}
            // theme="snow"
            onChange={handleChange}
          />
          <div className="lg:mt-16 mt-24"></div>

          {/* tag input */}
          <FormField
            control={control}
            name="tags"
            render={({ field }) => (
              <FormItem className="mt-5">
                <div className="mb-5">
                  <FormLabel className="mb-3">Tags</FormLabel>
                  <FormControl>
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

          {/* select category */}
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <div className="mb-5">
                  <FormLabel>Category</FormLabel>
                  <select
                    {...field}
                    id="small"
                    className="block w-full p-2 my-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      field.onChange(e);
                      if (e.target.value === 'custom') {
                        setCategoryStatus(true);
                      } else {
                        setCategoryStatus(false);
                      }
                    }}
                  >
                    <option value={''}>Choose a Category</option>
                    <option value={'custom'}>Custom Category</option>
                    {categoryData?.map((item: CategoryType) => (
                      <option key={item.id} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* input category*/}
          {/* {categoryStatus && (
            <FormField
              control={control}
              name="customCategory"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-">
                    <FormControl className="mt-2">
                      <Input
                        placeholder="Type only one category you want to create"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          )} */}

          {/* submit button */}
          <Button
            disabled={!form.formState.isValid && editor.length < 20}
            className=" mt-5"
            type="submit"
          >
            Create Article
          </Button>

          {/* next page */}
          {nextPage && (
            <div className="mt-20 min-h-[90vh]">
              <h1>Create Article</h1>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
