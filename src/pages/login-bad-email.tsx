import { type NextPage } from "next";
import Link from "next/link";

const LoginBadEmail: NextPage = () => {

    return (
        <div>
            <main className="container flex flex-col justify-center items-center">
                <h1>Login Error</h1>
                <div>
                    Nameless is for NEU students only. As such, you must supply a valid Northeastern email to 
                    create an account and log in.
                </div>
                <Link href="/">Back to landing page</Link>
            </main>
        </div>
    )
};

export default LoginBadEmail;