'use client';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from '@/components/ui/command';

import {
  Calculator,
  Calendar,
  CornerDownRight,
  CreditCard,
  Settings,
  Smile,
  User
} from 'lucide-react';

import { FC, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { searchAPI } from '@/services/api/searchQuery';
import Link from 'next/link';
import { findAndShowSubstring } from '@/utils/\bfindTargetString';

interface ArticleSearchModalProps {
  open: boolean;
  toggleModal: (status: boolean) => void;
}

const ArticleSearchModal: FC<ArticleSearchModalProps> = ({
  open,
  toggleModal
}) => {
  const [search, setSearch] = useState('');
  const debouncedQuery = useDebounce(search, 300);

  const { refetch, data, error, isLoading } = useQuery({
    queryKey: ['search', search],
    queryFn: () => searchAPI.getSearchArticleBykeyword(search),
    enabled: false
  });

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      refetch();
    }
  }, [debouncedQuery]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={(status) => {
        setSearch('');
        toggleModal(status);
      }}
    >
      <CommandInput
        value={search}
        onChangeCapture={(e) => setSearch(e.currentTarget.value)}
        placeholder="Type a command or search..."
      />
      <CommandList>
        {search !== '' && data && data.length === 0 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {search.length === 1 && (
          <CommandEmpty>Search keyword is too short.</CommandEmpty>
        )}

        <>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile className="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator className="mr-2 h-4 w-4" />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </>
        {data && data?.length > 0 && (
          <div className="p-4">
            <h2 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-500">
              Articles
            </h2>
            <ul className="max-w-md space-y-1 text-gray-500 list-none list-inside dark:text-white">
              {data.map((item) => {
                const [frontText, targetText, tailText] = findAndShowSubstring(
                  item.content,
                  search
                );
                return (
                  <Link
                    href={`/article/${item.id}`}
                    key={item.id}
                    className="w-full px-2 py-1 hover:bg-gray-700 block cursor-pointer"
                  >
                    {item.title}
                    <div className="flex items-end">
                      <CornerDownRight size={20} className="mr-3" />
                      <p className="text-md text-gray-400">{frontText}</p>
                      <p className="text-md mx-2 underline">{targetText}</p>
                      <p className="text-md text-gray-400">{tailText}</p>
                    </div>
                  </Link>
                );
              })}
            </ul>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default ArticleSearchModal;
