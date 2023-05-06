import { useState } from "react";
import { api } from "~/utils/api";
import { TeacherCard } from "./TeacherCard";
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from "~/server/api/root"

type RouterOutput = inferRouterOutputs<AppRouter>;
type Teacher = RouterOutput["teachers"]["searchTeacher"][0];

export const TeacherSearch: React.FC = () => {
        
    const [searchText, setSearchText] = useState("");
    const [teachers, setTeachers] = useState([] as Teacher[]);

    const searchTeachers = () => {
        const {data} = api.teachers.searchTeacher.useQuery({content: searchText});
        if (data) {
            setTeachers(data);
        }
    }


    return (
        <div className="w-full h-full">
            <input className="relative top-5 left-5"
            value={searchText} 
            type="text" 
            defaultValue={"Enter teacher name here"} 
            onChange={e => {setSearchText(e.target.value)}}
            onKeyDown={e => {if (e.key === "Enter") {searchTeachers();}}}/>
            <div>
                {teachers.map(teacher => <TeacherCard key={teacher.id} id={teacher.id} name={teacher.name} college={teacher.college} />)}
            </div>

        </div>

    )
} 
