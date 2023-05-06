import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router"

import { signOut, useSession } from "next-auth/react";
import { TeacherSearch } from "~/components/TeacherSearch"

interface TabProps {
    title: string;
    isActive: boolean; 
    onClick: () => void;
}
const Tab: React.FC<TabProps> = ({ title, isActive = false, onClick }) => {
    return (
        <button onClick={onClick} className={isActive ? "underline underline-offset-8" : ""}>
            {title}
        </button>   
    );
};
 

const Home: NextPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const {data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated" || !session) {
            void router.push("/");
        }
    });

    if (status === "authenticated") {
        return (
            <main className="w-screen h-screen flex flex-col justify-normal">
                <div className="w-screen h-2/6 flex flex-row space-between">
                    <div className="font-bold">Your Dashboard</div>
                    <div className="flex flex-col justify-evenly">
                        <div>{session.user?.email}</div>
                        <button className="rounded-full border" onClick={() => void signOut({ callbackUrl: '/' })}>Sign out</button>

                    </div>
                </div>
                <div className="w-screen h-1/6 fixed top-0 left-0 flex flex-row">
                    <Tab title={"Teacher Search"} isActive={false} onClick={() => setActiveTab(0)} />
                    <Tab title={"My Messages"} isActive={false} onClick={() => setActiveTab(1)} />
                </div>
                <div>
                    {[<TeacherSearch key={0}/>][activeTab]}
                </div>
            </main>
        );

    } else {
        return (
            <div>Loading...</div>
        )
    }
};

export default Home;
