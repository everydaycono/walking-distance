'use client';
import { registerType, registerUser } from '@/services/api';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import LoadingModal from './modal/LoadingModal';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface AuthFormProps {
  type: 'register' | 'login';
}

type ErrorType = {
  message: string;
  statusCode: string;
  path: string;
  timeStamp: string;
};

const signupText = {
  header: 'Sign up your new account',
  submitButton: 'Sign up',
  githubButton: 'Sign up with Github',
  haveAccount: 'Already have an account?',
  haveAccountLink: 'Sign in'
};
const signinText = {
  header: 'Sign in to your account',
  submitButton: 'Sign in',
  githubButton: 'Sign in with Github',
  haveAccount: 'Don’t have an account yet?',
  haveAccountLink: 'Sign up'
};

const AuthForm: FC<AuthFormProps> = ({ type }) => {
  const router = useRouter();
  const {
    mutate: handleRegister,
    isLoading,
    error,
    data
  } = useMutation({
    // if type is register, then use mutationFn to register
    mutationFn: (data: registerType) => {
      return registerUser(data);
    },
    onError: (err: ErrorType) => {
      if (err.message) {
        setSignupError(err.message);
        return;
      }
      return setSignupError(err.message || 'Something went wrong');
    },
    onSuccess: (suc) => {
      router.push('/register/check-email');
    }
  });

  let textContent = type === 'register' ? signupText : signinText;

  const initialAuthFormValues = {
    email: '',
    password: '',
    ...(type === 'register' && {
      confirmPassword: '',
      firstName: '',
      lastName: ''
    })
  };
  const [authFormValue, setAuthFormValue] = useState(initialAuthFormValues);
  const [signupError, setSignupError] = useState('');

  const updateAuthFormValues = (
    field: Partial<keyof typeof initialAuthFormValues>,
    value: string
  ) => {
    setAuthFormValue((prevValues) => ({
      ...prevValues,
      [field]: value
    }));
  };

  const handleGithubButton = () => {
    window.location.href = 'http://localhost:8000/api/auth/social-redirect';
  };

  const register = () => {
    if (
      authFormValue.firstName === '' ||
      authFormValue.lastName === '' ||
      authFormValue.email === '' ||
      authFormValue.password === '' ||
      authFormValue.email === ''
    ) {
      alert('값을 모두 입력해주세요');
      return;
    }

    const { confirmPassword, ...rest } = authFormValue;

    handleRegister(rest as registerType);
  };

  const login = () => {
    signIn('credentials-login', {
      email: authFormValue.email,
      password: authFormValue.password
    });
  };

  const handleAuthSubmitButton = () => {
    type === 'register' ? register() : login();
  };

  useEffect(() => {
    // get URL
    const searchParams = window.location.search;
    const decodedParam = decodeURIComponent(searchParams);

    // delete ?error= from decodedURI searchParams
    const decodedURI = decodedParam.replace('?error=', '');
    setSignupError(decodedURI);
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      {isLoading && <LoadingModal />}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {textContent['header']}
            </h1>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4 md:space-y-6"
            >
              {type === 'register' && (
                <div className="flex space-x-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      First name
                    </label>
                    <input
                      type="test"
                      name="firstName"
                      id="firstName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="first name"
                      value={authFormValue.firstName}
                      onChange={(e) =>
                        updateAuthFormValues('firstName', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="last name"
                      value={authFormValue.lastName}
                      onChange={(e) =>
                        updateAuthFormValues('lastName', e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="email@email.com"
                  value={authFormValue.email}
                  onChange={(e) =>
                    updateAuthFormValues('email', e.target.value)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={authFormValue.password}
                  onChange={(e) =>
                    updateAuthFormValues('password', e.target.value)
                  }
                />
              </div>
              {type === 'register' && (
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password confirm
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={authFormValue.confirmPassword}
                    onChange={(e) =>
                      updateAuthFormValues('confirmPassword', e.target.value)
                    }
                  />
                </div>
              )}
              {type === 'login' && (
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>
              )}
              {signupError && (
                <div
                  className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                  role="alert"
                >
                  <svg
                    className="flex-shrink-0 inline w-4 h-4 mr-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">{signupError}</span>
                  </div>
                </div>
              )}
              <button
                onClick={handleAuthSubmitButton}
                type="submit"
                className="w-full justify-center text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
              >
                {textContent['submitButton']}
              </button>
            </form>

            <button
              type="button"
              className="w-full justify-center text-white bg-[#616871] hover:bg-[#616871]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mr-2 mb-2"
              onClick={handleGithubButton}
            >
              <svg
                className="w-4 h-4 mr-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                  clipRule="evenodd"
                />
              </svg>
              {textContent['githubButton']}
            </button>

            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              {textContent['haveAccount']}

              <Link
                href={type === 'register' ? '/login' : '/register'}
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                {textContent['haveAccountLink']}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthForm;
