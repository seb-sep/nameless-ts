import { api } from "~/utils/api";

export const MyMessages: React.FC = () => {
    
    const { data: messages } = api.messages.getStudentMessages.useQuery();
    return (
        <div className="w-full h-full grid grid-cols-3 gap-4">
            {messages?.map((msg) => <MessageCard key={msg.id} teacher={msg.teacher.name} message={msg.content} />) }
        </div>
    )
}

type MessageCardProps = {
    teacher: string,
    message: string
}
const MessageCard: React.FC<MessageCardProps> = ({teacher, message}) => {
    return (
        <div className="outline flex flex-col items-center">
            <h1>{teacher}</h1>
            <div>{message}</div>
        </div>
    )
}