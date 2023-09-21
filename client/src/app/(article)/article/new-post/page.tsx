'use client';

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
import { categoryAPI } from '@/services/api/categoryQuery';
import { articleAPI } from '@/services/api/articleQuery';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import ThumbnailImage from '@/components/ThumbnailImage';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CategoryType, CreateArticleType } from './article.type';
import QuillWrapper from '@/components/wrapper/QuillWrapper';

export type thumbNailType = {
  url: string;
  name: string;
  status: 'loading' | 'standby' | 'complete' | 'error';
};

export default function Page() {
  const [editor, setEditor] = useState('');
  const [thumbNail, setThumbNail] = useState<thumbNailType>({
    url: '',
    name: '',
    status: 'standby'
  });
  const [nextPage, setNextPage] = useState(false);

  const router = useRouter();

  // define my custom form with z
  const form = useForm<z.infer<typeof articleValidator>>({
    resolver: zodResolver(articleValidator),
    defaultValues: {
      category: '',
      tags: '',
      title: '',
      status: 'publish'
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
      router.push('/');
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

  const handleThumbnail = ({ name, status, url }: thumbNailType) => {
    setThumbNail({ name, status, url });
  };

  // hook form onSubmit
  const onSubmit: SubmitHandler<z.infer<typeof articleValidator>> = (data) => {
    // convert to arraytag
    // customCategory가 이미 존재하는 category인경우 찾기
    // const existTag: CategoryType = categoryData?.find(
    //   (item: CategoryType) => item.label === data.customCategory
    // );
    // 만약 존재하는 경우, category에 해당 customCategory를 삽입
    // if (existTag) {
    //   data.category = existTag.label;
    //   data.customCategory = undefined;
    // }
    // format data
    const tags = arrayTag(data.tags);
    const formatData: CreateArticleType = {
      title: data.title,
      category: data.category,
      status: data.status,
      content: editor,
      thumbnail: thumbNail.url,
      tags: tags
    };

    mutate(formatData);
    // call react query mutate
    // next page
  };

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
          <QuillWrapper onChange={handleChange} />
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
                  >
                    <option value={''}>Choose a Category</option>
                    {categoryData?.map((item) => (
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

          {/* submit button */}
          {!nextPage && (
            <Button
              disabled={!form.formState.isValid && editor.length < 20}
              className=" mt-5"
              type="button"
              onClick={() => setNextPage(true)}
            >
              Create Article
            </Button>
          )}

          {/* next page */}
          {nextPage && (
            <div className="mt-20 min-h-[90vh]">
              <Separator className="my-4" />
              <h1>Create Article</h1>

              <div className="flex space-x-10">
                <ThumbnailImage onUploadComplete={handleThumbnail} />
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">
                    Thumbnail
                  </h2>

                  <div className="max-w-lg h-40 bg-slate-100 flex items-center">
                    {thumbNail.status === 'complete' && (
                      <img
                        className="h-40"
                        src={thumbNail.url}
                        alt={thumbNail.name}
                      />
                    )}
                    {thumbNail.status === 'loading' && (
                      <img
                        className="h-40"
                        src="https://i.gifer.com/ZKZg.gif"
                        alt="image-loading"
                      />
                    )}
                    {thumbNail.status === 'standby' && (
                      <h1 className="px-3">Please upload your thumbnail</h1>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Select article status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="publish" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              publish 🚀
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="draft" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              draft 📝
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="onlyme" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              onlyme 🔒
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Create Article</Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
