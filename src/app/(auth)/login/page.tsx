import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <main className="relative flex items-center justify-center bg-linear-to-br from-sky-200 via-blue-200 to-gray-300 min-h-dvh overflow-hidden p-4 sm:p-6">
      <p className="absolute left-1/2 top-2/6 -translate-x-1/2 -translate-y-1/2 z-10 text-8xl md:text-7xl font-black tracking-[0.3em] uppercase bg-linear-to-r from-green-500 via-blue-500 to-red-500 bg-size-[300%_300%] bg-clip-text text-transparent animate-gradient-x animate-[gradientX_20s_ease_infinite]">
        UNIVA
      </p>
      <div className="relative z-20 w-full max-w-lg px-4 sm:px-0">
        <div className="rounded-2xl backdrop-blur-2xl shadow-2xl mt-20 overflow-hidden border flex flex-col md:flex-row">
          <div className="flex flex-col justify-center gap-4 p-6 md:p-8 w-full">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
