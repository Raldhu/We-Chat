import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isFirstMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  isLastMessage
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import ProfilePictureModal from "./miscellaneous/ProfilePictureModal"
import { Avatar, Tooltip, useDisclosure } from "@chakra-ui/react";

function ScrollableChat({ messages }) {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", alignItems: "center" }} key={m._id}>
            {(
              isFirstMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <ProfilePictureModal
                  user={m.sender}
                  icon={
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                  }
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft:isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                alignSelf: m.sender._id === user._id ? "flex-end" : "flex-start",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
