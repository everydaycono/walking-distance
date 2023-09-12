'use client';
import { IUser } from '@/types/next-auth';
import { signOut } from 'next-auth/react';
import { FC } from 'react';

interface AvatarProps {
  user?: IUser;
  loading?: boolean;
}

import * as React from 'react';

import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Keyboard,
  LogOut,
  Mail,
  MessageSquare,
  PenSquare,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users
} from 'lucide-react';
import Link from 'next/link';

const Avatar: FC<AvatarProps> = ({ user, loading = false }) => {
  return (
    <div className="flex items-center">
      {/* login user  */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-gray-500 rounded-full p-2 ml-4">
              {user?.avatar ? (
                <User size={20} color="red" />
              ) : (
                <User size={20} />
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuItem>
              <div className="flex">
                <span className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                  <span className="flex w-2.5 h-2.5 bg-green-500 rounded-full mr-1.5 flex-shrink-0" />
                </span>
                USER :<h6 className="ml-3">{user?.firstName}</h6>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex">
                <span className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                  <span className="flex w-2.5 h-2.5 bg-green-500 rounded-full mr-1.5 flex-shrink-0" />
                </span>
                ROLE :<h6 className="ml-3">{user?.role}</h6>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PenSquare className="mr-2 h-4 w-4" />
                <span>New Post</span>
                <DropdownMenuShortcut>⌘+P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Keyboard className="mr-2 h-4 w-4" />
                <span>Keyboard shortcuts</span>
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Team</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Invite users</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Email</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Message</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>More...</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {/* not login user */}
      {!user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-gray-100 rounded-full p-2 ml-4">
              <User
                size={20}
                color="gray"
                strokeWidth={3}
                absoluteStrokeWidth
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="px-5">
            <DropdownMenuLabel>
              <div className="flex my-7 px-4">
                <h3 className="text-sm font-bold">Get started on WD 😀</h3>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="mt-3">
              <div className="flex justify-center w-full">
                <Link
                  className="justify-center w-full text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mb-1"
                  href="/login"
                >
                  Sign in
                </Link>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex justify-center w-full">
                <Link
                  className="justify-center w-full text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center dark:focus:ring-gray-500 mb-1"
                  href="/register"
                >
                  Sign up
                </Link>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default Avatar;
