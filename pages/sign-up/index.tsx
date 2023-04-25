import React from 'react';
import {Controller, useForm} from "react-hook-form";
import styles from './index.module.scss';
import axios from "axios";

const Index = () => {
  const {handleSubmit, control} = useForm();

  const onSubmit = async (data: any) => {
    console.log(data);
    await axios.post(`${process.env.STRAPI_URL}auth/local/register`, {
      email: data.email,
      password: data.password,
      username: data.userName,
    })
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <span>Registration</span>
        <div className={styles.form_field}>
          <span>User Name</span>
          <Controller
            name={'userName'}
            control={control}
            render={({field}) => (
              <input {...field}/>
            )}/>
        </div>
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
        <button type='submit'>Registration</button>
      </form>
    </div>
  );
};

export default Index;