import {Message} from "@/Model/User";

export interface ApiResponse{
  success : boolean,
  message: string,
  isAccesptingMessage?: boolean,
  Messages?: Array<Message>
}