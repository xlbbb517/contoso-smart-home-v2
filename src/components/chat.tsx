"use client";

import { useEffect, useRef, useState, useReducer } from "react";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  CameraIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Turn from "./turn";
import { ChatTurn, ChatType } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import Video from "./video";
import {
  sendGroundedMessage,
  sendPromptFlowMessage,
  sendVisualMessage,
} from "@/lib/messaging";
import { getImageWithTimestamp } from "@/lib/imageUtils";

interface ChatAction {
  type: "add" | "clear" | "replace";
  payload?: ChatTurn;
}

interface ChatState {
  turns: ChatTurn[];
}

function chatReducer(state: ChatState, action: ChatAction) {
  switch (action.type) {
    case "add":
      return { turns: [...state.turns, action.payload!] };
    case "clear":
      return { turns: [] };
    case "replace":
      return {
        turns: [...state.turns.slice(0, -1), action.payload!],
      };
    default:
      throw new Error();
  }
}

export const Chat = () => {
  const [showChat, setShowChat] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [video, setVideo] = useState(false);
  const [message, setMessage] = useState("");
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [chatType, setChatType] = useState<ChatType>(ChatType.Grounded);

  const [state, dispatch] = useReducer(chatReducer, { turns: [] });

  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams.getAll("type");
    if (params.includes("grounded")) {
      setShowCamera(false);
      setChatType(ChatType.Grounded);
    } else if (params.includes("video")) {
      setVideo(true);
      setShowCamera(true);
      setChatType(ChatType.Video);
    } else if (params.includes("visual")) {
      setShowCamera(true);
      setChatType(ChatType.Visual);
    } else {
      setShowCamera(false);
      setChatType(ChatType.PromptFlow);
    }
  }, [searchParams]);

  const chatDiv = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const scrollChat = () => {
    setTimeout(() => {
      if (chatDiv.current) {
        chatDiv.current.scrollTo({
          top: chatDiv.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 10);
  };

  useEffect(() => {
    scrollChat();
  }, [state.turns.length, currentImage]);

  const activateFileInput = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const getImage = () => {
    if (video) {
      // ask for camera access
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // show camera
          setShowVideo(true);
        })
        .catch((err) => {
          console.log(err);
          if (
            err.name == "NotAllowedError" ||
            err.name == "PermissionDeniedError"
          ) {
            alert("Please allow camera access to use this feature.");
          } else {
            setShowVideo(true);
          }
        });
    } else {
      activateFileInput();
    }
  };

  const readFile = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target) return resolve(null);
        if (typeof e.target?.result === "string")
          return resolve(e.target?.result);
        else return resolve(null);
      };
      reader.readAsDataURL(file);
    });
  };

  const reset = () => {
    setCurrentImage(null);
    setMessage("");
    dispatch({ type: "clear" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    readFile(file!).then((data) => {
      if (!data) return;
      setCurrentImage(data);
      e.target.value = "";
    });
  };

  const sendMessage = () => {
    const newTurn: ChatTurn = {
      name: "User",
      message: message,
      status: "done",
      type: "user",
      avatar: "",
      image: currentImage,
    };

    const t0 = performance.now();

    if (chatType === ChatType.Grounded) {
      // using "Add Your Data"
      if (message === "") return;
      dispatch({ type: "add", payload: newTurn });
      sendGroundedMessage(newTurn).then((responseTurn) => {
        const t1 = performance.now();
        console.log(`sendGroundedMessage took ${t1 - t0} milliseconds.`);
        dispatch({ type: "replace", payload: responseTurn });
      });
    } else if (chatType === ChatType.Visual || chatType === ChatType.Video) {
      // visual prompt flow
      if (message === "" && !currentImage) return;
      dispatch({ type: "add", payload: newTurn });

      sendVisualMessage(newTurn).then((responseTurn) => {
        const t1 = performance.now();
        console.log(`sendPromptFlowMessage took ${t1 - t0} milliseconds.`);
        dispatch({ type: "replace", payload: responseTurn });
      });
    } else {
      // standard prompt flow
      if (message === "") return;
      dispatch({ type: "add", payload: newTurn });

      sendPromptFlowMessage(newTurn).then((responseTurn) => {
        const t1 = performance.now();
        console.log(`sendPromptFlowMessage took ${t1 - t0} milliseconds.`);
        dispatch({ type: "replace", payload: responseTurn });
      });
    }

    setTimeout(() => {
      dispatch({
        type: "add",
        payload: {
          name: "Meow Assistant",
          message: "Let me help you with that...",
          status: "waiting",
          type: "assistant",
          avatar: "",
          image: null,
        },
      });
    }, 400);

    setMessage("");
    setCurrentImage(null);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    if (!showChat) {
      scrollChat();
      if (state.turns.length === 0) {
        setTimeout(() => {
          dispatch({
            type: "add",
            payload: {
              name: "Meow Assistant",
              message:
                "Hi! I'm your Contoso smart home assistant. How can I help you today? Ask me about our products, smart home setup, or troubleshooting tips.",
              status: "done",
              type: "assistant",
              avatar: "",
              image: null,
            },
          });
        }, 400);
      }
    }
  };

  const onVideoClick = (dataUrl: string): void => {
    setCurrentImage(dataUrl);
    setShowVideo(false);
  };

  const onVideoClose = (): void => {
    setShowVideo(false);
  };

  return (
    <>
      <div className="fixed bottom-0 right-0 mr-12 mb-12 z-10 flex flex-col items-end">
        {showChat && (
          <div className="mb-3 h-[calc(100vh-7rem)] shadow-sm border border-gray-100 bg-white rounded-xl w-[650px] flex flex-col">
            <div className="text-right p-2 flex flex-col">
              <ArrowPathIcon className="w-5 stroke-secondary hover:stroke-secondary-light transition-colors cursor-pointer" onClick={reset} />
            </div>
            {/* chat section */}
            <div
              className="grow p-2 overscroll-contain overflow-auto"
              ref={chatDiv}
            >
              <div className="flex flex-col gap-4">
                {state.turns.map((turn, i) => (
                  <Turn key={i} turn={turn} type={chatType} />
                ))}
              </div>
            </div>
            {/* image section */}
            {currentImage && (
              <div className="pt-3 pl-3 pr-3 hover:cursor-pointer">
                <img
                  src={currentImage.startsWith('data:') ? currentImage : getImageWithTimestamp(currentImage)}
                  className="object-contain w-full h-full rounded-lg"
                  alt="Current Image"
                  onClick={() => setCurrentImage(null)}
                />
              </div>
            )}
            {/* chat input section */}
            <div className="p-3 flex gap-3">
              <input
                id="chat"
                name="chat"
                type="text"
                value={message}
                placeholder="Ask about our smart home products..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={(e) => {
                  if (e.code === "Enter") sendMessage();
                }}
                className="block p-2 grow rounded-lg text-secondary-light shadow-sm border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
              />
              <button
                className="rounded-lg p-2 border border-gray-200 hover:bg-hover transition-colors cursor-pointer"
                onClick={sendMessage}
              >
                <PaperAirplaneIcon className="w-6 stroke-secondary hover:stroke-secondary-light transition-colors" />
              </button>
              {showCamera && (
                <>
                  <button
                    className="rounded-lg p-2 border border-gray-200 hover:bg-hover transition-colors cursor-pointer"
                    onClick={getImage}
                  >
                    <CameraIcon className="w-6 stroke-secondary hover:stroke-secondary-light transition-colors" />
                  </button>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    ref={fileInput}
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>
          </div>
        )}
        <div
          className="bg-secondary-dark text-white rounded-full p-3 shadow-sm hover:bg-opacity-90 cursor-pointer transition-colors"
          onClick={toggleChat}
        >
          {showChat ? (
            <XMarkIcon className="w-6" />
          ) : (
            <ChatBubbleLeftRightIcon className="w-6" />
          )}
        </div>
      </div>
      {showVideo && (
        <Video onVideoClick={onVideoClick} onClose={onVideoClose} />
      )}
    </>
  );
};

export default Chat;
