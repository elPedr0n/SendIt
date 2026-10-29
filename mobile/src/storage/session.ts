import Storage from 'expo-sqlite/kv-store';

// Sem auth no MVP: o id do usuário criado no onboarding identifica a sessão.
const USER_ID_KEY = 'sendit.userId';

export const sessionStorage = {
  getUserId: (): string | null => Storage.getItemSync(USER_ID_KEY),
  setUserId: (id: string) => Storage.setItemSync(USER_ID_KEY, id),
  clear: () => {
    Storage.removeItemSync(USER_ID_KEY);
  }
};
