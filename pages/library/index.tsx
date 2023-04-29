import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import {getToken} from "../../helper/token";
import axios from "axios";
import {toast} from "react-toastify";
import styles from "./index.module.scss";
import SyntaxHighlighter from "react-syntax-highlighter";
import dayjs from "dayjs";
import Image from "next/image";
import deleteIcon from '../../public/delete.svg';
import ReactMarkdown from "react-markdown";

type ArticleType = {
  attributes: {
    createdAt: string;
    publishedAt: string;
    text: string;
    updatedAt: string;
    userId: string;
  },
  id: number;
}

const Index = () => {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const token = getToken();

  const getArticles = async () => {
    try {
      const meResponse = await axios(`https://limitless-hollows-24003.herokuapp.com/api/users/me`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      const response = await axios.get(`https://limitless-hollows-24003.herokuapp.com/api/articles`,
        {
          headers: {Authorization: `Bearer ${token}`},
        });
     setArticles(response.data.data);

    } catch (error) {
      console.error(error);
    }
  };


  const deleteArticle = async (id: number) => {
    try {
      const response = await axios.delete(`https://limitless-hollows-24003.herokuapp.com/api/articles/${id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        }).then(() => {
        setArticles(articles.filter(item => item.id !== id));
        toast.success('Deletion was successful')
      })

    } catch (error) {
      toast.error('An error occurred while deleting')
      console.error(error);
    }
  };

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

  useEffect(
    () => {getArticles()}, []
  )

  return (
    <div className={styles.messages}>
      {articles && (articles?.map((article) => (
        <div key={article.id} className={styles.message}>
          <div className={styles.message_content}>
            {replaceCodeInString(article.attributes.text)}
          </div>
          <div className={styles.message_info}>
            <span className={styles.message_date}>{dayjs(article.attributes.createdAt).format('DD.MM.YYYY hh:mm')}</span>
            <Image className={styles.message_delete} onClick={() => deleteArticle(article.id)} src={deleteIcon} alt={'delete icon'} width={24} height={24}/>
          </div>
        </div>
      )))}
    </div>
  );
};

export default Index;