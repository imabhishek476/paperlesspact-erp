import { InputAdornment, TextField } from "@mui/material";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { SendHorizonal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Doc, Text, Array } from "yjs";
import { WebsocketProvider } from "y-websocket";
import { formatDate, formattedTime } from "@/Utils/dateTimeHelpers";

const createChatDoc = () => {
  const doc = new Doc();

  // Shared types for the chat application
  doc.define("messages", Array);
  doc.define("inputText", Text);

  return doc;
};
const groupMessagesByDay = (messages) => {
  const groupedMessages = {};

  messages.forEach((message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return groupedMessages;
};
const filterMessagesLast3Days = (messages) => {
  const currentDate = new Date();
  const threeDaysAgo = currentDate.setDate(currentDate.getDate() - 2); // Subtract 2 days for a total of 3 days
  let temp = messages.filter((message) => {
    const messageDate = new Date(message.timestamp);
    return messageDate >= threeDaysAgo;
  });
  temp = temp.reverse();
  return temp;
};
const ChatComponent = ({ userDetails, roomId }) => {
  const [messages, setMessages] = useState([]);
  const [sortedMessages, setSortedMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [doc, setDoc] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const filteredMessages = filterMessagesLast3Days(messages);
    const groupedMessages = groupMessagesByDay(filteredMessages);

    setSortedMessages(groupedMessages);
  }, [messages]);
  useEffect(() => {
    const createWebsocketProvider = () => {
      const ydoc = new Doc();
      const wsProvider = new WebsocketProvider(
        "wss://20.204.17.85:4001",
        `chat-${roomId}`,
        ydoc
      );
      // console.log(roomId);

      wsProvider.on("status", (event) => {
        if (event.status === "connected") {
          console.log(event.status);
          setDoc(wsProvider.doc);
        }
      });

      wsProvider.on("error", (error) => {
        console.error("Websocket error:", error);
        setTimeout(() => {
          wsProvider.destroy();
          createWebsocketProvider();
        }, 3000);
      });

      return wsProvider;
    };

    const wsProvider = createWebsocketProvider();

    return () => {
      wsProvider.destroy();
    };
  }, []);

  useEffect(() => {
    if (doc) {
      const messagesArray = doc.getArray("messages");
      // console.log(messagesArray.toArray());
      const updateMessages = () => {
        setMessages(messagesArray.toArray());
      };

      messagesArray.observe(updateMessages);

      return () => {
        messagesArray.unobserve(updateMessages);
      };
    }
  }, [doc]);

  const handleSendMessage = () => {
    if (inputText.trim() !== "" && doc) {
      const newMessage = {
        text: inputText,
        user: {
          id: userDetails?.data?.id,
          fullname: userDetails?.data?.fullname,
        },
        timestamp: new Date().toISOString(),
      };
      // console.log(newMessage);
      doc.getArray("messages").push([newMessage]);
      //   const messagesArray = doc.getArray("messages");
      //   messagesArray.delete(0, messagesArray.length);
      setInputText("");
    }
  };
  return (
    <div className="h-full w-full flex flex-col items-center">
       <div className="flex w-full border-b-2 p-4 justify-between items-center">
          <span className="text-[14px] text-[#05686E]">Chat</span>
          </div>
      <div
        id="chatBody"
        className="w-full h-[70vh]  p-3  flex flex-col  justify-end bg-[#E4E4E480] rounded-t-lg"
      >
       
        {doc && sortedMessages && (
          <div className="flex flex-col-reverse overflow-y-scroll customScrollBar ps-2">
            {Object.keys(sortedMessages).map((day) => {
  // console.log(day);

              return (
                <>
                  {sortedMessages[day].reverse().map((message, index) => {
                    if (message?.user?.id === userDetails?.data?.id) {
                      return (
                        <div key={index} className="w-full flex justify-end">
                          <Card
                            className="max-w-[80%] min-w-[40%] my-1 rounded-b-lg rounded-tl-lg bg-[#FFF] shadow-none"
                            radius="none"
                          >
                            <CardBody className="px-3 pb-1 pt-2 text-[11px] text-[#151513d3]">
                              <p>{message.text}</p>
                            </CardBody>
                            <CardFooter className="p-0">
                              <div className="flex w-full gap-x-2 px-3 pb-2 justify-end">
                                <span className="text-[9px] font-[500] text-[#15151379]">
                                  {formattedTime(message.timestamp)}
                                </span>
                              </div>
                            </CardFooter>
                          </Card>
                          <div class="top-1 relative w-0 h-0 border-t-[13px] border-r-[10px] border-t-[#FFF] border-r-transparent"></div>
                        </div>
                      );
                    }
                    return (
                      <div key={index} className="w-full flex justify-start">
                        <Avatar
                          // as="button"
                          className="border-3 rounded-full border-[#E8713C]"
                          classNames={{
                            base: "bg-[#05686E] text-white text-[16px]",
                          }}
                          name={message?.user?.fullname.slice(0, 1)}
                          size="sm"
                          src={message?.user?.profileLink}
                        />
                        <div class="top-1 relative w-0 h-0 border-t-[13px] border-l-[10px] border-t-[#FFF] border-r-transparent"></div>
                        <Card
                          className="max-w-[80%] min-w-[40%] my-1 rounded-b-lg rounded-tr-lg shadow-none"
                          radius="none"
                        >
                          <CardHeader className="justify-between pb-1">
                            <div className="flex gap-2">
                              <div className="flex flex-col items-start justify-center">
                                <h4 className="text-[12px] text-[#05686E] font-semibold leading-none ">
                                  {message?.user?.fullname}
                                </h4>
                              </div>
                            </div>
                          </CardHeader>
                          <CardBody className="px-3 py-0 pb-1 pt-1 text-[11px] text-[#151513d3]">
                            <p>{message.text}</p>
                          </CardBody>
                          <CardFooter className="p-0">
                            <div className="flex w-full gap-x-2 px-3 pb-2 justify-end">
                              <span className="font-[500] text-[9px] text-[#15151379]">
                                {formattedTime(message.timestamp)}
                              </span>
                            </div>
                          </CardFooter>
                        </Card>
                      </div>
                    );
                  })}
                  <div className="w-full flex justify-center my-3">
                    <span className="text-[14px] font-semibold text-[#1515137e]">
                      {day}
                    </span>
                  </div>
                </>
              );
            })}
          </div>
        )}
      </div>
      <div className="w-full px-5 py-4 bg-[#E4E4E480] rounded-b-lg">
        <TextField
          sx={{ width: "100%" }}
          id="outlined-basic"
          name="text"
          size="small"
          placeholder="Type a message...."
          color="secondary"
          variant="outlined"
          onKeyDown={
            (e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }
        }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          InputProps={{
            maxLength: 10,
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  type="button"
                  size="sm"
                  radius="sm"
                  className="bg-[#05686E] hover:text-[white] hover:bg-[black] "
                  isIconOnly
                  onClick={handleSendMessage}
                  //   isLoading={isSubmitting}
                >
                  <SendHorizonal className="text-white w-4 h-4" />
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default ChatComponent;
