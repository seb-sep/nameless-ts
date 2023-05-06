import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import type { FormEvent } from "react";
import { useState } from "react";

//This will be the login page
const Landing: NextPage = () => {

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Nameless
          </h1>
          <h6>Give anonymous feedback to your teachers for a better class experience.</h6>
          <Login />
        </div>
      </main>
    </>
  );
};

export default Landing;


const Login: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitted form");
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    // Wrap the async call to signIn inside an anonymous arrow function
    void (async () => {
      await signIn("email", { inputValue, callbackUrl: "/home" });
      //await signIn();
    })();
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" onChange={(e) => setInputValue(e.target.value)} />
        </label>
        <button type="submit">Send Verification Email</button>
      </form>
    </div>
  );
};

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
          </div>
  );
};
