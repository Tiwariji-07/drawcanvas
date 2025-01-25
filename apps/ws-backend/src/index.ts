import {WebSocketServer} from "ws"; 
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from '@repo/backend-common/config'
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws,request) => {
   const url = request.url;
   if(!url){
    return
   }

   const queryParams = new URLSearchParams(url.split('?')[1]);
   const token = queryParams.get('token') ?? "";
    const decoded = jwt.verify(token,JWT_SECRET) 

    if(!decoded || !(decoded as JwtPayload).userId){
        ws.close()
        return
    }
    ws.send('hello')
})