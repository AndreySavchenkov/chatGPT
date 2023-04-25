import React, {useState} from 'react';
import {Controller, useForm} from "react-hook-form";
import styles from './index.module.scss';
import axios from "axios";
import {useRouter} from "next/router";
import {toast} from "react-toastify";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {handleSubmit, control} = useForm();

  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true)
      await axios.post(`https://limitless-hollows-24003.herokuapp.com/api/auth/local/register`, {
        email: data.email,
        password: data.password,
        username: data.userName,
      }).then(() => {
        toast.success('Registration was successful!');
        router.push('/sign-in')
      })
    } catch (error) {
      toast.error('Failed to register');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <span className={styles.form_title}>Sign Up</span>
        <div className={styles.form_field}>
          <span className={styles.form_label}>Name:</span>
          <Controller
            name={'userName'}
            control={control}
            render={({field}) => (
              <input className={styles.form_input} {...field}/>
            )}/>
        </div>
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
          <span>Password must be at least 6 characters</span>
        </div>
        <button disabled={isLoading} className={styles.form_button}
                type='submit'>{isLoading ? '...' : 'Registration'}</button>
      </form>
    </div>
  );
};

export default Index;