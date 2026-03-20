import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        <span className="text-orange-500">Ember</span>
      </h1>
      <p className="mt-4 max-w-md text-lg text-gray-500">
        写给重要的人。一个温暖的双人信件应用，用文字传递心意。
      </p>
      <p className="mt-1 max-w-md text-sm text-gray-400">
        Write to someone who matters. A warm letter app for two.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/signup"
          className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
        >
          开始使用 Get Started
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium hover:bg-gray-50"
        >
          登录 Sign In
        </Link>
      </div>
    </div>
  );
}
