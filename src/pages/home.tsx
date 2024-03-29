import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router"

import { signOut, useSession } from "next-auth/react";
import { TeacherSearch } from "~/components/TeacherSearch"
import { MyMessages } from "~/components/MyMessages";

type TabProps = {
    title: string;
    onClick: () => void;
    isActive: boolean;
}
const Tab: React.FC<TabProps> = ({ title, onClick, isActive=false}) => {
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
        if (status === "unauthenticated") {
            void router.push("/");
        }
    });

    if (status === "authenticated" && session) {
        return (
            <main className="w-screen h-screen flex flex-col justify-normal">
                <div className="w-screen h-2/6 flex flex-row justify-between">
                    <div className="font-bold">Your Dashboard</div>
                    <div className="flex flex-col justify-evenly">
                        <div>{session.user?.email}</div>
                        <button className="rounded-full border" onClick={() => void signOut({ callbackUrl: '/' })}>Sign out</button>
                    </div>
                </div>
                <div className="w-screen h-24 flex flex-row justify-start space-x-4 bg-slate-300">
                    <Tab title={"Teacher Search"} onClick={() => setActiveTab(0)} isActive={activeTab === 0}/>
                    <Tab title={"My Messages"} onClick={() => setActiveTab(1)} isActive={activeTab === 1}/>
                </div>
                <div>
                    {[<TeacherSearch key={0}/>, <MyMessages key={1}/>][activeTab]}
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
