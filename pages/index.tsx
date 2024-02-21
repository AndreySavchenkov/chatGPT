import styles from '../styles/Home.module.scss'
import {Controller, useForm} from "react-hook-form";
import {ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi} from "openai";
import {FC, ReactNode, useEffect, useRef, useState} from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
// import {withAuth} from "../hoocs/withAuth";
import Image from "next/image";
import copy from '../public/copy.svg';
import library from '../public/library.svg'
import {toast} from "react-toastify";
import axios from "axios";
import {getToken} from "../helper/token";
import ReactMarkdown from "react-markdown";

type FormType = {
  request: string
}

type Message = {
  role: ChatCompletionRequestMessageRoleEnum,
  content: any,
}

type HomeProps = {
  apiKey: string;
  articles: any;
}

const Home: FC<HomeProps> = ({apiKey}) => {
  const [messages, setMessages] = useState<Message[]>([{role: ChatCompletionRequestMessageRoleEnum.User, content: ''}])
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {control, handleSubmit, reset} = useForm({defaultValues: {request: ''}});

  const configuration = new Configuration({
    apiKey: apiKey,
  })

  function handleCopyClick(event: React.MouseEvent, text: string) {
    event.preventDefault();
    navigator.clipboard.writeText(text);
    toast.success('Text added to clipboard!');
  }

  const openai = new OpenAIApi(configuration);

  const onSubmit = async (data: FormType) => {
    setIsLoading(true);
    reset();

    setMessages((prevMessages) => [...prevMessages, {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: data.request
    }]);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [...messages, {role: ChatCompletionRequestMessageRoleEnum.User, content: data.request}],
      user: 'sandvik16',
    });

    setMessages((prevMessages) => [...prevMessages, {
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      // @ts-ignore
      content: response.data.choices[0].message.content || '',
    }]);
    setIsLoading(false);
  }

  function replaceCodeInString(inputString: string): ReactNode {
    const regex = /`{3}([\s\S]+?)`{3}/g;
    const parts = inputString.split(regex);

    const nodes: ReactNode[] = [];
    parts.forEach((part, i) => {
      if (i % 2 === 0) {
        nodes.push(<ReactMarkdown key={i}>{part}</ReactMarkdown>);
      } else {
        nodes.push(<SyntaxHighlighter key={i} language={'typescript'}>{part}</SyntaxHighlighter>);
      }
    });

    return <>{nodes}</>;
  }

  const token = getToken();

  const createArticle = async (text: string) => {
    try {

      const meResponse = await axios(`https://limitless-hollows-24003.herokuapp.com/api/users/me`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      await axios.post(`https://limitless-hollows-24003.herokuapp.com/api/articles`,
        {
          data: {
            text,
            userId: String(meResponse.data.id),
          }
        }, {
          headers: {Authorization: `Bearer ${token}`},
        });

      toast.success('Text added to your library!');
    } catch (error) {
      console.error(error);
      toast.error('Some error');
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [messages]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Chat GPT</div>
      <div className={styles.innerContainer}>
        <div className={styles.messages}>
          {messages.map((message, index) => {
            if (index !== 0) {
              return (
                <div key={index} style={{flexDirection: message.role === 'user' ? 'row-reverse' : 'row'}}
                     className={styles.message}>
                  <span className={styles.message_role}>{message.role === 'user' ? 'You' : 'AI'}</span>
                  <div className={styles.message_content}>
                    {replaceCodeInString(message.content)}
                  </div>
                  {
                    message.role !== 'user' && (
                      <>
                        <Image className={styles.copyIcon} src={copy} onClick={(e) => handleCopyClick(e, message.content)}
                               alt={'clipboard icon'} width={20} height={20}/>
                        <Image className={styles.libraryIcon} src={library}
                               onClick={(e) => createArticle(message.content)} alt={'clipboard icon'} width={20}
                               height={20}/>
                      </>
                    )
                  }
                </div>
              )
            }
          })}
          <div ref={messagesEndRef}/>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Controller
            control={control}
            name='request'
            render={({field}) => (
              <input
                type="text"
                {...field}
                disabled={isLoading}
              />
            )}
          />
          <button type='submit' disabled={isLoading}>{isLoading ? 'Loading...' : 'Send'}</button>
        </form>
      </div>
    </div>
  )
}

// export default withAuth(Home);
export default Home;