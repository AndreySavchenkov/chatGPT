import styles from '../styles/Home.module.scss'
import {Controller, useForm} from "react-hook-form";
import {ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi} from "openai";
import {useEffect, useRef, useState} from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';



type FormType = {
  request: string
}

type Message = {
  role: ChatCompletionRequestMessageRoleEnum,
  content: any,
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([{role: ChatCompletionRequestMessageRoleEnum.User, content: ''}])
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {control, handleSubmit, reset} = useForm({defaultValues: {request: ''}});

  const configuration = new Configuration({
    apiKey: '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',
  })

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

  function replaceCodeInString(inputString: string): React.ReactNode {
    const regex = /`{3}([\s\S]+?)`{3}/g;
    const parts = inputString.split(regex);

    const nodes: React.ReactNode[] = [];
    parts.forEach((part, i) => {
      if (i % 2 === 0) {
        nodes.push(<span key={i}>{part}</span>);
      } else {
        nodes.push(<SyntaxHighlighter key={i} language={'typescript'}>{part}</SyntaxHighlighter>);
      }
    });

    return <>{nodes}</>;
  }


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
          {messages.map((message, index) => (
            <div key={index} style={{flexDirection: message.role === 'user' ? 'row-reverse' : 'row'}}
                 className={styles.message}>
              <span className={styles.message_role}>{message.role}</span>
              <div className={styles.message_content}>
                {replaceCodeInString(message.content)}
              </div>
            </div>
          ))}
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
