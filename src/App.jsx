import React from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

const fetchUsers = async () => {
  const { data } = await axios.get('https://67180fecb910c6a6e02afe14.mockapi.io/users');
  return data;
};

const postUser = async (user) => {
  await axios.post("https://67180fecb910c6a6e02afe14.mockapi.io/users", user);
};

const deleteUser = async (userId) => {
  await axios.delete(`https://67180fecb910c6a6e02afe14.mockapi.io/users/${userId}`);
};

const updateUser = async ({ userId, user }) => {
  await axios.put(`https://67180fecb910c6a6e02afe14.mockapi.io/users/${userId}`, user);
};

function Example() {
  const queryClient = useQueryClient();
  
  const { isLoading, error, data } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5000,
  });

  const mutationAdd = useMutation({
    mutationFn: postUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  const mutationDelete = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  const mutationUpdate = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
    }
  })

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h2>Error: {error.message}</h2>;

  return (
    <>
      <h1>Usuarios</h1>
      <ul>
        {data.map(user => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => mutationDelete.mutate(user.id)}>Eliminar</button>
            <button onClick={() => mutationUpdate.mutate({ userId: user.id, user: { name: "Cristiaaaaaaaan" } })}>
              Actualizar
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => {
        mutationAdd.mutate({
          name: "David"
        });
      }}>
        Agregar Usuario
      </button>
    </>
  );
}

