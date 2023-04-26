import React, {useState} from 'react';
import {Controller, useForm} from "react-hook-form";
import styles from './index.module.scss';
import axios from "axios";
import {setToken} from "../../helper/token";
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import Link from 'next/link';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {handleSubmit, control} = useForm();

  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`https://limitless-hollows-24003.herokuapp.com/api/auth/local`, {
        identifier: data.email,
        password: data.password,
      })
      if(response.status === 200) {
        toast.success('Login successful!');
        await setToken(response.data.jwt);
        router.push('/');
      } else {
        toast.error('Failed to login');
      }
    } catch (error) {
      toast.error('Failed to login');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <span className={styles.form_title}>Sign In</span>
        <div className={styles.form_field}>
          <span className={styles.form_label}>Email:</span>
          <Controller
            name={'email'}
            control={control}
            render={({field}) => (
              <input className={styles.form_input} type='email' {...field}/>
            )}/>
        </div>
        <div className={styles.form_field}>
          <span className={styles.form_label}>Password:</span>
          <Controller
            name={'password'}
            control={control}
            render={({field}) => (
              <input className={styles.form_input} type='password' {...field}/>
            )}/>
        </div>
        <div>
          <span className={styles.form_subtitle}>If you don not have an account: </span>
          <Link href='/sign-up' className={styles.form_link}>Sign Up</Link>
        </div>

        <button className={styles.form_button} type='submit'>{isLoading ? '...' : 'Sign In'}</button>
      </form>
    </div>
  );
};

export default Index;