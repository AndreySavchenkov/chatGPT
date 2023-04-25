import React from 'react';
import {Controller, useForm} from "react-hook-form";
import styles from './index.module.scss';
import axios from "axios";
import {setToken} from "../../helper/token";
import {useRouter} from "next/router";

const Index = () => {
  const {handleSubmit, control} = useForm();

  const router = useRouter();
console.log(process.env.STRAPI_URL)
  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(`https://limitless-hollows-24003.herokuapp.com/api/auth/local`, {
        identifier: data.email,
        password: data.password,
      })

      if(response.status === 200) {
        console.log('response', response)
        await setToken(response.data.jwt);
        router.push('/');
      } else {
        console.log('response wit success->', response);
      }

    } catch (error) {
      console.log('error->', error)
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <span>Sign In</span>
        <div className={styles.form_field}>
          <span>Email</span>
          <Controller
            name={'email'}
            control={control}
            render={({field}) => (
              <input {...field}/>
            )}/>
        </div>
        <div className={styles.form_field}>
          <span>Password</span>
          <Controller
            name={'password'}
            control={control}
            render={({field}) => (
              <input {...field}/>
            )}/>
        </div>
        <button type='submit'>Sign In</button>
      </form>
    </div>
  );
};

export default Index;