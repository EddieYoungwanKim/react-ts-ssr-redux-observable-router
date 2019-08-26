import React, { FormEvent, useState, ChangeEvent } from 'react';

export default () => {
  const [loginForm, setLoginForm] = useState({
    id: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign in</h3>
      <label>
        ID:{' '}
        <input
          type="text"
          name="id"
          value={loginForm.id}
          onChange={handleChange}
          placeholder="enter you username"
        />
      </label>
      <label>
        Password:{' '}
        <input
          type="current-password"
          name="password"
          value={loginForm.password}
          onChange={handleChange}
          placeholder="enter password"
        />
      </label>
      <button type="submit" value="Login">
        Submit
      </button>
    </form>
  );
};
