import { useState } from "react"
import { api } from "~/utils/api"

interface TeacherCardProps {
    id: string,
    name: string,
    college: string,
}

interface MessagePopupProps {
    id: string,
    name: string,
    closeHandler: () => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({id, name, college}) => {

    const [displayPopup, setDisplayPopup] = useState(false);

    return (
        <div className="flex flex-col justify-around align-middle w-2/5 h-3/5 border">
            <h1>{name}</h1>
            <h6>{college}</h6>
            <button onClick={() => setDisplayPopup(true)}>Send a message</button>
            {displayPopup && <MessagePopup id={id} name={name} closeHandler={() => setDisplayPopup(false)} />}
        </div>
    );
};

const MessagePopup: React.FC<MessagePopupProps> = ({id, name, closeHandler}) => {
    const [content, setContent] = useState("");
    const sendMessageMutation = api.messages.sendMessage.useMutation();
    const handleSubmit = () => {
        console.log("Send message to teacher");
        sendMessageMutation.mutate({ teacherId: id, content: content});
        setContent("");
        closeHandler();
    };

    return (
        <div className="flex flex-col justify-around align-middle w-3/5 h-4/5 absolute left-1/4 top-1/4 border">
            <h1>Send a message to {name}</h1>
            <textarea value={content} onChange={e => setContent(e.target.value)}/>
            <button onClick={handleSubmit}>Submit Message</button>
            <button onClick={() => {setContent(""); closeHandler();}} className=" absolute top-5 right-5">X</button>
        </div>
    )
}