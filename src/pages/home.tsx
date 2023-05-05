import { NextPage } from "next";
import { useState } from "react";

import { api } from "~/utils/api";
import { signIn, signOut } from "next-auth/react";
import { TeacherSearch } from "~/components/TeacherSearch";

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
 

export const Home: NextPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <main>
            <div className="w-screen h-10 fixed top-0 left-0 flex flex-row">
                <Tab title={"Teacher Search"} isActive={false} onClick={() => setActiveTab(0)} />
                <Tab title={"My Messages"} isActive={false} onClick={() => setActiveTab(1)} />
                <button onClick={() => void signOut({ callbackUrl: '/' })}>Sign out</button>
            </div>
            {activeTab === 0 && <TeacherSearch />}
        </main>
    );
};
