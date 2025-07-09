import React, { Component } from "react";
import axios from "axios";
import Message from "./Message";
import Card from "./Cards";
import QuickReplies from "./QuickReplies";
import Cookies from "universal-cookie";
import { v4 as uuidv4 } from "uuid";

const cookies = new Cookies();

class Chatbot extends Component {
  messagesEnd;

  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleQuickReplyPayload = this.handleQuickReplyPayload.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      messages: [],
      showBot: true,
      shopWelcomeSent: false
    };

    if (cookies.get("userID") === undefined) {
      cookies.set("userID", uuidv4(), { path: "/" });
    }
    console.log(cookies.get("userID"));
  }

  async df_text_query(text) {
    console.log('text', text)
    console.log('secons')
    let says = {
      speaks: "me",
      msg: {
        text: { text }
      }
    };
    this.setState({ messages: [...this.state.messages, says] });
    try {
      const res = await axios.post("http://localhost:5000/api/df_text_query", {
        text,
        userID: cookies.get("userID")
      });
      console.log('res', res)
      const newMessages = res.data.fulfillmentMessages.map(msg => ({
        speaks: "bot",
        msg: msg
      }));
      this.setState(prevState => ({
        messages: [...prevState.messages, ...newMessages]
      }));
     
    } catch (e) {
      console.error('Error sending text query', e);
      says = {
        speaks: "bot",
        msg: {
          text: {
            text: "I'm having trouble. Please try again later."
          }
        }
      };
      this.setState({ messages: [...this.state.messages, says] });
      setTimeout(() => this.setState({ showBot: false }), 2000);
    }
  }

  async componentDidMount() {
    this.df_text_query("hi");
  }

  componentDidUpdate() {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
    if (this.talkInput) {
      this.talkInput.focus();
    }
  }

  show() {
    this.setState({ showBot: true });
  }

  hide() {
    this.setState({ showBot: false });
  }

  handleQuickReplyPayload(event, text) {
    console.log('first')
    event.preventDefault();
    event.stopPropagation();
    this.df_text_query(text);
  }

  renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
  }

  renderOneMessage(message, i) {
    console.log('message', message)
    if (message.msg?.text?.text) {
      return (
        <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
      );
    } else if (message.msg?.payload?.fields?.cards) {
      return (
        <div key={i} className="card mt-2">
          <div className="card-body">
            <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
              {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
            </div>
          </div>
        </div>
      );
    } else if (message.msg?.payload?.fields?.quick_replies) {
      return (
        <QuickReplies
          key={i}
          text={message.msg.payload.fields.text || ""}
          replyClick={this.handleQuickReplyPayload}
          speaks={message.speaks}
          payload={message.msg.payload.fields.quick_replies.listValue.values}
        />
      );
    }
  }

  renderMessages(messages) {
    console.log('messages', messages)
    return messages?.map((message, i) => this.renderOneMessage(message, i));
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.df_text_query(e.target.value);
      e.target.value = "";
    }
  }

  render() {
    const { showBot, messages } = this.state;
    console.log('messages+++++', messages)
    console.log('showBot', showBot)
    return (
      <div
        className="card"
        style={{
          minHeight: showBot ? "500px" : "40px",
          maxHeight: "500px",
          width: "400px",
          position: "absolute",
          bottom: 0,
          right: 0,
          border: "1px solid lightgray",
          overflow: "hidden"
        }}
      >
        {/* Bootstrap Navbar */}
        <nav className="navbar navbar-dark bg-primary p-2">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h5" style={{ marginLeft: 10 }}>
              Talk to me
            </span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={showBot ? this.hide : this.show}
            >
              {showBot ? "Close" : "Open"}
            </button>
          </div>
        </nav>

        {/* Chat Content */}
        {showBot && (
          <>
            <div
              id="chatbot"
              style={{
                height: "388px",
                width: "100%",
                overflowY: "auto",
                padding: "10px"
              }}
            >
              {this.renderMessages(messages)}
              <div
                ref={(el) => {
                  this.messagesEnd = el;
                }}
              />
            </div>
            <div className="p-2">
              <input
                ref={(input) => { this.talkInput = input; }}
                className="form-control"
                placeholder="Type a message..."
                type="text"
                onKeyPress={this.handleKeyPress}
              />
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Chatbot;
